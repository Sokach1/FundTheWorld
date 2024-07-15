import CategoryComponent from "../components/CategoryComponent";
import { useEffect, useState } from "react";
import dummyPic from "../assets/pg1.jpg";
import { Link, useLocation } from "react-router-dom";
import { useContract } from '../ContractContext';
export default function DiscoverComponent(props) {
    const location = useLocation();
    const {web3, crowdfundingContract, tokenContract, accounts} = useContract();
    const [filter, setFilter] = useState(
        location?.state?.selected >= 0 ? location.state.selected : -1
    );
    const [projects, setProjects] = useState([]);
    const changeFilter = (val) => {
        setFilter(val);
    };

    useEffect(() => {
        if (location.state?.selected !== undefined) {
            setFilter(location.state.selected);
        }
    }, [location.state]);

    const getAllProjects = async() => {
        try {
            const projectData = await crowdfundingContract.methods.getAllProjects().call();
            // Format the data into an array of objects
            const projects = [];

            for (let i = projectData[0].length - 1; i  > 0; i--) {
                projects.push({
                    index: Number(i),
                    creator: projectData[0][i],
                    name: projectData[1][i],
                    description: projectData[2][i],
                    goal: Number(projectData[3][i]),
                    startTime: Number(projectData[4][i]),
                    endTime: Number(projectData[5][i]),
                    balance: Number(projectData[6][i]),
                });

            }
            setProjects(projects)


        } catch (err) {
            alert(err);
            console.log(err);
        }
    }

    const renderCards = () => {
        return projects.map((project, index) => {
            return (
                <Link to="/project" state={{ projectId: project.index }} key={index}>
                    <div className="projectCardWrapper">
                        <div className="projectCard">
                            <div
                                className="cardImg"
                                style={{
                                    backgroundImage: project.index
                                        ? `url(${getImagePath(project.index)})`
                                        : dummyPic,
                                }}
                            />
                            <div className="cardDetail">
                                <div className="cardTitle">{project.name}</div>
                                <div className="cardDesc">{project.description}</div>
                                <div className="cardAuthor">{project.creator}</div>
                            </div>
                        </div>
                    </div>
                </Link>
            );
        });
    };

    const getImagePath = (id) => {
        try {
            return require(`../assets/images/${id}.jpg`); // adjust the path if necessary
        } catch (error) {
            console.warn(`Image for ${id} not found, using dummy image`);
            return dummyPic;
        }
    };
    useEffect(() => {
        getAllProjects();
    }, [filter]);

    return (
        <>
            <CategoryComponent
                filter={filter}
                changeCategory={(val) => changeFilter(val)}
            />
            <div className="discoverHeading">Discover</div>
            <div className="discoverContainer">
                {projects.length !== 0 ? (
                    renderCards()
                ) : (
                    <div className="noProjects">No projects found</div>
                )}
            </div>
        </>
    );
}
