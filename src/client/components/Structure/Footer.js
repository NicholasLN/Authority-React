import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import NumberFormat from 'react-number-format';

export default function Footer(props) {
    const context = useContext(UserContext);
    const playerData = context.playerData[0];

    return (
        <div class="footerInformation">
            <p>
                <b>AUTHORITY:</b> {playerData.authority} <b>|| </b>
                <b>CF: $</b><span class="greenFont">
                    <NumberFormat 
                    value={playerData.campaignFinance}
                    displayType={'text'}
                    thousandSeparator={true}
                    />
                </span>
            </p>
        </div>
    )
}