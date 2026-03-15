import type { FastifyReply, FastifyRequest } from "fastify";
import WisdomBuilder from "./wisdomBuilder.ts";
import wisdomComponentsStorage from "./wisdomComponentsStorage.json" with { type: "json" };
import AuthProxyElevenlabs from "./services/elevenlabs.ts";

type Alignment = {
  characters: Array<string>;
  character_start_times_seconds: Array<number>;
  character_end_times_seconds: Array<number>;
};

const wisdomGenerator = new WisdomBuilder(wisdomComponentsStorage);
const ElevenlabsProxy = new AuthProxyElevenlabs();

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

const getTextTimedAudioWisdom = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const wisdomText = getFormatedTextWisdom();

  //Making voiceover request
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const answer = await ElevenlabsProxy.makeRequest(
    "https://api.elevenlabs.io/v1/text-to-speech/iiidtqDt9FBdT1vfBluA/with-timestamps",
    {
      method: "POST",
      body: JSON.stringify({
        text: wisdomText,
        output_format: "mp3_22050_128",
      }),
      headers: headers,
    },
  );

  //Process answer
  if (answer === undefined || !answer.ok) {
    console.log("Oopse, something went wrong");
  } else {
    const content = await answer.json();

    //Deviding content
    const audio: string = content.audio_base64;
    const alignment: Alignment = content.alignment;
    const timedAudio = {
      audio: audio,
      alignment: alignment,
      text: wisdomText,
    };
    reply.header("content-type", "application/json").send(timedAudio);
  }
};
export { getTestTextWisdom, getTextWisdom, getTextTimedAudioWisdom };
