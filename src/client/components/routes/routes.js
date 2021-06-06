import React, { Component } from 'react';
import { Route } from 'react-router-dom';

/** 
 * Import all page components here.
 */
import Index from '../Index/Index';
import Register from '../Pages/Register';

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
            </>
        );
    }
}

export default Routes;