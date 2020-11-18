import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signOut, isAuthenticated } from '../auth';
import DefaultProfile from '../img/avatar.png';


const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return {color: "#ff9900"}
    } else return {color: "#ffffff"}
};

class NewNavBar extends Component {
    constructor() {
        super();
        this.companyId = isAuthenticated() && (isAuthenticated().company ? isAuthenticated().company._id : isAuthenticated().user.company);
        this.state = {
            input: ''
        }
    }

    componentDidMount () {
        const script = document.createElement("script");
    
        script.src = "dist/js/lim-realty.js";
        script.async = true;
    
        document.body.appendChild(script);
    }

    handleChange = event => {
        this.setState({ input: event.target.value });
    };

    render() {
        const { input } = this.state;
        const { history, handleCollapsedChange, collapsed, toggled, handleToggleSidebar } = this.props;

        const profileLink = isAuthenticated()

        return (
            <div className='sticky-top'>
                {isAuthenticated() && (
                    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a 
                                    className="nav-link push-menu"
                                    href="#" 
                                    role="button"
                                    onClick={() => handleCollapsedChange(!collapsed)}>
                                        <i className="fa fa-bars"></i>
                                </a>
                            </li>
                            {/* <li className="nav-item">
                                <a className="nav-link push-menu" data-toggle="collapse" data-target="#workflowNavBar" aria-controls="workflowNavBar" href="#" role="button"><i className="fa fa-bars"></i></a>
                            </li> */}
                        </ul>

                        <form className="form-inline ml-3">
                            <div className="input-group input-group-sm">
                                <input className="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search"/>
                                <div className="input-group-append">
                                    <button className="btn btn-navbar" type="submit">
                                        <i className="fa fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </form>

                        <ul className="navbar-nav ml-auto">
                            {isAuthenticated().user ? (
                                <li className="dropdown">
                                    <button 
                                        className="btn btn-light data-toggle"
                                        data-toggle="dropdown" 
                                        href="#"
                                        style={{'borderRadius': '12px'}}>
                                        <img
                                            className="img-circle mr-2"
                                            height='35px'
                                            width='35px'
                                            src={`${process.env.REACT_APP_API_URL}/${isAuthenticated().user.company}/user/photo/${isAuthenticated().user._id}`}
                                            alt={isAuthenticated().user.first_name}
                                            onError={i => (i.target.src = `${DefaultProfile}`)}
                                        />
                                        <span style={{'color': 'grey', 'text-transform': 'capitalize'}}>{`${isAuthenticated().user.first_name} ${isAuthenticated().user.last_name}`}</span>
                                    </button>
                                    <div className="dropdown-menu">
                                        <ul>
                                            <li><a href={`/${this.companyId}/employee/${isAuthenticated().user._id}`}><i className="fa fa-user nav-icon"></i> &nbsp;Profile</a></li>
                                            
                                            <li><a href="#"><i className="fa fa-info-circle nav-icon"></i> &nbsp;Help</a></li>
                                            
                                            <li><a onClick={() => signOut(() => history.push("/"))}><i className="fa fa-power-off nav-icon"></i> &nbsp;Logout</a></li>
                                        </ul>
                                    </div>
                                </li>
                            ) : (
                                <li className="dropdown">
                                    <button 
                                        className="btn btn-light data-toggle"
                                        data-toggle="dropdown" 
                                        href="#"
                                        style={{'borderRadius': '12px'}}>
                                        <img
                                            className="img-circle mr-2"
                                            height='35px'
                                            width='35px'
                                            src={`${DefaultProfile}`}
                                            alt='admin'
                                        />
                                        <span style={{'color': 'grey', 'text-transform': 'capitalize'}}>Admin</span>
                                    </button>
                                    <div className="dropdown-menu">
                                        <ul>
                                            <li><a href={`/${this.companyId}/profile`}><i className="fa fa-user nav-icon"></i> &nbsp;Profile</a></li>
                                            
                                            <li><a href="#"><i className="fa fa-info-circle nav-icon"></i> &nbsp;Help</a></li>
                                            
                                            <li><a onClick={() => signOut(() => history.push("/"))}><i className="fa fa-power-off nav-icon"></i> &nbsp;Logout</a></li>
                                        </ul>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </nav>
                )}
            </div>
        );
    }
}

export default withRouter(NewNavBar);