import React from "react";
import "./Hours.scss";

export default function Hours({
  time,
  temperature,
  feelLike,
  rain,
  image,
  active,
}) {
  const hour = new Date(time);

  return (
    <div className={`${active ? "active" : ""} block-time ${hour.getHours()}`}>
      <div className="d-flex justify-content-between block-time__time align-items-center">
        <p className="my-0">{hour.getHours()}:00</p>
        <img src={image} alt="icon" className="block-time__time__icon" />
      </div>
      <p className="block-time__temperature">{temperature} °C</p>
      <div className="block-time__details">
        <p>
          Cảm giác như <strong>{feelLike}°C</strong>
        </p>
        <p>
          Có thể sẽ mưa <strong>{rain} %</strong>
        </p>
      </div>
    </div>
  );
}
