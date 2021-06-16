import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import AuthorizationService from '../../service/AuthService'
import Body from '../Structure/Body'
import { withRouter } from 'react-router'
import { UserContext } from '../../context/UserContext'
import '../../css/profile.css';
import ClipLoader from "react-spinners/ClipLoader";


function Politician(props){
    var [politicianInfo, setPoliticianInfo] = useState({});
    var [loggedInUserIsUser, setLoggedInUserIsUser] = useState(false);
    var [loading, setLoading] = useState(true);
    var { userId } = useParams();
    
    useEffect(()=>{
        async function fetchData(){
            var requestedUserInfo = {};
            var userExists = false;
            var sessionData = await AuthorizationService.getSessionData();
            if(props.noRequestId){
                if(sessionData.loggedIn){
                    requestedUserInfo = await AuthorizationService.getUserData(sessionData.loggedInId);
                    userExists = (requestedUserInfo != "User not found.");
                }
            }
            else{            
                requestedUserInfo = await AuthorizationService.getUserData(userId);
                userExists = (requestedUserInfo != "User not found.");
            }
            if(!userExists){
                props.history.push("/");
            }
            else{
                setPoliticianInfo(requestedUserInfo);
                if(sessionData.loggedInId == requestedUserInfo.id){ setLoggedInUserIsUser(true); }
            }
            setLoading(false);
        }
        fetchData();
    },[])

    return(
        <Body middleColWidth='7'>
            {(!loading) ? (
            <>
            <br/>
            <h2>{politicianInfo.politicianName}</h2>
            <div className="mainProfileContainer">
                <img className="profilePicture" src={"https://www.europeanperil.com/authority/"+politicianInfo.profilePic} alt="Profile Picture"/>
                <pre className="bioBox">
                    <p>{politicianInfo.bio}</p>
                </pre>
            </div>
            </>
            ) : (<><br/><ClipLoader></ClipLoader></>)}
        </Body>
    )
}

export default withRouter(Politician);