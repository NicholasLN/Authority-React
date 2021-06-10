import React, { Component } from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav
} from 'react-bootstrap'
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';

export default class LoggedInNavBar extends Component {
    constructor(props) {
        super(props);
        this.state = { playerData: {}, rendering:true }
    }
    componentDidMount() {
        var self = this;
        var url = "/api/userinfo/fetchUserById/" + this.props.sessionData.loggedInId;
        axios.get(url).then(function (res) {
            self.setState({ playerData: res.data });
        });
        this.setState({rendering:false})
    }
    render() {
        if(this.state.rendering){ return null; }
        console.log(this.props);
        return (
            <>
                <li className="dropdown">
                    <a className="nav-link dropdown-toggle" id="navBarDrop" role="button" data-toggle="dropdown" aria-expanded="false">
                        <i className="fas fa-user" aria-hidden="true"></i> {this.state.playerData.politicianName}
                    </a>
                    <ul className="dropdown-menu">
                        <a className="dropdown-item" href={"politician/"+this.state.playerData.id}>Profile</a>
                        <a className="dropdown-item" href="editprofile.php">Edit Profile</a>
                    </ul>
                </li>
                <li className="dropdown">
                    <a className="nav-link dropdown-toggle" id="navBarDrop" role="button" data-toggle="dropdown" aria-expanded="false">
                        <i className="fas fa-flag" aria-hidden="true"></i> {this.state.playerData.nation}
                    </a>
                    <ul className="dropdown-menu">
                        <a className="dropdown-item" href={"politicalparties/"+this.state.playerData.nation}>Political Parties</a>
                    </ul>
                </li>
            </>
        );
    }
}