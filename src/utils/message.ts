import day from "dayjs";
import { Message } from "../interfaces/components.i";

export const generateMessage = (sender: string, text: string): Message => {
  return {
    sender,
    text,
    createdAt: day().valueOf(),
  };
};

export const generateLocationMessage = (
  sender: string,
  latitude: string,
  longitude: string,
): Message => {
  const url = `https://www.google.co.uk/maps?q=${latitude},${longitude}`;
  return {
    sender,
    url,
    createdAt: day().valueOf(),
  };
};
