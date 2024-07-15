import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const MetaMaskLogin = () => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');

    useEffect(() => {
        loadWeb3();
    }, [])

    const loadWeb3 = async () => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);

            try {
                await window.ethereum.enable();
                const accounts = await web3Instance.eth.getAccounts()
                setAccounts(accounts);
                if(accounts.length > 0){
                    setSelectedAccount(accounts[0])
                }

            } catch (error) {
                console.error('User denied account access');
            }

        } else {
            console.error('MetaMask not detected');
        }
    };

    const handleAccountChange = (event) => {
        setSelectedAccount(event.target.value);
    }

    const renderAccountOptions = () => {
        return accounts.map((account) => (
            <option key={account} value={account}>
                {account}
            </option>
        ));
    }


    return (
        <div>
            <h1>MetaMask Login</h1>
            {web3 ? (
                <>
                    <p>Connected to Login</p>
                    <p>Current Account: {selectedAccount}</p>
                    <select onChange={handleAccountChange} value={selectedAccount}>
                        {renderAccountOptions()}
                    </select>
                </>
            ) : (
                <p>MetaMask not detected</p>
            )}
            <button onClick={loadWeb3}>Connect MetaMask</button>
        </div>
    )
 };
export default MetaMaskLogin;
