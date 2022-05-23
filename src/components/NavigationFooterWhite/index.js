import React from 'react';

import './NavigationFooterWhite.css'

export default ({ children, ...props }) => (
  <div className="navigation-footer-white" style={props.style}>
    {children}
  </div>
);
