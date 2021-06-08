/**
 * Component used for creating main, transferrable outline for game.
 */

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import NavBar from './NavBar.js'
import '../../css/main.css';
import axios from 'axios';

export default class Body extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    state = {
        playerData: {}
    }

    componentDidMount() {
        const self = this;

        axios.get('/api/returnSessionData')
        .then((res) => {
            const playerData = res.data;

            self.setState({ playerData });
        });
    }

    render() {
        const { loggedIn } = this.state; 
        let middleColWidth = 8;

        console.log(this.props);

        if (this.props.middleColWidth) {
            middleColWidth = this.props.middleColWidth;
        }

        return(
            <>
                {/* Insert NavBar component here (when done) */}
                    <NavBar {...loggedIn} />
                    <div className="main">
                        <div className="gameContainer">
                            <Row>  
                                <Col sm/>
                                <Col sm={middleColWidth}>
                                    {this.props.children}
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
}
