import { BASE_URL } from "../constants/app";
export const getImageRoom = (imgName) => {
  return `${BASE_URL}/assets/uploads/rooms/${imgName}`;
};
