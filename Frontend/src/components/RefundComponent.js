import React from 'react';
import { useContract } from '../ContractContext';

const RefundComponent = ({ projectId }) => {
    const { crowdfundingContract, accounts } = useContract();

    const handleRefund = async () => {
        try {
            await crowdfundingContract.methods.refund(projectId).send({ from: accounts[0] });
            alert('Refund successful');
        } catch (error) {
            console.error('Refund failed', error);
            alert('Refund failed');
        }
    };

    return (
        <div>
            <button onClick={handleRefund}>Refund</button>
        </div>
    );
};

export default RefundComponent;
