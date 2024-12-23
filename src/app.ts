import "reflect-metadata";
import fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import {ZodError} from "zod";
import dotenv from "dotenv";

import {appRoutes} from "#/http/routes";

dotenv.config();

export const app = fastify();

app.register(fastifyMultipart);

// Test, I don't know if I will use this yet
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
});

app.register(fastifyCors, {
  //origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

app.register(appRoutes);

app.setErrorHandler((error, _req, res) => {
  if (error instanceof ZodError) {
    return res
      .status(400)
      .send({message: "Validation error", issues: error.format()});
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: Here we can log the error to a service like Sentry/LogRocket/DataDog/NewRelic
  }

  res.status(500).send({error: "Internal server error"});
});
