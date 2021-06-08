import React, { Component } from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav
} from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom';

class NavBar extends Component {
    render() {
        return (
            <>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a href='/' className="navbar-brand" style={{ marginLeft: "15px" }}>
                        <b>AUTHORITY<small>It's Not POWER, I Swear!</small></b>
                    </a>
                    <div className="container-fluid">
                        <div className="collapse navbar-collapse" id="myNavbar">
                            <ul className="nav navbar-nav navbar-right">
                                <li className="nav-item active">
                                    {(this.props.loggedIn) ? ( 
                                        <>
                                        </>
                                    ) : (
                                    <Link to='/login' className="nav-link">
                                        LOGIN
                                    </Link>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </>);
    }
}
export default NavBar;