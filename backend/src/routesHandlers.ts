import type { FastifyReply, FastifyRequest } from "fastify";
import WisdomBuilder from "./wisdomBuilder.ts";
import wisdomComponentsStorage from "./wisdomComponentsStorage.json" with { type: "json" };

const wisdomGenerator = new WisdomBuilder(wisdomComponentsStorage);

const getTestTextWisdom = (req: FastifyRequest, reply: FastifyReply) => {
  reply.send("This is test wisdom, you allowed to not follow it");
};
const getTextWisdom = (req: FastifyRequest, reply: FastifyReply) => {
  const wisdom = wisdomGenerator.createWisdom();
  let wisdomText = wisdom.showText();
  wisdomText = wisdomText.charAt(0).toUpperCase() + wisdomText.slice(1);
  reply.send(wisdomText);
};
export { getTestTextWisdom, getTextWisdom };
