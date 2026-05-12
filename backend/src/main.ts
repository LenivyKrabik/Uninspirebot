import Fastify from "fastify";
import routes from "./routes.ts";
import cors from "@fastify/cors";

const fastify = Fastify({ logger: true });
const PORT = 3000;

fastify.register(cors, {
  origin: "https:localhost:5173",
}); //I haven't deployed yet :(
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
