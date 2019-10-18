import React, { useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io";
import { AppState } from "../store/store";

const SendMessage = (): JSX.Element => {
  const [text, setText] = useState("");
  const socket = useSelector(({ room }: AppState): Socket => room.socket);

  const onTextSubmit = (e): void => {
    e.preventDefault();
    socket.emit(
      "createMessage",
      {
        text,
      },
      (): void => {
        setText("");
      },
    );
  };

  const onLocationPress = (): void => {
    const locationButton = document.getElementById("send-location") as HTMLButtonElement;

    if (!navigator.geolocation) {
      return alert("Geolocation not supported by your browser");
    }

    locationButton.disabled = true;
    locationButton.innerText = "Sending Location...";

    return navigator.geolocation.getCurrentPosition(
      (position): void => {
        locationButton.disabled = false;
        locationButton.innerText = "Send Location";
        socket.emit("createLocationMessage", {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (): void => {
        locationButton.disabled = false;
        locationButton.innerText = "Send Location";
        alert("Unable to fetch location");
      },
    );
  };

  return (
    <div className="send__container">
      <form className="send__form">
        <input
          onChange={(e: ChangeEvent<HTMLInputElement>): void => setText(e.target.value)}
          value={text}
          name="message"
          placeholder="Message"
          autoComplete="off"
        />
        <button
          className="button__chatter"
          type="submit"
          onClick={(e): void => onTextSubmit(e)}
        >
          Send
        </button>
        <br className="visible-sm" />
        <button
          className="button__chatter button__location"
          id="send-location"
          onClick={onLocationPress}
          type="button"
        >
          Send Location
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
