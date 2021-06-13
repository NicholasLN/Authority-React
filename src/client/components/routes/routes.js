import React, { Component } from 'react';
import { Route } from 'react-router-dom';

/** 
 * Import all page components here.
 */
import Index from '../Index/Index';
import Register from '../Pages/Register';
import Login from '../Pages/Login';
import Politician from '../Pages/Politician';
import NotFound from '../Pages/NotFound';

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
                <Route exact path="/politician">
                    <Politician noRequestId={true}/>
                </Route>
                <Route path="/politician/:userId">
                    <Politician/>
                </Route>
            </>
        );
    }
}

export default Routes;