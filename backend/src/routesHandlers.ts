import type { FastifyReply, FastifyRequest } from "fastify";

const getTextWisdom = (req: FastifyRequest, reply: FastifyReply) => {
  reply.send("This is test wisdom, you allowed to not follow it");
};

export { getTextWisdom };
