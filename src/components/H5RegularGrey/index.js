import React from 'react';

import './H5RegularGrey.css'

export default ({ children, ...props }) => (
  <p className="h5-regular-grey" style={props.style}>
    {children}
  </p>
);
