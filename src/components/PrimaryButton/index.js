import React from 'react';

import './PrimaryButton.css'

export default ({ children, ...props }) => (
  <button className="primary-button" style={props.style}>
    {children}
  </button>
);
