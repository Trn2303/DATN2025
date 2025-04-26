module.exports = {
  port: process.env.SERVER_PORT || 8000,
  prefixApiVersion: process.env.PREFIX_API_VERSION || "/api/v1",
  router: __dirname + "/../src/routers/web",
  baseImangeUrl: process.env.BASE_IMAGE_URL || `${__dirname}/../src/public/uploads`,
  jwtAccessKey: process.env.JWT_ACCESS_KEY || "hotel-access-key",
  jwtRefreshKey: process.env.JWT_REFRESH_KEY || "hotel-refresh-key",
}