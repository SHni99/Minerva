import React from 'react';
import classNames from 'classnames';

import './ButtonIconFuchsiaBlue.css'

export default (props) => (
  <button className={classNames('button-icon-fuchsia-blue', `fa fa-${props.liga}`)} style={props.style}>
    <i className="button-icon-fuchsia-blue-icon" />
  </button>
);
