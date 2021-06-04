import React, { Component } from 'react';
import { Route } from 'react-router-dom';

/** 
 * Import all page components here.
 */

import Index from './components/Index/Index';

class Routes extends Component{
    render(){
        return(
            <>
                <Route exact path="/">
                    <Index/>
                </Route>
            </>
        );
    }
}

export default Routes;