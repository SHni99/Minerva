import React from 'react';

import './SwitchFuchsiaBlue.css'

export default (props) => (
  <label className="switch-fuchsia-blue" style={props.style}>
    <div checked={props.checked} className="switch-fuchsia-blue-toggle" />
    <input type="checkbox" defaultChecked={props.checked} className="switch-fuchsia-blue-input" />
  </label>
);
