import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

export default function ContextProvider(props){
    const [sessionData, setSessionData] = useState([]);
    const [playerData, setPlayerData] = useState([]);


    useEffect(() => {
        async function fetchData(){
            const respSession = await axios('/api/init');
            setSessionData(respSession.data);
            if(respSession.data.loggedIn){
                const respPlayerData = await axios('/api/userinfo/getLoggedInUser');
                setPlayerData(respPlayerData.data);
            }
        }
        fetchData();
    },[]);

    return(
        <>
        <UserContext.Provider value={
            { 
                sessionData: [sessionData, setSessionData],
                playerData: [playerData, setPlayerData]
            }}>
            {props.children}
        </UserContext.Provider>
        </>
    )
}
