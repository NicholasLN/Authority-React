import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import AuthorizationService from '../service/AuthService';

export default function ContextProvider(props){
    const [sessionData, setSessionData] = useState({});
    const [playerData, setPlayerData] = useState({});


    useEffect(() => {
        async function fetchData(){
            const sessionDataX = await AuthorizationService.getSessionData();
            const playerDataX = await AuthorizationService.getLoggedInData();
            
            setSessionData(sessionDataX);
            setPlayerData(playerDataX);
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
