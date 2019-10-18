import React from "react";
import day from "dayjs";
import { MessageProps } from "../interfaces/components.i";

const Message: React.FC<MessageProps> = ({
  type,
  message,
  admin,
  location,
}): JSX.Element => {
  const { sender, createdAt, text, url } = message;
  const formattedTime = day(createdAt).format("h:mm a");

  return (
    <div className={type}>
      <div className="message__title">
        {admin && <i className="icon fas fa-lock" />}
        <h4>{sender}</h4>
        <p className="message__timestamp">
          <em>{formattedTime}</em>
        </p>
      </div>
      <div className="message__body">
        {location ? (
          <a href={url} target="_blank noopener noreferrer">
            My current location
          </a>
        ) : (
          <p>{text}</p>
        )}
      </div>
    </div>
  );
};

export default Message;
