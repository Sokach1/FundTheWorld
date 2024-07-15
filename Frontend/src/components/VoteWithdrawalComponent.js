
import React, { useState, useEffect } from 'react';
import '../assets/VoteComponent.css';
import { useContract } from '../ContractContext';

const VoteWithdrawalComponent = (props) => {
    const [votes, setVotes] = useState({ approve: 10, disapprove: 20 });
    const [hasVoted, setHasVoted] = useState(false);
    const { crowdfundingContract, selectedAccount } = useContract();
    const projectId = props.projectId;
    const withdrawal = props.withdrawal;

    const handleVote = async (approve) => {
        try {
            await crowdfundingContract.methods.voteForWithdrawal(projectId, withdrawal.index, approve).send({ from: selectedAccount });
            alert(`Vote ${approve ? 'approved' : 'disapproved'} successful`);
        } catch (error) {
            console.error(`Vote ${approve ? 'approval' : 'disapproval'} failed`, error);
            alert(`Vote ${approve ? 'approval' : 'disapproval'} failed`);
        }
    };

    const getUserVote = async () => {
        console.log('get')
        try {
           const res =  await crowdfundingContract.methods.getUserVotes(selectedAccount).call();
           const approveList = res[0];
           const disapproveList = res[1];
           if (approveList[projectId][withdrawal.index] === true || disapproveList[projectId][withdrawal.index] === true) {
               setHasVoted(true)
           } else {
               setHasVoted(false)
           }
           console.log(res)
        } catch (error) {
            console.error(error);

        }
    }




    useEffect(() => {
        getUserVote()
    })

    const totalVotes = withdrawal.approvalVotes + withdrawal.disapprovalVotes;
    const approvePercentage = totalVotes ? (withdrawal.approvalVotes / totalVotes) * 100 : 0;
    const disapprovePercentage = totalVotes ? (withdrawal.disapprovalVotes / totalVotes) * 100 : 0;

    return (
        <div className="vote-component">
            { !hasVoted ? (
                    <div className="buttons-container">
                        <button className="vote-button approve-button" onClick={() => handleVote(true)}>Approve</button>
                        <button className = "vote-button disapprove-button" onClick={() => handleVote(false)}>Disapprove</button>
                    </div>
                ) : (
                    <div>
                        <p>Thank you for voting!</p>

                        <div className="progress-bar">
                            <div
                                className="progress-bar-approve"
                                style={{ width: `${approvePercentage}%` }}
                            >
                                {approvePercentage.toFixed(2)}%Approve
                            </div>
                            <div
                                className="progress-bar-disapprove"
                                style={{ width: `${disapprovePercentage}%` }}
                            >
                                {disapprovePercentage.toFixed(2)}%Disapprove
                            </div>
                        </div>
                    </div>
                )
            }
        </div>

    );
};

export default VoteWithdrawalComponent;
