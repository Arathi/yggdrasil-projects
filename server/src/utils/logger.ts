import pino from "pino";

const logger = pino({
  name: "ROOT",
  transport: {
    target: "pino-pretty",
  },
});

export function getLogger(name?: string) {
  if (name === undefined) {
    return logger;
  }
  return logger.child({
    name,
  });
}

export default logger;
