import React from 'react';

import './InputFieldWhite.css'

export default (props) => (
  <input type="text" className="input-field-white" style={props.style} placeholder={props.placeholder} />
);
