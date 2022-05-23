import React from 'react';

import './H3.css'

export default ({ children, ...props }) => (
  <p className="h3" style={props.style}>
    {children}
  </p>
);
