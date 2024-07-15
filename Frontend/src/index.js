import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ContractProvider} from "./ContractContext";
import axios from 'axios';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
axios.defaults.baseURL = "http://127.0.0.1:5000"
const root = ReactDOM.createRoot(document.getElementById('root'));
const client = new ApolloClient({
    uri: 'http://127.0.0.1:4000/', // 设置你的GraphQL服务器的URL
    cache: new InMemoryCache(),
});
root.render(
    <React.StrictMode>
        {/*<ApolloProvider>*/}
            <ContractProvider client={client}>
                <App />
            </ContractProvider>
        {/*</ApolloProvider>*/}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
