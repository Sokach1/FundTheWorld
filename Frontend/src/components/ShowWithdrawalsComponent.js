import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContract } from "../ContractContext";
import RequestWithdrawalComponent from "./RequestWithdrawalComponent";

import VoteWithdrawalComponent from "./VoteWithdrawalComponent";
import ExecuteWithdrawalComponent from "./ExecuteWithdrawalComponent";
function ShowWithdrawalsComponent (props) {

    const { crowdfundingContract, tokenContract, accounts, selectedAccount } = useContract();
    const [withdrawals, setWithdrawals] = useState([])

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const projectData = props.projectData;

    const fetchWithdrawalsData = async () => {
        try {
            const response = await crowdfundingContract.methods.getProjectWithdrawals(Number(projectData.projectId)).call();
            const withdrawalsData = []
            const length  = Number(response[0].length)

            for (let i = 0; i < length; i++) {

                withdrawalsData.push({
                    withdrawalId: i,
                    amount: Number(response[0][i]),
                    description: response[1][i],
                    startTime: Number(response[2][i]),
                    endTime: Number(response[3][i]),
                    executed: Boolean(response[4][i]),
                    approvalVotes: Number(response[5][i]),
                    disapprovalVotes: Number(response[6][i]),
                    status: getWithdrawalStatus(
                        Number(response[3][i]),
                        (Date.now()/1000),
                        Boolean(response[4][i]),
                        Number(response[5][i]),
                        Number(response[6][i])
                        )
                })
            }
            console.log(withdrawalsData)

            setWithdrawals(withdrawalsData.reverse())
            setLoading(false);
        } catch (error) {
            console.error('Error fetching project data:', error);
            setError('Failed to fetch project data.');
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchWithdrawalsData();
    }, [])

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error}</div>;
    // if (!contributors) return null;

    function getWithdrawalStatus(endTime, now, executed, approvalVotes, disapprocalVotes) {
        let code;
        let text;
        if (endTime > now) {
            code = 0;
            text = "Voting period not ended."
        } else if (executed) {
            code = 1;
            text = "Withdrawal request already executed.";
        } else if (approvalVotes + disapprocalVotes < projectData.fundsRaised / 2) {
            code = 2;
            text = "Not enough votes, request was disapproved.";
        } else if (approvalVotes < disapprocalVotes) {
            code = 3;
            text = "Disapproval votes exceed approval votes, request was disapproved.";
        } else {
            if (executed) {
                code = 4;
                text = "Request was approved, and already executed withdrawal."
            } else {
                code = 5;
                text = "Approval votes exceed disapproval votes, request was approved.";
            }
        }
        return { code, text };
    }

    function convertTimestampsToDuration(endTime, now) {
        // 计算时间差（以秒为单位）
        let durationInSeconds = endTime - now;
        // 计算天数、小时和分钟
        let days = Math.floor(durationInSeconds / (24 * 60 * 60));
        let hours = Math.floor((durationInSeconds % (24 * 60 * 60)) / (60 * 60));
        let minutes = Math.floor((durationInSeconds % (60 * 60)) / 60);
        // 返回结果
        return `${days} days, ${hours} hours, ${minutes} minutes`
    }

    return (
        <div className="comments-container">
            <h2>Withdrawals Request</h2>
            {withdrawals.map((withdrawal, index) => (
                <div key={index} className="comment">
                    <p className="comment-details">{withdrawal.amount}CFT</p>
                    <p className="comment-meta">
                        {/*Commented by User ID {contribute.contributorAddress} on {new Date(comment.timestamp).toLocaleDateString()}*/}
                        {withdrawal.description}
                    </p>
                    {
                        withdrawal.endTime > (Date.now() / 1000) ? (
                        <p className ="comment-meta">
                            {convertTimestampsToDuration(withdrawal.endTime, (Date.now() / 1000))}
                            <VoteWithdrawalComponent projectId={Number(props.projectId)} withdrawal={withdrawal} />
                        </p>
                    ) : (
                        <p className ="comment-meta">
                            {withdrawal.status['text']}
                        </p>
                    )
                    }

                    {
                        withdrawal.status.code === 5 && selectedAccount === projectData.creator ? (
                            <ExecuteWithdrawalComponent projectId={projectData.projectId} withdrawalId={withdrawal.withdrawalId}/>
                        ) : null
                    }
                </div>
            ))}
        </div>
    )

}

export default ShowWithdrawalsComponent;
