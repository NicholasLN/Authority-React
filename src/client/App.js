import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import Routes from './components/routes/routes.js';

export default class App extends Component {
  componentDidMount(){
    axios.get("/api/init").then(function(response){
      if(response.status != 400){
        console.log("Error intializing session vars.")
      }
    });
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
