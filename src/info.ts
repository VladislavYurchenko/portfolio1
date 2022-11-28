// import open from "open";
import log4js from "log4js";
const test = () => {
  console.log("gag");
};
test();
const port = process.env.PORT;
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;
logger.info("log4js log info");
logger.debug("log4js log debug");
logger.error("log4js log error");
async function openBrowser() {
  // await open("http://localhost:5000", { wait: true });
  console.log(`Running on port ${port}`);
  console.log(`with address http://localhost:${port}`);
}
openBrowser();
