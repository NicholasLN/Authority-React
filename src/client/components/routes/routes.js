import React, { Component } from 'react';
import { Route } from 'react-router-dom';

/** 
 * Import all page components here.
 */
import Index from '../Index/Index';
import Register from '../Pages/Register';
import Login from '../Pages/Login';

class Routes extends Component{
    render(){
        return(
            <>
                <Route exact path="/">
                    <Index/>
                </Route>
                <Route exact path="/register">
                    <Register/>
                </Route>
                <Route exact path="/login">
                    <Login/>
                </Route>
            </>
        );
    }
}

export default Routes;