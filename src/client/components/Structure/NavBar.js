import React, { useContext } from 'react';

import { Link } from 'react-router-dom';
import LoggedInNavBar from './NavBar/loggedInNavBar';

import { UserContext } from '../../context/UserContext.js';

export default function NavBar(props) {
    const userContextData = useContext(UserContext);
    const sessionData = userContextData.sessionData[0];

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a href='/' className="navbar-brand" style={{ marginLeft: "15px" }}>
                    <b>AUTHORITY<small>It's Not POWER, I Swear!</small></b>
                </a>
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="myNavbar">
                        <ul className="nav navbar-nav navbar-right">
                            {(sessionData.loggedIn) ? (
                                <LoggedInNavBar/>
                            ) : (
                                <Link to='/login' className="nav-link">
                                    LOGIN
                                </Link>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
        );
}