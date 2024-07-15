import React from 'react';
import { useContract } from '../ContractContext';

const ExecuteWithdrawalComponent = ({ projectId, withdrawalId }) => {
    const { crowdfundingContract, selectedAccount } = useContract();

    const handleExecuteWithdrawal = async () => {
        console.log(projectId, withdrawalId)
        try {
            await crowdfundingContract.methods.executeWithdrawal(projectId, withdrawalId).send({ from: selectedAccount });
            alert('Withdrawal executed successfully');
        } catch (error) {
            console.error('Withdrawal execution failed', error);
            alert('Withdrawal execution failed');
        }
    };

    return (
        <div>
            <button onClick={handleExecuteWithdrawal}>Execute Withdrawal</button>
        </div>
    );
};

export default ExecuteWithdrawalComponent;
