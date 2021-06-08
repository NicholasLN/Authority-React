import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import Routes from './components/routes/routes.js';

export default class App extends Component {
  componentDidMount(){
    axios.get("/api/init");
  }

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
