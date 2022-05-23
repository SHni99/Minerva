import React from 'react';

import './InputDropdownWhite.css'

export default (props) => (
  <div className="input-dropdown-white" style={props.style}>
    <select className="input-dropdown-white-input-dropdown">
      <option value="text" selected={props.true} className="input-dropdown-white-option" />
    </select>
    <i className="input-dropdown-white-icon" />
  </div>
);
