import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import './App.css'
import './style.css';


import FooterComponent from './components/FooterComponent';
import NavbarComponent from "./components/NavbarComponent";
import ConnectWallet from './components/ConnectWallet';

import CreateProjectComponent from './pages/CreateProjectComponent';
import UserProfile from './pages/UserProfile';
import ProjectComponent from "./pages/ProjectDetails";
import TokenComponent from './pages/Token'
import DiscoverComponent from "./pages/Discover";
import HomeComponent from './pages/Home';

import { useContract } from './ContractContext';


function App() {
    const { crowdfundingContract, selectedAccount, connect } = useContract();

    // useEffect(() => {
    //     if (!crowdfundingContract) {
    //         connect();
    //     }
    // }, [connect, crowdfundingContract])


    const checkConnected = (component) => {
        return !crowdfundingContract ? (
            <ConnectWallet connectMetamask={connect} />
        ) : (
            component
        );
    };


    return (
        <div className="app">
            {/*<ContractProvider>*/}
                <Router basename={process.env.PUBLIC_URL}>
                    {/*{contract && <NavbarComponent address={selectedAccount} /> }*/}
                    {crowdfundingContract && <NavbarComponent address={selectedAccount} />}
                    <Routes>
                        <Route path="/"
                            element={checkConnected(
                                // <HomeComponent contract={contract} />
                                <HomeComponent />
                            )}
                        />
                        <Route path="/home"
                            element={checkConnected(
                                // <HomeComponent contract={contract} />
                                <HomeComponent />
                            )}
                        />
                        <Route
                            path="/discover"
                            element={checkConnected(
                                // <DiscoverComponent contract={contract} />
                                <DiscoverComponent />
                            )}
                        />
                        <Route
                            path="/create_project"
                            element={checkConnected(
                                // <CreateProjectComponent contract={contract} />
                                <CreateProjectComponent />
                            )}
                        />
                        <Route
                            path="/token"
                            element={checkConnected(<TokenComponent />)}
                        />
                        <Route
                            path="/user"
                            element={checkConnected(<UserProfile />)}
                        />
                        <Route
                            path="/project"
                            element={checkConnected(<ProjectComponent />)}
                        />
                    </Routes>
                    {/*{contract && <FooterComponent />}*/}
                    {crowdfundingContract && <FooterComponent />}
                </Router>
            {/*</ContractProvider>*/}
        </div>
    )
}


export default App;
