import type { FastifyInstance, FastifyPluginOptions, FastifyPluginAsync } from "fastify";
import { getSoundEffect, getTestTextWisdom, getTextTimedAudioBatch, getTextTimedAudioWisdom, getTextWisdom } from "./routesHandlers.ts";

const routes: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.get("/testTextWisdom", getTestTextWisdom);
  fastify.get("/textWisdom", getTextWisdom);
  fastify.get("/textTimedAudio", getTextTimedAudioWisdom);
  fastify.post("/soundEffect", getSoundEffect);
  fastify.post("/textTimedAudioBatch", getTextTimedAudioBatch);
};

export default routes;
