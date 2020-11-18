import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import DefaultProfile from '../img/avatar.png';

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return {color: "#ff9900", 'text-transform': 'capitalize'}
    } else return {color: "green", 'text-transform': 'capitalize'}
};

class Menu extends Component {
    constructor() {
        super();
        this.companyId = isAuthenticated() && (isAuthenticated().company ? isAuthenticated().company._id : isAuthenticated().user.company);
        this.state = {
            historyData: {}
        }
    }

    init = () => {
        let historyData = JSON.parse(localStorage.getItem('history'));
        this.setState({ historyData });
    }

    componentDidMount() {
        this.init();
    }

    deleteHistoryItem = (historyData, type, item) => { 
        let filteredHistory = historyData;

        if (type === 'handshake') {
            let handshakes = historyData.handshakes.filter(h => !(h === item));
            filteredHistory.handshakes = handshakes; 
        } else {
            let customers = historyData.customers.filter(h => !(h === item));
            filteredHistory.customers = customers; 
        }

        localStorage.setItem('history', JSON.stringify(filteredHistory));
        
        // refresh
        this.init();
    };

    render() {
        const { historyData } = this.state;
        const { history } = this.props;

        return (
            <div className='col-md-2 d-none d-md-block bg-light sidebar'>
                {isAuthenticated() && (
                    <div className='pt-3' style={{position: 'fixed', 'overflow-y': 'auto', height: '100%'}}>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, `/${this.companyId}/dashboard`)} to={`/${this.companyId}/dashboard`}>
                                    <div style={{'font-size': '1rem'}}>
                                        <i 
                                            className="fa fa-home mr-2"
                                            aria-hidden="true"
                                        />
                                        Dashboard
                                    </div>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    className="nav-link" 
                                    style={isActive(history, `/${this.companyId}/handshakes`)} 
                                    to={{
                                        pathname: `/${this.companyId}/handshakes`,
                                        // state: {
                                        //     func: this.init()
                                        // }
                                    }}
                                >
                                    <div className='row'>
                                        <div className='mr-2' style={{'paddingLeft': '13px', 'font-size': '0.8rem'}}>
                                            <i 
                                                className="fa fa-handshake-o"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        Handshakes
                                    </div>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, `/${this.companyId}/customers`)} to={`/${this.companyId}/customers`}>
                                    <div className='row'>
                                        <div className='mr-2' style={{'paddingLeft': '14px', 'fontSize': '0.9rem'}}>
                                            <i 
                                                className="fa fa-users"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        Customers
                                    </div>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" style={isActive(history, `/${this.companyId}/documents`)} to={`/${this.companyId}/documents`}>
                                    <div className='row'>
                                        <div className='mr-2' style={{'paddingLeft': '15px', 'font-size': '1rem'}}>
                                            <i 
                                                className="fa fa-file-text"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        Documents
                                    </div>
                                </Link>
                            </li>
                            {isAuthenticated().user && (
                                <li className="nav-item">
                                    <Link 
                                        to={`/${this.companyId}/employee/${isAuthenticated().user._id}`}
                                        style={isActive(history, `/${this.companyId}/employee/${isAuthenticated().user._id}`)}
                                        className="nav-link">
                                            <div className='row'>
                                                <div className='mr-2' style={{'paddingLeft': '12px'}}>
                                                    <img
                                                        height='18px'
                                                        width='18px'
                                                        style={{borderRadius: '50%', border: '1px solid black'}}
                                                        src={`${process.env.REACT_APP_API_URL}/${isAuthenticated().user.company}/user/photo/${isAuthenticated().user._id}`}
                                                        alt={isAuthenticated().user.first_name}
                                                        onError={i => (i.target.src = `${DefaultProfile}`)}
                                                    />
                                                </div>
                                                {`${isAuthenticated().user.first_name} ${isAuthenticated().user.last_name}'s profile`}
                                            </div>
                                    </Link>
                                </li>
                            )}
                        </ul>
                        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted mb-2">
                            <div>
                                <span>Recently Viewed</span>
                                <a className='ml-2' href="#" onClick={() => this.init()}>
                                    <i className="fa fa-refresh" aria-hidden="true"></i>
                                </a>
                            </div>
                        </h6>
                        <ul class="nav flex-column mb-2">
                            <li className="nav-item">
                                <div className='row mb-1' style={{'paddingLeft': '14px'}}>
                                    <div className='mr-2' style={{'paddingLeft': '13px', 'font-size': '0.8rem'}}>
                                        <i 
                                            className="fa fa-handshake-o"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    Handshakes
                                </div>
                                {historyData && historyData.handshakes && historyData.handshakes.map((item) => {
                                    return (
                                        //render as state changes
                                        <div className='nav'>
                                            <button 
                                                type="button" 
                                                style={{'paddingLeft': '14px'}} 
                                                className="close" 
                                                aria-label="Close"
                                                onClick={() => this.deleteHistoryItem(historyData, 'handshake', item)}
                                            >
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                            <Link style={{'paddingLeft': '13px', color: 'green'}} to={item.link}>{item.text}</Link>
                                            <br/>
                                        </div>
                                    )
                                })}
                            </li>
                            <li className="nav-item">
                                <div className='row mt-2 mb-1' style={{'paddingLeft': '14px'}}>
                                    <div className='mr-2' style={{'paddingLeft': '14px', 'fontSize': '0.9rem'}}>
                                        <i 
                                            className="fa fa-users"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    Customers
                                </div>
                                {historyData && historyData.customers && historyData.customers.map((item) => {
                                    return (
                                        //render as state changes
                                        <div className='nav'>
                                            <button 
                                                type="button" 
                                                style={{'paddingLeft': '14px'}} 
                                                className="close" 
                                                aria-label="Close"
                                                onClick={() => this.deleteHistoryItem(historyData, 'customer', item)}
                                            >
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                            <Link style={{'paddingLeft': '13px', color: 'green'}} to={item.link}>{item.text}</Link>
                                            <br/>
                                        </div>
                                    )
                                })}
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        );
    }
};

export default withRouter(Menu);