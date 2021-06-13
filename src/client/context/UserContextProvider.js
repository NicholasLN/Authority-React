import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import AuthorizationService from '../service/AuthService';

export default function ContextProvider(props){
    const [sessionData, setSessionData] = useState({});
    const [playerData, setPlayerData] = useState({});


    useEffect(() => {
        const fetchData = async ()=>{
            try{
                const sessionDataX = await AuthorizationService.getSessionData();
        
                if(sessionDataX.loggedIn){
                    const playerDataX = await AuthorizationService.getLoggedInData();
                    setPlayerData(playerDataX);
                }
            
                setSessionData(sessionDataX);
            }
            catch(error){
                console.log(error);
            }
        };
        const id = setInterval(()=>{
            fetchData();
        }, 5000);

        fetchData();

        return ()=>clearInterval(id);
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
