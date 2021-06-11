import axios from 'axios';
import React, { Provider } from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { UserContext } from './context/UserContext.js';
import UserContextProvider from './context/UserContextProvider';

ReactDOM.render(
    <UserContextProvider>
        <App />
    </UserContextProvider>, 
document.getElementById('root'));
