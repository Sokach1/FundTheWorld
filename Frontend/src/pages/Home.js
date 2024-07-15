import { useEffect, useState } from 'react';
import CategoryComponent from '../components/CategoryComponent'
import { Link } from "react-router-dom";
import dummyPic from "../assets/pg1.jpg";
import { useContract } from '../ContractContext';
import ScrollShowbarComponent from "../components/ScrollShowbarComponent";
const HomeComponent = (props) => {
    const {web3, crowdfundingContract, tokenContract, accounts} = useContract();
    const PRECISION = 10 ** 18;
    const [stats, setStats] = useState({
        projects: 0,
        fundings: 0,
        balance: 0,
    });
    const [project, setProject] = useState([])
    const [featuredRcmd, setFeaturedRcmd] = useState([]);
    const [recentUploads, setRecentUploads] = useState([]);

    useEffect(() => {
        getAllProjects()
    }, [])

    const renderRecommendations = (val) => {
        return val.map((project, index) => {
            return (
                <div className="recommendationCard" key={index}>
                    <Link to="/project" state={{ projectId: project.index }}>
                        <div
                            className="rcmdCardImg"
                            style={{
                                backgroundImage: project.index !== null
                                    ? `url(${getImagePath(project.index)})`
                                    : dummyPic,
                            }}
                        />
                    </Link>
                    <div className="rcmdCardDetails">
                        <div className="rcmdCardHeading">
                            <Link to="/project" state={{ projectId: project.index }}>
                                {project.name}
                            </Link>
                        </div>
                        <div className="rcmdCardFundedPercentage">
                            {((project.balance / project.goal) * 100).toFixed(2) +
                                "% Funded"}
                        </div>
                        <div className="rcmdCardAuthor">{"By " + project.creator}</div>
                    </div>
                </div>
            );
        });
    };

    const getAllProjects = async() => {
        try {
            const projectData = await crowdfundingContract.methods.getAllProjects().call();
            // Format the data into an array of objects
            let projects = [];
            let amount = 0, balance = 0;
            for (let i = 0; i < projectData[0].length; i++) {
                projects.push({
                    index: Number(i),
                    creator: projectData[0][i],
                    name: projectData[1][i],
                    description: projectData[2][i],
                    category: projectData[3][i],
                    goal: Number(projectData[4][i]),
                    startTime: Number(projectData[5][i]),
                    endTime: Number(projectData[6][i]),
                    balance: Number(projectData[7][i]),
                });
                amount += Number(projectData[4][i]);
                balance += Number(projectData[7][i])
            }

            projects = projects.reverse()
            setProject(projects)
            setFeaturedRcmd(projects)
            setRecentUploads(projects)
            setStats({
                projects: projects.length,
                fundings: amount,
                balance: balance
                })
        } catch (err) {
            alert(err);
            console.log(err);
        }
    }

    const getImagePath = (id) => {
        try {
            return require(`../assets/images/${id}.jpg`); // adjust the path if necessary
        } catch (error) {
            console.warn(`Image for ${id} not found, using dummy image`);
            return dummyPic;
        }
    };


    return (
        <>
            <CategoryComponent isHome={true}/>
            {/* siteStats */}
            <div className="siteStats">
                <div className="tagLine">
                    Welcome to the Crowdfunding Platform
                    <br/>
                    Use your tokens to invest in projects you believe in
                </div>
                <div className="smallHeading">TILL THIS DAY</div>
                <div className="stats">
                    <div className="statItem">
                        <div className="statItemValue">{stats.projects}</div>
                        <div className="statItemTag">projects </div>
                    </div>
                    <div className="statItem">
                        <div className="statItemValue">{stats.fundings + " CFT"}</div>
                        <div className="statItemTag">towards creative work</div>
                    </div>
                    <div className="statItem">
                        <div className="statItemValue">{stats.balance}</div>
                        <div className="statItemTag">backings</div>
                    </div>
                </div>
            </div>

            {featuredRcmd.length !== 0 ? (
                <div className="suggestions">
                    <div className="suggLeftContainer">
                        <div className="featuredCard">
                            <div className="featuredHeading">FEATURED PROJECT</div>
                            <Link to="/project" state={{ projectId: featuredRcmd[0].index }}>
                                <div
                                    className="featuredCardProjectImg"
                                    style={{
                                        backgroundImage: featuredRcmd[0].index !== null
                                            ? `url(${getImagePath(featuredRcmd[0].index)})`
                                            : dummyPic,
                                    }}
                                />
                            </Link>
                            <div className="featuredProjectHeading">
                                <Link to="/project" state={{ projectId: featuredRcmd[0].index }}>
                                    {featuredRcmd[0].name}
                                </Link>
                            </div>
                            <div className="featuredProjectDescription">
                                {featuredRcmd[0].description}
                            </div>
                            <div className="featuredProjectAuthor">
                                {"By " + featuredRcmd[0].creator}
                            </div>
                        </div>
                    </div>
                    <div className="suggRightContainer">
                        <div className="recommendationList">
                            <div className="recommendationHeading">RECOMMENDED FOR YOU</div>
                            {renderRecommendations(featuredRcmd.slice(1,4))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="noProjects">No projects found</div>
            )}
            <ScrollShowbarComponent
                recentUploads={recentUploads}
                heading={"RECENT UPLOADS"}
                emptyMessage={"No recent uploads"}
            />
        </>

    )
}

export default HomeComponent;
