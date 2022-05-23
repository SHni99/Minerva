import React from 'react';

import './H1.css'

export default ({ children, ...props }) => (
  <p className="h1" style={props.style}>
    {children}
  </p>
);
