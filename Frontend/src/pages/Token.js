import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import tokenABI from '../abi/CrowdfundingToken.json';
import { useContract } from '../ContractContext';
const Token = () => {
    // const [account, setAccount] = useState('');
    // // const [web3, setWeb3] = useState(null);
    // // const [tokenContract, setTokenContract] = useState(null);
    // const [balance, setBalance] = useState('0');
    // const {web3, crowdfundingContract, tokenContract, accounts} = useContract();

    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('0');
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [tokenDecimals, setTokenDecimals] = useState(0);
    const [tokenTotalSupply, setTokenTotalSupply] = useState('0');
    const {web3, tokenContract, accounts} = useContract();

    // const tokenAddress = '0x6D699aDeda274B8c314372Cca088C0e932a19259'
    // const tokenAddress = '0xC21B1BfFf32f0871D8ab48985f4E8F400Db19005';


    const getBalance = async () => {
        if (tokenContract && account) {
            try {
                const balance = await tokenContract.methods.balanceOf(account).call();
                console.log(balance)
                setBalance(Number(balance));
            } catch (error) {
                console.error(error);
                alert('Failed to fetch balance.');
            }
        }
    };


    const transfer = async (toAddr, value) => {
        if (tokenContract && account) {
            try {
                const result = await tokenContract.methods.transfer(toAddr, value).send({ from: account });
                alert('Transfer successful');
            } catch (error) {
                console.log(error)
                alert('Failed to transfer.');
            }
        }
    }

    const approve = async (spender, value) => {
        if (tokenContract && account) {
            try {
                await tokenContract.methods.approve(spender, value).send({ from: account });
                alert('Approval successful');
            } catch (error) {
                console.error(error);
                alert('Failed to approve.');
            }
        }
    };


    const transferFrom = async (from, to, value) => {
        if (tokenContract && account) {
            try {
                await tokenContract.methods.transferFrom(from, to, value).send({ from: account });
                alert('TransferFrom successful');
            } catch (error) {
                console.error(error);
                alert('Failed to transferFrom.');
            }
        }
    };

    const getAllowance = async (owner, spender) => {
        if (tokenContract) {
            try {
                const allowance = await tokenContract.methods.allowance(owner, spender).call();
                alert(`Allowance: ${allowance}`);
            } catch (error) {
                console.error(error);
                alert('Failed to fetch allowance.');
            }
        }
    };

    const getTokenDetails = async () => {
        if (tokenContract) {
            try {
                const name = await tokenContract.methods.name().call();
                const symbol = await tokenContract.methods.symbol().call();
                const decimals = await tokenContract.methods.decimals().call();
                const totalSupply = await tokenContract.methods.totalSupply().call();

                setTokenName(name);
                setTokenSymbol(symbol);
                setTokenDecimals(decimals);
                setTokenTotalSupply(totalSupply);
            } catch (error) {
                console.error(error);
                alert('Failed to fetch token details.');
            }
        }
    };

    useEffect(() => {
        if (web3 && accounts.length > 0) {
            setAccount(accounts[0]);
            getBalance();
            getTokenDetails();
        }
    }, [tokenContract, account]);

    return (
        <div>
            <h1>Token Dashboard</h1>
            <p>Account: {account}</p>
            <p>Balance: {balance} Tokens</p>
            <p>Name: {tokenName}</p>
            <p>Symbol: {tokenSymbol}</p>
            <p>Decimals: {tokenDecimals}</p>
            <p>Total Supply: {tokenTotalSupply}</p>
            <button onClick={getBalance}>Refresh Balance</button>
            <div>
                <h2>Transfer</h2>
                <input type="text" placeholder="Recipient Address" id="toAddr" />
                <input type="text" placeholder="Amount" id="transferValue" />
                <button onClick={() => transfer(document.getElementById('toAddr').value, document.getElementById('transferValue').value)}>Transfer</button>
            </div>
            <div>
                <h2>Approve</h2>
                <input type="text" placeholder="Spender Address" id="spender" />
                <input type="text" placeholder="Amount" id="approveValue" />
                <button onClick={() => approve(document.getElementById('spender').value, document.getElementById('approveValue').value)}>Approve</button>
            </div>
            <div>
                <h2>TransferFrom</h2>
                <input type="text" placeholder="From Address" id="fromAddr" />
                <input type="text" placeholder="To Address" id="toAddrFrom" />
                <input type="text" placeholder="Amount" id="transferFromValue" />
                <button onClick={() => transferFrom(document.getElementById('fromAddr').value, document.getElementById('toAddrFrom').value, document.getElementById('transferFromValue').value)}>TransferFrom</button>
            </div>
            <div>
                <h2>Allowance</h2>
                <input type="text" placeholder="Owner Address" id="ownerAddr" />
                <input type="text" placeholder="Spender Address" id="spenderAddr" />
                <button onClick={() => getAllowance(document.getElementById('ownerAddr').value, document.getElementById('spenderAddr').value)}>Get Allowance</button>
            </div>
        </div>
    );
};

export default Token;
