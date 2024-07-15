import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContract } from "../ContractContext";
import DonateComponent from "../components/DonateComponent";
import RefundComponent from "../components/RefundComponent";
import VoteWithdrawalComponent from "../components/VoteWithdrawalComponent";
import ShowWithdrawalsComponent from "../components/ShowWithdrawalsComponent";
import RequestWithdrawalComponent from "../components/RequestWithdrawalComponent";
import ExecuteWithdrawalComponent from "../components/ExecuteWithdrawalComponent";
import dummyPic from "../assets/pg1.jpg";
import ProjectNavbarComponent from "../components/ProjectNavbarComponent";
import CommentsComponent from "../components/CommentsComponent";
import ContributorsComponent from "../components/ContributorsComponent";
function ProjectComponent() {
    const location = useLocation()
    const {projectId} = location.state || {}
    const { crowdfundingContract, tokenContract, accounts } = useContract();

    const [projectData, setProjectData] = useState(null);
    const [projectStatus, setProjectStatus] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const PRECISION = 1;

    const [timeString, setTimeString] = useState("");
    const [selectedItem, setSelectedItem] = useState("comments");
    const handleSelect = (item) => {
        setSelectedItem(item);
    };
    const getImagePath = (id) => {
        try {
            return require(`../assets/images/${id}.jpg`); // adjust the path if necessary
        } catch (error) {
            // console.warn(`Image for ${id} not found, using dummy image`);
            return dummyPic;
        }
    };
    const fetchProjectData = async () => {
        try {
            const project = await crowdfundingContract.methods.projects(projectId).call();
            if (project) {
                const formattedProject = {
                    projectId: projectId,
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
                }

                setProjectData(formattedProject)
                const status = getProjectStatus(
                    formattedProject.endTime,
                    Math.floor(Date.now() / 1000),
                    formattedProject.fundsRaised,
                    formattedProject.goal,
                    formattedProject.balance
                );

                setProjectStatus(status.status);
                setTimeString(status.timeString);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching project data:', error);
            setError('Failed to fetch project data.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, []);


    function getProjectStatus(endTime, now, fundraised, goal, balance) {
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
        let timeString="";
        let status = 1;
        if (endTime > now && fundraised < goal) {
            // Case 1: Donation period ongoing, goal not reached
            status = "ongoing";
            timeString = `Remaining time: ${convertTimestampsToDuration(endTime, now)}`;
        } else if (endTime < now && fundraised < goal) {
            // Case 2: Goal not reached, donation period ended
            status = 'goalNotReached';
            timeString = "Project ended, goal not reached";
        } else if (endTime < now && fundraised >= goal) {
            // Case 3: Goal not reached, donation period ended
            if (balance > 0) {
                status = 'goalReachedFundsPending';
                timeString = "Project ended, goal reached. Funds pending withdrawal.";
            } else {
                status = 'goalReachedAllWithdrawn';
                timeString = "Project ended, goal reached. All funds withdrawn.";
            }
        }
        return {status, timeString}


    }

    // func to update the progress bar everytime getProjectDetails() executes.
    function updateProgressBar() {
        let progressBar = document.getElementsByClassName("progressBar")[0];
        progressBar.max = projectData.goal / PRECISION;
        progressBar.value = projectData.fundsRaised / PRECISION;
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!projectData) return null;

    const renderContent = () => {
        switch (selectedItem) {
            case "comments":
                return <CommentsComponent />;
            case "refund":
                return <RefundComponent />;
            case "withdrawal":
                return <RequestWithdrawalComponent />;
            case "vote":
                return <VoteWithdrawalComponent />;
            default:
                return <CommentsComponent />;
        }
    };

    return (
        <>
            <div className = "projectContainer">
                <div className="projectHeading">
                    <h1>{projectData.name}</h1>
                </div>
                <div className="projectTopContainer">
                    <div className="projectImage">
                        <img
                            src={
                                projectData.projectId === null ? getImagePath(projectData.projectId) : dummyPic
                            }
                            alt="test-pic"
                        />
                    </div>
                    <div className="projectInformationContainer">
                        <div className="progressBarContainer">
                            <progress
                                min="0"
                                max="10000"
                                value = {projectData.fundsRaised}
                                className="progressBar"
                            />
                        </div>
                        <div className="fundingValue">
                            <h2>{projectData.fundsRaised / PRECISION} CFT</h2>
                        </div>
                        <p className="goalValueContainer">
                            pledged of{" "}
                            <span className="goalValue">
                                {projectData.goal / PRECISION} CFT
                            </span>{" "}
                            goal
                        </p>
                        <div className="supporterContainer">
                            {/*<h2>{projectData.contributors.length}</h2>*/}
                        </div>
                        {/*<p className="afterSupporterContainer">backers</p>*/}
                        {/*<div className="remainingDaysContainer">*/}
                        {/*    <h2>{timeString}</h2>*/}
                        {/*</div>*/}
                        { projectStatus === 'ongoing' ? (
                            <div>
                                <p className="afterRemainingDaysContainer">
                                    {timeString}
                                </p>
                                <DonateComponent projectId={projectData.projectId} />
                            </div>
                        ) : (
                            <div>
                                <p>{timeString}</p>
                            </div>
                        )}
                        {/*{!isOver ? (!isOwner() && (*/}
                        {/*    <div className="supportButtonContainer">*/}
                        {/*        <button*/}
                        {/*            className="supportButton"*/}
                        {/*            onClick={() => onClickPayment()}*/}
                        {/*        >*/}
                        {/*            Back this project*/}
                        {/*        </button>*/}
                        {/*    </div>*/}
                        {/*)) : isOwner() ? ((claimFundCheck() && !projectDetails.claimedAmount) ? (*/}
                        {/*    <div className="supportButtonContainer">*/}
                        {/*        <button*/}
                        {/*            className="supportButton"*/}
                        {/*            onClick={() => claimFund()}*/}
                        {/*        >*/}
                        {/*            Claim Fund*/}
                        {/*        </button>*/}
                        {/*    </div>*/}
                        {/*) : (projectDetails.claimedAmount ? (<h2 style={ { color: 'red' } }>Fund claimed!</h2>) : '')) : (*/}
                        {/*    (checkIfContributor() && claimRefundCheck() && !projectDetails.refundClaimed[getContributorIndex()]) ?*/}
                        {/*        (<div className="supportButtonContainer">*/}
                        {/*                <button*/}
                        {/*                    className="supportButton"*/}
                        {/*                    onClick={() => claimRefund()}*/}
                        {/*                >*/}
                        {/*                    Claim Refund*/}
                        {/*                </button>*/}
                        {/*            </div>*/}
                        {/*        ) : (projectDetails.refundClaimed[getContributorIndex()] ? (<h2 style={{ color: 'red' }}>Refund Claimed!</h2>) : ''))}*/}
                        {/*/!*{modalShow && (*!/*/}
                        {/*    // <PaymentModal*/}
                        {/*    //     setModalShow={setModalShow}*/}
                        {/*    //     contract={props.contract}*/}
                        {/*    //     index={index}*/}
                        {/*    //     projectDetails={projectDetails}*/}
                        {/*    //     setProjectDetails={setProjectDetails}*/}
                        {/*    //     userAddress={props.userAddress}*/}
                        {/*    // />*/}
                        {/*)}*/}
                    </div>
                </div>
                <div className="projectBottomContainer">
                    <project className="project-info">
                        <p>Description: {projectData.description}</p>
                    </project>
                </div>
            </div>
            {/*<ProjectNavbarComponent onSelect={handleSelect} >*/}
            {/*    <div className="content">*/}
            {/*        {renderContent()}*/}
            {/*    </div>*/}
            {/*</ProjectNavbarComponent>*/}
            {/*{projectData.index === 5 ? <CommentsComponent /> :null}*/}


            <RequestWithdrawalComponent projectData = {projectData} />

            <ShowWithdrawalsComponent projectData = {projectData}/>

            <CommentsComponent projectId = { projectId }/>

            <ContributorsComponent projectId = { projectId }/>

            {/*<ProjectNavbarComponent projectId = {projectData.index}  />*/}
            {/*<StaticProjectComponent />*/}
        </>
    );
}

export default ProjectComponent;
