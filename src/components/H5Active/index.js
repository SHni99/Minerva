import React from 'react';

import './H5Active.css'

export default ({ children, ...props }) => (
  <p className="h5-active" style={props.style}>
    {children}
  </p>
);
