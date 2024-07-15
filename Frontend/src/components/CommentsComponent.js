import React from "react";
import "../assets/CommentsStyle.css";
import axios from "axios"; // 引入评论样式文件
import { useEffect, useState } from "react";
const CommentsComponent = (props) => {

    const [comments, setComments] = useState([]);

    const getCommentsData = () => {
        axios.get('http://127.0.0.1:5000/project/project_comment/10000001')
            .then(response => {
                    // console.log(response.data)
                    setComments(response.data)
                }
            )
            .catch(error => console.error('Error fetching projects:', error));
    }

    useEffect(() => {
        getCommentsData();
    }, [])
   //  const comments = [
   //       {c_id: 1, timestamp: '2024-06-17T16:00:00.000Z', details: "Caring for children's educational issues.", uid: 1000000001, cpid: 10000001},
   //  {c_id: 3, timestamp: '2024-06-30T16:00:00.000Z', details: 'Every child has equal access to education.', uid: 1000000001, cpid: 10000001},
   // {c_id: 4, timestamp: '2024-07-03T16:00:00.000Z', details: 'The Government should increase its support for education in poor areas.', uid: 1000000003, cpid: 10000001},
   //  ]

    return (
        <div className="comments-container">
            <h2>Comments</h2>
            {comments.map((comment) => (
                <div key={comment.c_id} className="comment">
                    <p className="comment-details">{comment.details}</p>
                    <p className="comment-meta">
                        Commented by User ID {comment.uid} on {new Date(comment.timestamp).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default CommentsComponent;
