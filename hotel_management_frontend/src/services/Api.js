import Http from "./Http";
export const getRooms = (config) => Http.get("/rooms", config);
