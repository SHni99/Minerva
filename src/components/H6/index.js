import React from 'react';

import './H6.css'

export default ({ children, ...props }) => (
  <p className="h6" style={props.style}>
    {children}
  </p>
);
