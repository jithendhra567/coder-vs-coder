import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';
import apolloSetup from './utils/apolloConfig';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider } from '@apollo/client';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloSetup}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
