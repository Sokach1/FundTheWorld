import React from 'react';
import { Link } from 'react-router-dom';

const NavbarComponent = (props) => {
    return (
        <div className="navbar" >
            <nav className="leftNavbarContainer">
                <div className="navItem">
                    <Link to="/">Home</Link>
                </div>
                <div className="navItem">
                    <Link to="/discover">Discover</Link>
                </div>
                <div className="navItem">
                    <Link to="/create_project">Start a project</Link>
                </div>
            </nav>
            <div className="centerNavbarContainer">FundTheWorld</div>
            <div className="rightNavbarContainer">
                <div className="navItem">
                    <Link to="/user" state = {{ address: props.address }} >
                    {props.address.slice(0,5) + "..." + props.address.slice(props.address.length - 4, props.address.length)}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NavbarComponent;
