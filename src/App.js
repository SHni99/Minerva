import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import DemoScreen from './containers/DemoScreen';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={DemoScreen} />
    </Switch>
  </BrowserRouter>
);

export default App;
