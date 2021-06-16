import axios from 'axios';

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
    getLoggedInData(partyInfo="true",stateInfo="true",sensitive="false"){
        let url = `/userinfo/getLoggedInUser/${partyInfo}/${stateInfo}/${sensitive}`
        return this.auth.get(url)
            .then(response => response.data);
    }
    getSessionData(){
        return this.auth.get('/init')
            .then(response => response.data);
    }
    getUserData(id, partyInfo="true", stateInfo="false"){
        let url = `/userinfo/fetchUserById/${id}/${partyInfo}/${stateInfo}`
        return this.auth.get(url)
            .then(function(response){
                return response.data;
            }
            ).catch(function(error){
                return "404";
            });
    }
    register(user){
        return this.auth.post('auth/register',user)
            .then(response=>response.data)
    }
}

const AuthorizationService = new AuthService();
export default AuthorizationService;