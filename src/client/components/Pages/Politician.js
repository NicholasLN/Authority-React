import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import AuthorizationService from '../../service/AuthService'
import Body from '../Structure/Body'
import NumberFormat from 'react-number-format'
import { withRouter } from 'react-router'
import { timeAgoString } from '../../../server/classes/User/Method'
import '../../css/profile.css';
import ClipLoader from "react-spinners/ClipLoader";
import { LinkContainer } from 'react-router-bootstrap'

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
                    userExists = !(requestedUserInfo == undefined)
                }
            }
            else{            
                requestedUserInfo = await AuthorizationService.getUserData(userId);
                userExists = !(requestedUserInfo == undefined || requestedUserInfo == "404")
            }
            if(!userExists){
                if(sessionData.loggedIn){ props.history.push(`/politician`); }
                else{ props.history.push(`/`) };
            }
            else{
                setPoliticianInfo(requestedUserInfo);
                if(sessionData.loggedInId == requestedUserInfo.id){ setLoggedInUserIsUser(true); }
                setLoading(false);
                document.title = requestedUserInfo.politicianName + " | AUTHORITY"
            }
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

                {
                (!loggedInUserIsUser) ? (
                <div className='lastOnline'>
                    {timeAgoString(politicianInfo.lastOnline)}
                </div>) : (<></>)
                }

                <hr/>

                <pre className="bioBox">
                    {politicianInfo.bio}
                </pre>

                <hr/>
            </div>
            <table className="table table-striped table-bordered" id='statsTable'>
                <tbody>
                    <tr>
                        <td>Authority</td>
                        <td>{politicianInfo.authority}</td>
                    </tr>
                    <tr>
                        <td>Campaign Funding</td>
                        <td>
                            $<span className='greenFont'><NumberFormat thousandSeparator={true} displayType={'text'} value={politicianInfo.campaignFinance}/></span>
                        </td>
                    </tr>
                    <tr>
                        <td>State Influence</td>
                        <td>{politicianInfo.hsi}%</td>
                    </tr>
                    {(politicianInfo.party != 0) ? (
                    <tr>
                        <td>Political Party</td>
                        <td>
                            <LinkContainer to={`/party/${politicianInfo.partyInfo.id}`}>
                                <a href='#'>{politicianInfo.partyInfo.name}</a>
                            </LinkContainer>
                        </td>
                    </tr>
                    ):(<></>)}  
                    <tr>
                        
                    </tr>
                </tbody>
            </table>
            </>
            ) : (<><br/><ClipLoader/></>)}
        </Body>
    )
}

export default withRouter(Politician);