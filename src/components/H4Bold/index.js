import React from 'react';

import './H4Bold.css'

export default ({ children, ...props }) => (
  <p className="h4-bold" style={props.style}>
    {children}
  </p>
);
