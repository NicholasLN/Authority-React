import React, { useContext } from 'react';
import { UserContext } from '../../../context/UserContext';
import { userHasPerm } from '../../../../server/classes/Party/Methods';
import AuthorizationService from '../../../service/AuthService';
import { withRouter } from 'react-router';

function LoggedInNavBar(props){
    const userData = useContext(UserContext).playerData[0];
    const changeSessionData = useContext(UserContext).sessionData[1];

    const logout = async function(){
        var newSessionData = await AuthorizationService.logout();
        changeSessionData(newSessionData);
        props.history.push("/");
    }

    return(
        <>
            <li className="dropdown">
                <a className="nav-link dropdown-toggle" id="navBarDrop" role="button" data-toggle="dropdown" aria-expanded="false">
                    <i className="fas fa-user" aria-hidden="true"></i> {userData.politicianName}
                </a>
                <ul className="dropdown-menu">
                    <a className="dropdown-item" href={"politician/"+userData.id}>Profile</a>
                    <a className="dropdown-item" href="editprofile">Edit Profile</a>
                    <a className="dropdown-item" href="#" onClick={logout}>Logout</a>
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
            {(userData?.partyInfo) ? (
                <li className="dropdown">
                    <a className="nav-link dropdown-toggle" id="navBarDrop" role="button" data-toggle="dropdown" aria-expanded="false">
                        <i className="fas fa-handshake" aria-hidden="true"></i> {userData.partyInfo.name}
                    </a>
                    <ul className="dropdown-menu">
                        <a className="dropdown-item" href={"party/"+userData.partyInfo.id+"/overview"}>Overview</a>
                        <a className="dropdown-item" href={"party/"+userData.partyInfo.id+"/members"}>Members</a>
                        {
                        (
                            userHasPerm(userData.id,userData.partyInfo,"sendFunds") || 
                            userHasPerm(userData.id,userData.partyInfo,"fundingReq")
                        ) ? (<a className="dropdown-item" href={"party/"+userData.partyInfo.id+"/partyTreasury"}>Party Treasury</a>) : (<></>)
                        }
                        {
                        (
                            userHasPerm(userData.id,userData.partyInfo,"leader")
                        ) ? (<a className="dropdown-item" href={"party/"+userData.partyInfo.id+"/partyControls"}>Party Management</a>) : (<></>)
                    }
                    </ul>
                </li>
            ) : (
                <></>
            )}
        </>
    );
}
export default withRouter(LoggedInNavBar);