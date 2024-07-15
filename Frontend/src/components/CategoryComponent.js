import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

const CategoryComponent = (props) => {
    const navigate = useNavigate();
    const onClickFilter = (val) => {
        if (!props.isHome) {
            if (props.filter !== val) {
                props.changeCategory(val);
            } else {
                props.changeCategory(-1);
                document.getElementsByClassName("categoryItem")[val].blur();
            }
        } else {
            navigate("discover", {
                state: {
                    selected: val,
                },
            });
        }
    };
    const setSelectedFocus = () => {
        props.filter !== -1 &&
        document.getElementsByClassName("categoryItem")[props.filter]?.focus();
    };
    useEffect(() => {
        setSelectedFocus();
    }, [props.filter]);
    return (
            <div className="category">
                {["Education", "Animal", "Disaster", "Disease", "Family"].map((category, index) => (
                <div
                    key={index}
                    className="categoryItem"
                    tabIndex="1"
                    onClick={() => onClickFilter(index)}
                >
                    {category}
                </div>
                ))}
                {/*<div*/}
                {/*    className="categoryItem"*/}
                {/*    tabIndex="1"*/}
                {/*    onClick={() => onClickFilter(0)}*/}
                {/*>*/}
                {/*    Education*/}
                {/*</div>*/}
                {/*<div*/}
                {/*    className="categoryItem"*/}
                {/*    tabIndex="1"*/}
                {/*    onClick={() => onClickFilter(1)}*/}
                {/*>*/}
                {/*    Animal*/}
                {/*</div>*/}
                {/*<div*/}
                {/*    className="categoryItem"*/}
                {/*    tabIndex="1"*/}
                {/*    onClick={() => onClickFilter(2)}*/}
                {/*>*/}
                {/*    Disaster*/}
                {/*</div>*/}
                {/*<div*/}
                {/*    className="categoryItem"*/}
                {/*    tabIndex="1"*/}
                {/*    onClick={() => onClickFilter(3)}*/}
                {/*>*/}
                {/*    Disease*/}
                {/*</div>*/}
                {/*<div*/}
                {/*    className="categoryItem"*/}
                {/*    tabIndex="1"*/}
                {/*    onClick={() => onClickFilter(4)}*/}
                {/*>*/}
                {/*    Family*/}
                {/*</div>*/}
            </div>

    );

}

export default CategoryComponent;
