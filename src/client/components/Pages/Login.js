import React, { Component } from 'react';
import Body from '../Structure/Body';

class Login extends Component {
    render() {
        return (
            <>
                <Body middleColWidth='4'>
                    <br />
                    <h2>Login</h2>
                    <hr />
                    <form className='tableForm' onSubmit={
                        function loginSubmit(e) {
                            e.preventDefault
                        }
                    }
                    >
                        <table className='table table-striped table-responsive'>
                            <tbody>
                                <tr>
                                    <td><b>Username</b></td>
                                    <td>
                                        <input type="text"
                                            name="username"
                                            className="form-control"
                                            placeholder="Enter Username Here"
                                            required=""
                                            pattern="[^()/><\][\\\x22,;|]+" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Password</b>
                                    </td>
                                    <td>
                                        <input type="password"
                                            name="password"
                                            className="form-control"
                                            placeholder="Enter Password Here"
                                            required=""
                                            pattern="[^()/><\][\\\x22,;|]+" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <label>
                            <input type="submit" className="btn btn-primary" value="Login" name="signIn"/>
                        </label>
                    </form>
                </Body>
            </>
        )
    }

}

export default Login;