import { nanoid } from "nanoid";

const generateShortId = (length = 7) => {
  return nanoid(length);
};

export default generateShortId;
