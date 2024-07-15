import React, {useEffect, useState} from 'react';
import { useContract } from '../ContractContext';

const RequestWithdrawalComponent = (props) => {
    const { crowdfundingContract, selectedAccount } = useContract();

    const [showRequestModal, setShowRequestModal] = useState(false);

    const [formValues, setFormValues] = useState({
        projectId: props.projectData.projectId,
        description: "",
        amount: 0,
        votingDuration:0
    });

    const handleRequestWithdrawal = async () => {
        if(formValues.amount > props.projectData.balance) {
            alert('Withdrawal request amount is larger than balance');
            return
        }
        console.log(formValues)

        try {
            const response = await crowdfundingContract.methods.
            requestWithdrawal(
                formValues.projectId,
                formValues.description,
                formValues.amount,
                formValues.votingDuration * 60
            ).send({ from: selectedAccount });
            console.log(response)
            alert('Withdrawal request successful');
        } catch (error) {
            console.error('Withdrawal request failed', error);
            alert('Withdrawal request failed');
        }
    };

    const openRequestModal = () => {
        setShowRequestModal(true);
    };

    const closeRequestModal = () => {
        setShowRequestModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault(); // 阻止表单默认提交行为
        handleRequestWithdrawal();
    };

    return (
        <div>
            <button className="submit" onClick={openRequestModal}>
                Request Withdrawal
            </button>
            {/* Request Modal */}
            {showRequestModal && (
                <div className="editModal">
                    <div className="editModalContent">
                        <span className="close" onClick={closeRequestModal}>&times;</span>
                        {/* Edit Form */}
                        <form onSubmit={handleSubmit}>
                            <label>Description:</label>
                            <input
                                type="description"
                                value={formValues.description}
                                name="description"
                                placeholder="Enter project description"
                                cols="50"
                                rows="5"
                                required
                                onChange={handleChange}
                            />
                            <label>Amount:</label>
                            <input
                                type="amount"
                                name="amount"
                                value={formValues.amount}
                                onChange={handleChange}
                            />
                            <label>Duration:</label>
                            <input
                                type="votingDuration"
                                name="votingDuration"
                                value={formValues.votingDuration}
                                onChange={handleChange}
                            />
                            <button className="submit" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestWithdrawalComponent;
