import React, { useState, useEffect } from 'react';

const ConnectWallet = ({connectMetamask}) => {
    const handleConnectClick = () => {
        connectMetamask(); // 这里调用传入的 connectMetamask 函数
    };

    return (
        <div className='connectWallet'>
            <div className='typingContainer'>
                <div className='typing'>FundTheWorld</div>
            </div>
            <div className="walletButtonContainer">
                <button className='walletButton' onClick={handleConnectClick}>
                    Connect to Metamask
                </button>
            </div>
        </div>
    )
}

export default ConnectWallet;
