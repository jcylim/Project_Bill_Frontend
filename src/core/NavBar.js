import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signOut, isAuthenticated } from '../auth';

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return {color: "#ff9900"}
    } else return {color: "#ffffff"}
};

class NavBar extends Component {
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
                    {!isAuthenticated() ? (
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
                    ) : (
                        <>
                            <a className='navbar-brand col-md-3 col-lg-2 mr-0 px-3' href={`/${this.companyId}/dashboard`}>Workflow</a>
                            <input 
                                className="form-control form-control-dark w-100 mr-2" 
                                type="text" 
                                placeholder="Search" 
                                aria-label="Search"
                                onChange={this.handleChange} 
                            />
                            <Link 
                                className="btn btn-raised btn-info"
                                style={{'background': '#95a5a6'}} 
                                to={{
                                    pathname: `/${this.companyId}/customers/search`,
                                    state: { input }
                                }}
                            >
                                <div style={{'paddingLeft': '10px', 'paddingRight': '10px', 'fontSize': '0.9rem'}}>
                                    <i 
                                        className="fa fa-search"
                                        aria-hidden="true"
                                    />
                                </div>
                            </Link>
                            <ul className="navbar-nav px-3 nav-tabs">
                                <li className='nav-item text-nowrap'>
                                    <span className="nav-link" 
                                        onClick={() => signOut(() => history.push("/"))}>
                                        Sign Out
                                    </span>
                                </li>
                            </ul>
                        </>
                    )}
                </nav>
            </div>
        );
    }
}

export default withRouter(NavBar);