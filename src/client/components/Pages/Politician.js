import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import AuthorizationService from '../../service/AuthService'
import Body from '../Structure/Body'
import { withRouter } from 'react-router'
import { UserContext } from '../../context/UserContext'

function Politician(props){
    var [politicianInfo, setPoliticianInfo] = useState({});
    var [loggedInUserIsUser, setLoggedInUserIsUser] = useState(false);
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
        }
        fetchData();
    },[])

    return(
        <Body>
            {loggedInUserIsUser}
            <br/>
            {politicianInfo.politicianName}
        </Body>
    )
}

export default withRouter(Politician);