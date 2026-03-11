import Fastify from "fastify";
import routes from "./routes.ts";

const fastify = Fastify({ logger: true });
const PORT = 3000;

fastify.register(routes);

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
