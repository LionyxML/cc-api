import expressLoader from "./express";
import Logger from "./logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async ({ expressApp }: any) => {
  Logger.info("Loading API...");
  await expressLoader({ app: expressApp });
  Logger.info("✅ Express loaded");
};
