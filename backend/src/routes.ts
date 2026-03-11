import type {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from "fastify";
import { getTextWisdom } from "./routesHandlers.ts";

const routes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) => {
  fastify.get("/textWisdom", getTextWisdom);
};

export default routes;
