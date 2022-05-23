import React from 'react';

import './SubheaderBlack.css'

export default ({ children, ...props }) => (
  <p className="subheader-black" style={props.style}>
    {children}
  </p>
);
