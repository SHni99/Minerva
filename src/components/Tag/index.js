import React from 'react';

import './Tag.css'

export default ({ children, ...props }) => (
  <button className="tag" style={props.style}>
    {children}
  </button>
);
