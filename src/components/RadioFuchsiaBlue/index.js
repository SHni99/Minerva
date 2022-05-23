import React from 'react';

import './RadioFuchsiaBlue.css'

export default (props) => (
  <label className="radio-fuchsia-blue" style={props.style}>
    <div checked={props.checked} className="radio-fuchsia-blue-toggle" />
    <input type="checkbox" defaultChecked={props.checked} className="radio-fuchsia-blue-input" />
  </label>
);
