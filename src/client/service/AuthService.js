import axios from 'axios';

class AuthService{
    constructor(){
        this.auth = axios.create({
            baseURL:'/api',
            withCredentials:true
        })
    }
    logout(){
        return this.auth.get('/auth/logout',{})
            .then(response => response.data);
    }
    getLoggedInData(){
        return this.auth.get('/userinfo/getLoggedInUser', {})
            .then(response => response.data);
    }
    getSessionData(){
        return this.auth.get('/init')
            .then(response => response.data);
    }
}

const AuthorizationService = new AuthService();
export default AuthorizationService;