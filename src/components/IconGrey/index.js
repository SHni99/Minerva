import React from 'react';
import classNames from 'classnames';

import './IconGrey.css'

export default (props) => (
  <i className={classNames('icon-grey', `fa fa-${props.liga}`)} style={props.style} />
);
