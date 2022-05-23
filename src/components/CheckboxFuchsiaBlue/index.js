import React from 'react';
import classNames from 'classnames';

import './CheckboxFuchsiaBlue.css'

export default (props) => (
  <label className="checkbox-fuchsia-blue" style={props.style}>
    <i checked={props.checked} className={classNames('fa', 'fa-check', 'checkbox-fuchsia-blue-toggle')} />
    <input type="checkbox" defaultChecked={props.checked} className="checkbox-fuchsia-blue-input" />
  </label>
);
