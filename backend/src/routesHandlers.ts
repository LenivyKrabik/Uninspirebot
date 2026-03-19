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

const TotalyDBPath = "/home/lenivy_krabik/KPI/Uninspirebot/AbsolutleyTotalyADB/";
const SoundEffectFolder = "/home/lenivy_krabik/KPI/Uninspirebot/SoundEffects/";

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
  reply.send("This is test wisdom, you allowed to not follow it");
};
const getTextWisdom = (req: FastifyRequest, reply: FastifyReply) => {
  const wisdomText = getFormatedTextWisdom();
  reply.send(wisdomText);
};

const getTextTimedAudioWisdom = async (req: FastifyRequest, reply: FastifyReply) => {
  const wisdomText = getFormatedTextWisdom();

  //Making voiceover request
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  try {
    const content = await cachedAPI("https://api.elevenlabs.io/v1/text-to-speech/iiidtqDt9FBdT1vfBluA/with-timestamps", {
      method: "POST",
      body: JSON.stringify({
        text: wisdomText,
        output_format: "mp3_22050_128",
      }),
      headers: headers,
    });
    //Process answer

    //Deviding content
    const audio: string = content.audio_base64;
    const alignment: Alignment = content.alignment;
    const timedAudio = {
      audio: audio,
      alignment: alignment,
      text: wisdomText,
    };
    reply.header("content-type", "application/json").send(timedAudio);
  } catch (err) {
    console.log("Failed to get textTimedAudio with memoization");
    reply.status(500).send({ error: "Internal error" });
  }
};

const getSoundEffect = (req: FastifyRequest<{ Body: { id: number } }>, reply: FastifyReply) => {
  const allSoundEffects = fs.readdirSync(SoundEffectFolder);
  const audio = fs.readFileSync(SoundEffectFolder + allSoundEffects[req.body.id]).toString("base64");
  reply.send({ audio });
};

export { getTestTextWisdom, getTextWisdom, getTextTimedAudioWisdom, getSoundEffect };
