import React from 'react';

import './CardWhite.css'

export default ({ children, ...props }) => (
  <div className="card-white" style={props.style}>
    {children}
  </div>
);
