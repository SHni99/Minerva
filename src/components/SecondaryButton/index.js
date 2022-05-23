import React from 'react';

import './SecondaryButton.css'

export default ({ children, ...props }) => (
  <button className="secondary-button" style={props.style}>
    {children}
  </button>
);
