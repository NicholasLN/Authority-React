import React,{Component} from 'react';
import { Button, h1 } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import Body from '../Structure/Body';

export default class Index extends Component{

    render(){
        return(
            <Body>
                <h1>Authority 3.0</h1>

                <p>Authority is a WIP political game in which users can register as a politician, run for offices,
                run countries, play a vital part in the economic system within their countries (and others), and
                seize power through a variety of methods--legal, or illegal.
                </p>
            
                <hr/>

                <LinkContainer to='/register'>
                    <Button >Register Now!</Button>
                </LinkContainer>
                
                <br/>

                <br/>
                <p>Already have an account? <a href="login">Login Here</a></p>
                <hr/>
            </Body>
        )
    }

}