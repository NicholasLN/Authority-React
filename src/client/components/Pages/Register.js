import React, { Component } from 'react';
import Body from '../Structure/Body';

class Register extends Component {
    render() {
        return (
            <>
                <Body middleColWidth='6'>
                    <br />
                    <h1>Register Now!</h1>
                    <h6>
                        Please do not put any revealing information or important passwords here.
                        <br />
                        While I try, I can not guarantee absolute safety. Passwords are hashed in the database, so that I can't even see them.
                    </h6>

                    <div>
                        <br />
                        <h3>Login Information</h3>
                        <h6>You will login with this information.</h6>
                    </div>

                    <form className='tableForm'>
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
                                        pattern="[^()/><\][\\\x22,;|]+"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Password</b></td>
                                    <td>
                                        <input type="password" 
                                        name="password" 
                                        className="form-control" 
                                        placeholder="Enter Password Here" 
                                        required="" 
                                        pattern="[^()/><\][\\\x22,;|]+"/>
                                    </td> 
                                </tr>
                            </tbody>
                        </table>
                    </form>

                </Body>
            </>
        );
    }
}
export default Register;