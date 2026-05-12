import Fastify from "fastify";
import routes from "./routes.ts";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";

const fastify = Fastify({ logger: true });
const PORT = 3000;

fastify.register(cors, {
  origin: "http://localhost:5173",
}); //I haven't deployed yet :(
fastify.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

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
