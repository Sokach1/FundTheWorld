// ContractContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import CROWDFUNDING_ABI from "./abi/Crowdfunding.json";
import TOKEN_ABI from "./abi/CrowdfundingToken.json"

const ContractContext = createContext();
export const useContract = () => useContext(ContractContext);

export const ContractProvider = ({ children }) => {
    const [web3, setWeb3] = useState(null);
    const [crowdfundingContract, setCrowdfundingContract] = useState(null);
    const [tokenContract, setTokenContract] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');

    // const tokenAddress = '0x3968fc557aD385bbD5Bc6b0bF5e3ef0C6029C181'
    // const crowdfundingAddress = '0x2b3ac74f6cf8da8454D384df858D415b229862Bf'
    //

    const tokenAddress = '0x19C55Add8dcbb16D61B700bc7EDfD81F39A8aC52'
    const crowdfundingAddress = '0x92259A35013Ef6A4C7013ec7a6EF155c3f9E789C'

    // useEffect(() => {
    //     connect()
    // }, []);


    const connect = async () => {
        if (window.ethereum) {
                try {
                    const web3Instance = new Web3(window.ethereum);
                    setWeb3(web3Instance);
                    await window.ethereum.enable();
                    const accounts = await web3Instance.eth.getAccounts();
                    setAccounts(accounts);
                    if (accounts.length > 0) {
                        // const crowdfundingAddress = '0x3C41E23583bEC9461D5C2EfB7b9D6A84508A65FF';
                        // const tokenAddress = '0x6D699aDeda274B8c314372Cca088C0e932a19259'
                        setSelectedAccount(accounts[0]);
                        // sessionStorage.setItem('selectedAccount', accounts[0])


                        const CrowdfundingContractInstance = new web3Instance.eth.Contract(CROWDFUNDING_ABI, crowdfundingAddress);
                        const TokenContractInstance = new web3Instance.eth.Contract(TOKEN_ABI, tokenAddress)

                        setCrowdfundingContract(CrowdfundingContractInstance);
                        setTokenContract(TokenContractInstance);

                        // setContract(ContractInstance);
                    }
                    await changeNetwork();

                } catch (error) {
                    console.error('User denied account access');
                }
            } else {
                console.log('MetaMask not detected');
            }
        };

    async function changeNetwork() {
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{chainId: "0xaa36a7"}],
            });
        } catch (switchError) {
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
                                // rpcUrls: ["https://sepolia.infura.io/v3/"],
                                rpcUrls: ["https://sepolia.infura.io/v3/2d5ceb10076349dba938c3eb1d20451c"],
                            },
                        ],
                    });
                } catch (addError) {
                    alert("Error in add sepolia testnet");
                }
            }
        }
    }
    return (
        <ContractContext.Provider value={{ web3, crowdfundingContract, tokenContract, accounts, selectedAccount, connect }}>
            {children}
        </ContractContext.Provider>
    );
};
