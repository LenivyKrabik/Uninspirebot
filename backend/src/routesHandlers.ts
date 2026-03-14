import type { FastifyReply, FastifyRequest } from "fastify";
import WisdomBuilder from "./wisdomBuilder.ts";
import wisdomComponentsStorage from "./wisdomComponentsStorage.json" with { type: "json" };
import AuthProxyElevenlabs from "./services/elevenlabs.ts";

const wisdomGenerator = new WisdomBuilder(wisdomComponentsStorage);
const ElevenlabsProxy = new AuthProxyElevenlabs();

const getFormatedTextWisdom = () => {
  const wisdom = wisdomGenerator.createWisdom();
  let wisdomText = wisdom.showText();
  wisdomText = wisdomText.charAt(0).toUpperCase() + wisdomText.slice(1);
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
    //Transforming stream into workable object
    const bufferedContent = Buffer.from(await answer.arrayBuffer());
    const stringifiedContent = bufferedContent.toString("binary");
    const content = JSON.parse(stringifiedContent);

    //Deviding content
    const audio = Buffer.from(content.audio_base64, "base64");
    const timedAudio = {
      audio: audio,
      alignment: content.alignment,
      text: wisdomText,
    };

    reply.header("content-type", "application/json").send(timedAudio);
  }
};
export { getTestTextWisdom, getTextWisdom, getTextTimedAudioWisdom };
