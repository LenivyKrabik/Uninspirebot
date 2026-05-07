import type { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import WiseMan from "./services/wiseMan.ts";
import ElevenlabsAuthProxy from "./services/elevenlabsAuthProxy.ts";
import httpRequestWraper from "./services/httpRequestWrapper.ts";
import { Readable } from "stream";

const TotalyDBPath = "/home/lenivy_krabik/KPI/Uninspirebot/AbsolutleyTotalyADB/";
const SoundEffectFolder = "/home/lenivy_krabik/KPI/Uninspirebot/SoundEffects/";

const voiceId = "iiidtqDt9FBdT1vfBluA";
const audioOutputFormat = "mp3_22050_128";

const wisdomSource = new WiseMan(new ElevenlabsAuthProxy(new httpRequestWraper()), {
  voiceId: voiceId,
  audioOutputFormat: audioOutputFormat,
  totalyDBPath: TotalyDBPath,
});

const getTestTextWisdom = (req: FastifyRequest, reply: FastifyReply) => {
  reply.status(200).send("This is test wisdom, you allowed to not follow it");
};
const getTextWisdom = (req: FastifyRequest, reply: FastifyReply) => {
  const wisdomText = wisdomSource.Text();
  reply.status(200).send(wisdomText);
};
const getTextTimedAudioWisdom = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const timedAudio = await wisdomSource.TimedAudio();
    reply.status(200).header("content-type", "application/json").send(timedAudio);
  } catch (err: any) {
    switch (err.message) {
      case "Wisdom too long":
        reply.status(500).send({ error: "Wisdom text is suspicously long, extra precautions activated" });
        console.error("Wisdom text is suspicously long, extra precautions activated");
      case "No audio property in reply":
        reply.status(502).send({ error: "Reply from Elevenlabs was not what we expected, couldn't make you request" });
        console.error("Reply from Elevenlabs didn't have audio property");
      default:
        console.error("Failed to get textTimedAudio with memoization");
        reply.status(500).send({ error: "Internal error" });
        throw err;
    }
  }
};

const getSoundEffect = (req: FastifyRequest<{ Body: { id: number } }>, reply: FastifyReply) => {
  try {
    if ("id" in req.body && typeof req.body.id !== "number") {
      reply.status(400).send({ error: "Data sent had wrong type" });
      return;
    }
    const allSoundEffects = fs.readdirSync(SoundEffectFolder);
    const audio = fs.readFileSync(SoundEffectFolder + allSoundEffects[req.body.id]).toString("base64");
    reply.status(200).send({ audio });
  } catch (err) {
    console.error("Failed to get sound effect");
    reply.status(500).send({ error: "Internal error" });
    console.error(err);
  }
};

const getTextTimedAudioBatch = (req: FastifyRequest<{ Body: { amount: number } }>, reply: FastifyReply) => {
  if ("id" in req.body && typeof req.body.amount !== "number") {
    reply.status(400).send({ error: "Data sent had wrong type" });
    return;
  }

  async function* dataSource() {
    let errorCount = 0;
    for (let i = 0; i < req.body.amount; i++) {
      if (errorCount >= 3) {
        console.error("Too much errors while trying to get textTimedAudio in batches, stopping trying");
        return;
      }
      try {
        const timedAudio = await wisdomSource.TimedAudio();
        yield JSON.stringify(timedAudio) + "\n";
      } catch (err: any) {
        i--;
        errorCount++;
        switch (err.message) {
          case "Wisdom too long":
            console.error("Wisdom text is suspicously long, extra precautions activated");
          case "No audio property in reply":
            console.error("Reply from Elevenlabs didn't have audio property");
          default:
            console.error("Failed to get textTimedAudio with memoization");
            console.error(err);
        }
      }
    }
  }
  const dataStream = Readable.from(dataSource());

  reply.status(200).type("application/x-ndjson").send(dataStream);
};

export { getTestTextWisdom, getTextWisdom, getTextTimedAudioWisdom, getSoundEffect, getTextTimedAudioBatch };
