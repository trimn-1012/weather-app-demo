import React from "react";
import "./Hours.scss"

export default function Hours({ time, temperature, feelLike, rain, image }) {
  return (
    <div className="block-time">
      <div className="d-flex justify-content-between block-time__time align-items-center">
        <p className="my-0">{time}</p>
        <img src={image} alt="icon" className="block-time__time__icon"/>
      </div>
      <p className="block-time__temperature">{temperature} °C</p>
      <div className="block-time__details">
        <p>Feel like {feelLike}°C</p>
        <p>
          Chance of Rain <strong>{rain} %</strong>
        </p>
      </div>
    </div>
  );
}
