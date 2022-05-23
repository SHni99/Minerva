import React from 'react';

import './NavigationHeaderWhite.css'

export default ({ children, ...props }) => (
  <div className="navigation-header-white" style={props.style}>
    {children}
  </div>
);
