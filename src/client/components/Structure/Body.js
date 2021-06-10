/**
 * Component used for creating main, transferrable outline for game.
 */

import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import NavBar from './NavBar.js'
import '../../css/main.css';
import axios from 'axios';
export default function Body(props){
    let middleColWidth = 8;
    if (props.middleColWidth) {
        middleColWidth = props.middleColWidth;
    }

    const [sessionData, setSessionData] = useState([]);
    
    useEffect(() => {
        async function fetchData(){
            const result = await axios.get(
            '/api/returnSessionData',
            );
            setSessionData(result.data);
        }
        fetchData()
    },[]);

    console.log(sessionData);

    return(
        <>
            {/* Insert NavBar component here (when done) */}
                <NavBar sessionData={sessionData} />
                <div className="main">
                    <div className="gameContainer">
                        <Row>  
                            <Col sm/>
                            <Col sm={middleColWidth}>
                                {props.children}
                            </Col>
                            <Col sm/>
                        </Row>
                    </div>
                    <div className="footerBar">
                        <p>
                            Developed by Phil Scott
                            <br/>
                            This is a WIP game.
                        </p>
                    </div>
                </div>
        </>
    )
}