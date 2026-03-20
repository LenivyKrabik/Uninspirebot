import type { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import WisdomBuilder from "./wisdomBuilder.ts";
import wisdomComponentsStorage from "./wisdomComponentsStorage.json" with { type: "json" };
import AuthProxyElevenlabs from "./services/elevenlabs.ts";
import memoize from "./memoizationFunction.ts";

type Alignment = {
  characters: Array<string>;
  character_start_times_seconds: Array<number>;
  character_end_times_seconds: Array<number>;
};

type TextTimedAudio = {
  audio_base64: string;
  alignment: Alignment;
  text: string;
};

const TotalyDBPath = "/home/lenivy_krabik/KPI/Uninspirebot/AbsolutleyTotalyADB/";
const SoundEffectFolder = "/home/lenivy_krabik/KPI/Uninspirebot/SoundEffects/";

const voiceId = "iiidtqDt9FBdT1vfBluA";
const audioOutputFormat = "mp3_22050_128";

const wisdomGenerator = new WisdomBuilder(wisdomComponentsStorage);
const ElevenlabsProxy = new AuthProxyElevenlabs();
const cachedAPI = memoize(ElevenlabsProxy.makeRequest.bind(ElevenlabsProxy), TotalyDBPath, "unlimited", "LRU");

const getFormatedTextWisdom = () => {
  const wisdom = wisdomGenerator.createWisdom();
  let wisdomText = wisdom.showText();

  wisdomText = wisdomText.charAt(0).toUpperCase() + wisdomText.slice(1);
  if (wisdomText.charAt(wisdomText.length - 1) !== ".") wisdomText += ".";
  return wisdomText;
};
const getTestTextWisdom = (req: FastifyRequest, reply: FastifyReply) => {
  reply.status(200).send("This is test wisdom, you allowed to not follow it");
};
const getTextWisdom = (req: FastifyRequest, reply: FastifyReply) => {
  const wisdomText = getFormatedTextWisdom();
  reply.status(200).send(wisdomText);
};

const getTextTimedAudioWisdom = async (req: FastifyRequest, reply: FastifyReply) => {
  const wisdomText = getFormatedTextWisdom();
  if (wisdomText.length >= 300) {
    reply.status(500).send({ error: "Wisdom text is suspicously long, extra precautions activated" });
    throw new Error("Wisdom text is suspicously long, extra precautions activated");
  }

  //Making voiceover request
  const headers = new Headers().append("Content-Type", "application/json");
  try {
    const content: TextTimedAudio = await cachedAPI(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`, {
      method: "POST",
      body: JSON.stringify({
        text: wisdomText,
        output_format: audioOutputFormat,
      }),
      headers: headers,
    });

    if (!("audio" in content)) {
      reply.status(502).send({ error: "Reply from Elevenlabs was not what we expected, couldn't make you request" });
      throw new Error("Reply from Elevenlabs didn't have audio property");
    }

    //Process answer
    const timedAudio = {
      audio: content.audio_base64,
      alignment: content.alignment,
      text: wisdomText,
    };
    reply.status(200).header("content-type", "application/json").send(timedAudio);
  } catch (err) {
    console.log("Failed to get textTimedAudio with memoization");
    reply.status(500).send({ error: "Internal error" });
    throw err;
  }
};

const getSoundEffect = (req: FastifyRequest<{ Body: { id: number } }>, reply: FastifyReply) => {
  try {
    const allSoundEffects = fs.readdirSync(SoundEffectFolder);
    const audio = fs.readFileSync(SoundEffectFolder + allSoundEffects[req.body.id]).toString("base64");
    reply.status(200).send({ audio });
  } catch (err) {
    console.log("Failed to get sound effect");
    reply.status(500).send({ error: "Internal error" });
    throw err;
  }
};

export { getTestTextWisdom, getTextWisdom, getTextTimedAudioWisdom, getSoundEffect };
