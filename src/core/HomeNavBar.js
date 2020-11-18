import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signOut, isAuthenticated } from '../auth';

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return {color: "#ff9900"}
    } else return {color: "#ffffff"}
};

class HomeNavBar extends Component {
    constructor() {
        super();
        this.companyId = isAuthenticated() && (isAuthenticated().company ? isAuthenticated().company._id : isAuthenticated().user.company);
        this.state = {
            input: ''
        }
    }

    handleChange = event => {
        this.setState({ input: event.target.value });
    };

    render() {
        const { input } = this.state;
        const { history } = this.props;

        return (
            <div className='sticky-top'>
                <nav className="navbar navbar-dark bg-primary flex-md-nowrap p-0">
                    {!isAuthenticated() && (
                        <ul className="nav nav-tabs bg-primary">                
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, "/")} to="/">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, "/signin")} to="/signin">
                                    Sign In
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, "/root/signup")} to="/root/signup">
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    )}
                </nav>
            </div>
        );
    }
}

export default withRouter(HomeNavBar);