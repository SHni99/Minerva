import React from 'react';

import './CircleCard.css'

export default ({ children, ...props }) => (
  <div className="circle-card" style={props.style}>
    {children}
  </div>
);
