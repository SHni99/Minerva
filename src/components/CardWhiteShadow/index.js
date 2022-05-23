import React from 'react';

import './CardWhiteShadow.css'

export default ({ children, ...props }) => (
  <div className="card-white-shadow" style={props.style}>
    {children}
  </div>
);
