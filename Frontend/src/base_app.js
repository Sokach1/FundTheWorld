import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes, Switch, Link } from "react-router-dom";
// import './App.css'
import './style.css';

import MetaMaskLogin from './components/MetaMaskLogin';

import Token from "./components/Token";

import Web3 from "web3";
import ABI from "./abi/Crowdfunding2.json";

import HomeComponent from './pages/Home';
import FooterComponent from './components/FooterComponent';
import NavbarComponent from "./components/NavbarComponent";
import ConnectWallet from './components/ConnectWallet';
import CreateProjectComponent from './components/CreateProjectComponent';
import TokenComponent from './components/Token'
import { ContractProvider } from './ContractContext';

function App() {

    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);


    const [selectedAccount, setSelectedAccount] = useState('');
    // expired
    // const contractAddress = '0xbA92a0A5015477C95b342f93b50887c6be19990a';
    const contractAddress = '0x3C41E23583bEC9461D5C2EfB7b9D6A84508A65FF';



    async function connect() {
        let res = await connectToMetamask();
        if (res) {
            await changeNetwork();
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance)
            try {
                await window.ethereum.enable();
                const accounts = await web3Instance.eth.getAccounts()
                setAccounts(accounts);
                if(accounts.length > 0){
                    setSelectedAccount(accounts[0])

                    const Contract = new web3.eth.Contract(ABI, contractAddress);
                    setContract(Contract);

                    // const projectData = await Contract.methods.getAllProjects().call();
                    // // Format the data into an array of objects
                    // const projects = [];
                    // for (let i = 0; i < projectData[0].length; i++) {
                    //     projects.push({
                    //         creator: projectData[0][i],
                    //         name: projectData[1][i],
                    //         description: projectData[2][i],
                    //         goal: Number(projectData[3][i]),
                    //         startTime: Number(projectData[4][i]),
                    //         endTime: Number(projectData[5][i]),
                    //         balance: Number(projectData[6][i]),
                    //     });
                    // }
                    // setProject(projects)
                }


            } catch (error) {
                console.error('User denied account access');
            }

        } else {
            console.log('MetaMask not detected');
        }
    }

    async function changeNetwork() {
        // switch network to avalanche
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xaa36a7" }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: "0xaa36a7",
                                chainName: "Sepolia Testnet",
                                nativeCurrency: {
                                    name: "SepoliaETH",
                                    symbol: "SepoliaETH",
                                    decimals: 18,
                                },
                                rpcUrls: ["https://sepolia.infura.io/v3/"],
                            },
                        ],
                    });
                } catch (addError) {
                    alert("Error in add avalanche FUJI testnet");
                }
            }
        }
    }
    const loadBlockchainData = async () => {
        if (contract && selectedAccount) {
            try {
                const projectData = await contract.methods.getAllProjects().call();
                console.log(projectData)
                // const formattedProject = {
                //     creator: projectData.creator,
                //     name: projectData.name,
                //     description: projectData.description,
                //     // goal: web3.utils.fromWei(projectData.goal.toString(), 'ether'),
                //     // startTime: new Date(projectData.startTime * 1000).toLocaleString(),
                //     // endTime: new Date(projectData.endTime * 1000).toLocaleString(),
                //     // fundsRaised: web3.utils.fromWei(projectData.fundsRaised.toString(), 'ether'),
                //     // balance: web3.utils.fromWei(projectData.balance.toString(), 'ether'),
                //     // fundsRefunded: projectData.fundsRefunded,
                // };
                // setProject(formattedProject);
            } catch (error) {
                console.error(error);
                alert('Failed to fetch project.');
            }
        }
    }


    async function connectToMetamask() {
        try {
            await window.ethereum.enable();
            return true;
        } catch (err) {
            return false;
        }
    }

    const checkConnected = (component) => {
        return !contract ? (
            <ConnectWallet connectMetamask={connect} />
        ) : (
            component
        );
    };

    useEffect(() => {
        connect()
        //loadBlockchainData()
    }, [])

    return (
        <div className="app">
            <ContractProvider>
                <Router basename={process.env.PUBLIC_URL}>
                    {contract && <NavbarComponent address={selectedAccount} /> }
                    <Routes>
                        <Route
                            path="/"
                            element={checkConnected(
                                <HomeComponent contract={contract} />)}
                        />
                        <Route
                            path="/home"
                            element={checkConnected(
                                <HomeComponent contract={contract} />
                            )}
                        />
                        <Route
                            path="/create_project"
                            element={checkConnected(
                                <CreateProjectComponent contract={contract} />
                            )}
                        />
                        <Route
                            path="/token"
                            element={checkConnected(
                                <TokenComponent />
                            )}
                        />

                    </Routes>
                    {contract && <FooterComponent />}
                </Router>
            </ContractProvider>
        </div>
    )
}


export default App;
