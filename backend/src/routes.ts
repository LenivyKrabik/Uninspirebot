import type {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from "fastify";
import { getTestTextWisdom } from "./routesHandlers.ts";

const routes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
) => {
  fastify.get("/testTextWisdom", getTestTextWisdom);
};

export default routes;
