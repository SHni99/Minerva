import React from 'react';

import './CardDarkGrey.css'

export default ({ children, ...props }) => (
  <div className="card-dark-grey" style={props.style}>
    {children}
  </div>
);
