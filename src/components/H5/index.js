import React from 'react';

import './H5.css'

export default ({ children, ...props }) => (
  <p className="h5" style={props.style}>
    {children}
  </p>
);
