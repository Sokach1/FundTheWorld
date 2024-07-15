import ScrollShowbarComponent from "../components/ScrollShowbarComponent";
import { useState, useEffect } from "react";
import { useContract } from "../ContractContext";
import { useLocation } from "react-router-dom";
import dummyPic from "../assets/pg1.jpg";

import axios from "axios";
function UserProfile(props) {
    // const location = useLocation()
    // const {address} = location.state || {}
    const [userProjects, setUserProjects] = useState([]);
    const [userContributions, setUserContributions] = useState([]);
    const { crowdfundingContract, tokenContract, accounts, selectedAccount } = useContract();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRegister, setIsRegister] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false);

    const [formValues, setFormValues] = useState({
        address: selectedAccount,
        email: "",
        username: "",
        tel: "",
        password: ""
    });

    const openEditModal = () => {
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formValues)
        try {
            // Send edited data to backend for saving
            const response = await axios.put(`/users/userinfo/address/${selectedAccount}`, formValues);
            if (response.status === 200) {
                // Update userData state with edited data
                setUserData(response.data);
                // Close the edit modal
                closeEditModal();
                // Set register status to true
                setIsRegister(true);
            } else {
                console.log("Failed to update user info");
            }
        } catch (error) {
            console.error("Error updating user info:", error);
        }
    };

    // 获取用户创建的项目列表
    const getUserProjects = async () => {
        try {
            const projectData = await crowdfundingContract.methods.getCreatorProjects(selectedAccount).call();
            const projects = [];
            for (let i = 0; i  < projectData.length; i++) {
                const project = await crowdfundingContract.methods.projects(Number(projectData[i])).call();
                projects.push({
                    index: Number(projectData[i]),
                    creator: project['creator'],
                    name: project['name'],
                    description: project['description'],
                    category: project['category'],
                    goal: Number(project['goal']),
                    startTime: Number(project['startTime']),
                    endTime: Number(project['endTime']),
                    fundsRaised: Number(project['fundsRaised']),
                    fundsRefunded: project['fundsRefunded'],
                    balance: Number(project['balance'])
                });
            }
            console.log(projects)
            setUserProjects(projects);
        } catch (err) {
            alert(err);
            console.log(err);
        }
    };

    // 获取用户资助的项目列表
    const getUserContributions = async () => {
        try {
            const contributionsData = await crowdfundingContract.methods.getUserContributions(selectedAccount).call();
            const contributions = [];
            for (let i = 0; i < contributionsData.length; i++) {
                if (contributionsData[i] > 0) {
                    const project = await crowdfundingContract.methods.getProjectDetails(i).call();
                    contributions.push({
                        index: i,
                        creator: project[0],
                        name: project[1],
                        description: project[2],
                        goal: Number(project[3]),
                        startTime: Number(project[4]),
                        endTime: Number(project[5]),
                        fundsRaised: Number(project[6]),
                        fundsRefunded: project[7],
                        balance: Number(project[8]),
                        contribution: contributionsData[i]
                    });
                }
            }
            setUserContributions(contributions);
        } catch (err) {
            alert(err);
            console.log(err);
        }
    };

    // 获取用户的链下信息
    const getUserDetails = async () => {
        try {
            await axios.get(`/users/userinfo/address/${selectedAccount}`)
                .then (response => {
                    if (response.status === 200) {
                        console.log(response)
                        setUserData(response.data);
                        setLoading(false);
                        setIsRegister(true)
                    } else if (response.status === 404) {
                        console.log(response)
                        setLoading(false);
                        setIsRegister(false)
                    }

                })
                .catch(error => {
                    console.error('error:', error)
                })

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    const submitUserDetails = async () => {
        console.log(userData)
    }

    useEffect(() => {
        getUserProjects();
        getUserContributions();
        getUserDetails();
    }, []);

    return (
        <div className="profileContainer">
            <div className="profileHeadingContainer">
                <h1>{selectedAccount}</h1>
                {isRegister ? (
                    <button className="submit" onClick={openEditModal}>Edit Info</button>
                ) : (
                    <button className="submit" onClick={openEditModal}>Register Info</button>
                )}
            </div>
            {/* Edit Modal */}
            {showEditModal && (
                <div className="editModal">
                    <div className="editModalContent">
                        <span className="close" onClick={closeEditModal}>&times;</span>
                        {/* Edit Form */}
                        <form onSubmit={handleSubmit}>
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={formValues.username}
                                onChange={handleChange}
                            />
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={formValues.password}
                                onChange={handleChange}
                            />
                            <label>Telephone:</label>
                            <input
                                type="text"
                                name="tel"
                                value={formValues.tel}
                                onChange={handleChange}
                            />
                            <label>Email:</label>
                            <input
                                type="text"
                                name="email"
                                value={formValues.email}
                                onChange={handleChange}
                            />
                            <button className="submit" type="submit">Save</button>
                        </form>
                    </div>
                </div>
            )}
            {/* Created Projects */}
            <div className="projectsContainer">
                <h2>Created Projects</h2>
                {userProjects.length ? (
                    <ScrollShowbarComponent
                        recentUploads={userProjects}
                        heading={""}
                        emptyMessage={"No created projects"}
                    />
                ) : (
                    <p>No created projects</p>
                )}
            </div>
            {/* Funded Projects */}
            <div className="projectsContainer">
                <h2>Funded Projects</h2>
                {userContributions.length ? (
                    <ScrollShowbarComponent
                        recentUploads={userContributions}
                        heading={"Funded Projects"}
                        emptyMessage={"No funded projects"}
                    />
                ) : (
                    <p>No funded projects</p>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
