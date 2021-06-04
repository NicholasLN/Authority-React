/**
 * Component used for creating main, transferrable outline for game.
 */

import React from 'react';
import { Row, Col } from 'react-bootstrap'
import '../../css/main.css';

export default function Body(props){
    return(
        <>
            {/* Insert NavBar component here (when done) */}
            <body>
                <div className="main">
                    <div className="gameContainer">
                        <Row>  
                            <Col sm/>
                            <Col sm='8'>
                                {props.children}
                            </Col>
                            <Col sm/>
                        </Row>
                    </div>
                </div>
            </body>
        </>
    )
}