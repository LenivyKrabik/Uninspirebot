import type {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from "fastify";
import {
  getTestTextWisdom,
  getTextTimedAudioWisdom,
  getTextWisdom,
} from "./routesHandlers.ts";

const routes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) => {
  fastify.get("/testTextWisdom", getTestTextWisdom);
  fastify.get("/textWisdom", getTextWisdom);
  fastify.get("/textTimedAudio", getTextTimedAudioWisdom);
};

export default routes;
