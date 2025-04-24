const { createClient } = require("redis");
const redisClient = createClient({
  url: "redis://default:ntiDieUL5oYd776aERCiKjKOyTDM6hAL@redis-14252.c83.us-east-1-2.ec2.redns.redis-cloud.com:14252",
});
redisClient.on("error", (error) => console.log("Redis Client Error", error));
const connectionRedis = () => {
  return redisClient
    .connect()
    .then(() => console.log("Redis Connected"))
    .catch((error) => console.log(error));
};
module.exports = {
  connectionRedis,
  redisClient,
};
