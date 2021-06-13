import axios from 'axios';

class StateService{
    constructor(){
        this.auth = axios.create({
            baseURL:'/api',
            withCredentials:true
        })
    }
    activeStates(){
        return this.auth.get("/stateinfo/getAllActiveStates")
            .then(response=>response.data);
    }
    getStateOwner(state){
        return this.auth.get("/stateinfo/getStateOwner/"+state)
            .then(response=>response.data);
    }
}
const StateInfoService = new StateService();
export default StateInfoService;