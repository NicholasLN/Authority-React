import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Routes from './routes.js';

export default class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Routes/>
        </Switch>
      </Router>
    );
  }
}
