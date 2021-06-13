import React from 'react';

function EconomicPositionDropdown(props){
    return(
    <>
        <option value="-5">Collectivism</option>
        <option value="-4">Socialism</option>
        <option value="-3">Left Wing</option>
        <option value="-2">Slightly Left Wing</option>
        <option value="-1">Center Left</option>
        <option value="0">Mixed Capitalism</option>
        <option value="1">Center Right</option>
        <option value="2">Slightly Right Wing</option>
        <option value="3">Right Wing</option>
        <option value="4">Capitalism</option>
        <option value="5">Libertarianism</option>
    </>
    );
}

function SocialPositionDropdown(props){
    return(
    <>
        <option value="-5">Anarchism</option>
        <option value="-4">Communalism</option>
        <option value="-3">Left Wing</option>
        <option value="-2">Slightly Left Wing</option>
        <option value="-1">Center Left</option>
        <option value="0">Centrist</option>
        <option value="1">Center Right</option>
        <option value="2">Slightly Right Wing</option>
        <option value="3">Right Wing</option>
        <option value="4">Authoritarian Right</option>
        <option value="5">Totalitarian Right</option>
    </>
    );
}

export {
    EconomicPositionDropdown,
    SocialPositionDropdown
}