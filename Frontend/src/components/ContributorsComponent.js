import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContract } from "../ContractContext";
import axios from "axios";

function ContributorsComponent (props) {

    const location = useLocation()
    const {projectId} = location.state || {}
    const { crowdfundingContract, tokenContract, accounts } = useContract();

    const [contributors, setContributors] = useState([])

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchContributorsData = async () => {
        try {
            const contributorsData = await crowdfundingContract.methods.getContributions(props.projectId).call();
            const contributors = []
            const length  = Number(contributorsData[0].length)

            for (let i = 0; i < length; i++) {
                contributors.push({
                    index: i,
                    contributorAddress: contributorsData[0][i],
                    amount: String(contributorsData[1][i])
                })
            }

            setContributors(contributors)
            setLoading(false);
        } catch (error) {
            console.error('Error fetching project data:', error);
            setError('Failed to fetch project data.');
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchContributorsData();
        }, [])

        // if (loading) return <div>Loading...</div>;
        // if (error) return <div>Error: {error}</div>;
        // if (!contributors) return null;

    return (
        <div className="comments-container">
            <h2>Contributors</h2>
                {contributors.map((contribute, index) => (
                    <div key={index} className="comment">
                    <p className="comment-details">{contribute.amount}CFT</p>
                    <p className="comment-meta">
                    {/*Commented by User ID {contribute.contributorAddress} on {new Date(comment.timestamp).toLocaleDateString()}*/}
                        Donated by User ID {contribute.contributorAddress}
                    </p>
                    </div>
                ))}
        </div>
    )

}

export default ContributorsComponent;
