import React from 'react';

import './H4.css'

export default ({ children, ...props }) => (
  <p className="h4" style={props.style}>
    {children}
  </p>
);
