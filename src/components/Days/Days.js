import React from "react";
import "./Days.scss";

export default function Days({ day, active, onHandleDay }) {
  return (
    <p className={`days ${active ? "active" : ""}`} onClick={onHandleDay}>
      {day}
    </p>
  );
}
