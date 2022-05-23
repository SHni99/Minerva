import React from 'react';

import './ParagraphBlack.css'

export default ({ children, ...props }) => (
  <p className="paragraph-black" style={props.style}>
    {children}
  </p>
);
