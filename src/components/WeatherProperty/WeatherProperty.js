import React from "react";
import "./WeatherProperty.scss"

export default function WeatherProperty({icon, title, content}) {
  return (
    <div className="d-flex weather-property">
      <img src={icon} alt="humidity" className="icons icons--medium mt-1" />
      <div className="d-flex flex-column ml-2">
        <p className="mb-0 weather-property__title">{title}</p>
        <h4>{content}</h4>
      </div>
    </div>
  );
}
