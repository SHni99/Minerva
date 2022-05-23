import React from 'react';
import classNames from 'classnames';

import './IconBlack.css'

export default (props) => (
  <i className={classNames('icon-black', `fa fa-${props.liga}`)} style={props.style} />
);
