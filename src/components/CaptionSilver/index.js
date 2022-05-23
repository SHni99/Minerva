import React from 'react';

import './CaptionSilver.css'

export default ({ children, ...props }) => (
  <p className="caption-silver" style={props.style}>
    {children}
  </p>
);
