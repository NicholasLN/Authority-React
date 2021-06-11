import React, { useContext } from 'react';
import { UserContext } from '../../../context/UserContext';

export default function LoggedInNavBar(props){
    const userData = useContext(UserContext).playerData[0];

    return(
        <>
            <li className="dropdown">
                <a className="nav-link dropdown-toggle" id="navBarDrop" role="button" data-toggle="dropdown" aria-expanded="false">
                    <i className="fas fa-user" aria-hidden="true"></i> {userData.politicianName}
                </a>
                <ul className="dropdown-menu">
                    <a className="dropdown-item" href={"politician/"+userData.id}>Profile</a>
                    <a className="dropdown-item" href="editprofile.php">Edit Profile</a>
                </ul>
            </li>
            <li className="dropdown">
                <a className="nav-link dropdown-toggle" id="navBarDrop" role="button" data-toggle="dropdown" aria-expanded="false">
                    <i className="fas fa-flag" aria-hidden="true"></i> {userData.nation}
                </a>
                <ul className="dropdown-menu">
                    <a className="dropdown-item" href={"politicalparties/"+userData.nation}>Political Parties</a>
                </ul>
            </li>
        </>
    );
}