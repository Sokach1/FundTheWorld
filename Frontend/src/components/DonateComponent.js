import React, { useState } from 'react';
import '../style.css';
// import { useWeb3React } from '@web3-react/core';
import { useContract } from "../ContractContext";
function DonateComponent({ projectId }) {
    const { crowdfundingContract, tokenContract, accounts } = useContract();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    function handleChange(e) {
        setAmount(e.target.value);
    }

    const handleDonate = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {

            console.log(crowdfundingContract, amount, accounts[0])
            // const amountInWei = web3.utils.toWei(amount, 'ether');

            // Step 1: Approve the crowdfunding contract to spend user's tokens
            const approveTx = await tokenContract.methods.approve(crowdfundingContract._address, amount).send({ from: accounts[0] });
            console.log('Approve transaction:', approveTx);

            // Step 2: Donate to the project
            const donateTx = await crowdfundingContract.methods.donate(projectId, amount).send({ from: accounts[0] });
            console.log('Donate transaction:', donateTx);

            setSuccess('Donation successful!');
        } catch (error) {
            console.error('Error making donation:', error);
            setError('Failed to make donation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // <div className="modal">
            <div className="modalHeader">
                {/*<h1>*/}
                {/*    Payment{" "}*/}
                {/*    /!*<span className="closeBtn" onclick={() => closeModal()}>*!/*/}
                {/*    /!*    &times;*!/*/}
                {/*    /!*</span>*!/*/}
                {/*</h1>*/}
                <div className="modalContent">
                    <div className="paymentForm">
                        <label className="paymentLabel">Amount (CFT)</label>
                        <input
                            type="number"
                            name="payment"
                            id="payment"
                            className="payment"
                            placeholder="Enter CFT amount"
                            min="1"
                            step="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            />
                        <button className="submit" onClick={handleDonate} disabled={loading}>
                            {loading ? 'Processing...' : 'Donate'}
                        </button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                    </div>
                </div>
            </div>
        // </div>
    )
}

export default DonateComponent;
