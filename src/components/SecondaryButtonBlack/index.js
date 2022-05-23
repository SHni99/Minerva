import React from 'react';

import './SecondaryButtonBlack.css'

export default ({ children, ...props }) => (
  <button className="secondary-button-black" style={props.style}>
    {children}
  </button>
);
