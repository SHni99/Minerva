import React from 'react';

import './H2.css'

export default ({ children, ...props }) => (
  <p className="h2" style={props.style}>
    {children}
  </p>
);
