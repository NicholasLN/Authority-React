import axios from 'axios';
import querystring from 'querystring';

class AuthService{
    constructor(){
        this.auth = axios.create({
            baseURL:'/api',
            withCredentials:true
        })
    }
    login(user){
        return this.auth.post('/auth/login',
        {
            username: user.username,
            password: user.password
        })
            .then(response=>response);
    }
    logout(){
        return this.auth.get('/auth/logout',{})
            .then(response => response.data);
    }
    getLoggedInData(){
        return this.auth.get('/userinfo/getLoggedInUser')
            .then(response => response.data);
    }
    getSessionData(){
        return this.auth.get('/init')
            .then(response => response.data);
    }
}

const AuthorizationService = new AuthService();
export default AuthorizationService;