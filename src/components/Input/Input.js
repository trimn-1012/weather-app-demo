import React from "react";
import "./Input.scss";

export default function Input({ label, name }) {
  return (
    <div className="form__group">
      <input
        type="text"
        className="form__field"
        placeholder={label}
        name={name}
        id={name}
        autoComplete="off"
        required
      />
      <label htmlFor={name} className="form__label">
        {label}
      </label>
    </div>
  );
}
