import React from 'react';
import classNames from 'classnames';

import './IconBlue.css'

export default (props) => (
  <i className={classNames('icon-blue', `fa fa-${props.liga}`)} style={props.style} />
);
