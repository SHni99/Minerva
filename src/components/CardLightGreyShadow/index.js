import React from 'react';

import './CardLightGreyShadow.css'

export default ({ children, ...props }) => (
  <div className="card-light-grey-shadow" style={props.style}>
    {children}
  </div>
);
