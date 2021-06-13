import React, { useState, useContext } from 'react';
import Body from '../Structure/Body';
import AuthorizationService from '../../service/AuthService';
import { UserContext } from '../../context/UserContext';
import { withRouter } from 'react-router';


function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setSessionData = useContext(UserContext).sessionData[1];
    const setPlayerData = useContext(UserContext).playerData[1];

    var login = async function(){
        var body = {"username":username, "password":password};
        const response = await AuthorizationService.login(body);
        if(response.data.loggedIn){
            setSessionData(response.data)
            var loggedInData = await AuthorizationService.getLoggedInData();
            setPlayerData(loggedInData);
            props.history.push('/politician/'+loggedInData.id);
        }
        console.log(response);
    }

    return (
        <Body middleColWidth='4'>
            <br />
            <h2>Login</h2>
            <hr />
            <div className='tableForm'>
            <form onSubmit={(e)=>e.preventDefault()}>
            <table className='table table-striped table-responsive'>
                <tbody>
                    <tr>
                        <td><b>Username</b></td>
                        <td>
                            <input onInput={e=>setUsername(e.target.value)}
                            type="text" name="username" className="form-control" placeholder="Enter Username Here" required="" pattern="[^()/><\][\\\x22,;|]+" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Password</b>
                        </td>
                        <td>
                            <input onInput={e=>setPassword(e.target.value)} 
                            type="password" name="password" className="form-control" placeholder="Enter Password Here" required="" pattern="[^()/><\][\\\x22,;|]+" />
                        </td>
                    </tr>
                </tbody>
            </table>
            <label>
                <input className="btn btn-primary" type='submit' value="Login" name="signIn" onClick={login}/>
            </label>
            </form>
            </div>
        </Body>
    )
}
export default withRouter(Login);