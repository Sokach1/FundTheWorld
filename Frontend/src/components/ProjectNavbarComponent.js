import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CommentsComponent from "./CommentsComponent";

const InformationComponent = () => (
    <div className="content">
        <h2>Information</h2>
        {/* Information specific content */}
    </div>
);

// const CommentsComponent = () => (
//     <div className="content">
//         <h2>Comments</h2>
//         {/* Comments specific content */}
//     </div>
// );

const ContributorsComponent = () => (
    <div className="content">
        <h2>Contributors</h2>
        {/* Contributors specific content */}
    </div>
);

const WithdrawalRequestComponent = () => (
    <div className="content">
        <h2>Withdrawal Request</h2>
        {/* Withdrawal Request specific content */}
    </div>
);

const ProjectNavbarComponent = ({ onSelect }) => {
    const [activeItem, setActiveItem] = useState("comments");

    const handleClick = (item) => {
        setActiveItem(item);
        onSelect(item);
    };

    const navigate = useNavigate();
    const [comments, setComments] = useState();
    // const setSelectedFocus = () => {
    //     selectedOption !== -1 &&
    //     document.getElementsByClassName("categoryItem")[selectedOption]?.focus();
    // };

    const getCommentsData = () => {
        axios.get('http://127.0.0.1:5000/project/project_comment/10000001')
            .then(response => {
                    console.log(response.data)
                setComments(response.data)
                }
            )
            .catch(error => console.error('Error fetching projects:', error));
    }

    useEffect(() => {
        getCommentsData();
    }, [])

    // useEffect(() => {
    //     setSelectedFocus();
    // }, [selectedOption]);

    return (
        <div>
        <div className="category">
            <div
                className={`categoryItem ${activeItem === "comments" ? "active" : ""}`}
                onClick={() => handleClick("comments")}
            >
                Comments
            </div>
            <div
                className={`categoryItem ${activeItem === "refund" ? "active" : ""}`}
                onClick={() => handleClick("refund")}
            >
                Information
            </div>
            <div
                className={`categoryItem ${activeItem === "withdrawal" ? "active" : ""}`}
                onClick={() => handleClick("withdrawal")}
            >
                Withdrawal
            </div>
            <div
                className={`categoryItem ${activeItem === "vote" ? "active" : ""}`}
                onClick={() => handleClick("vote")}
            >
                Contributors
            </div>

        </div>

    </div>
    );
}

export default ProjectNavbarComponent;
