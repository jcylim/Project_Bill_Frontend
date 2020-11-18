import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isAuthenticated } from '../auth';

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return {
            color: "white", 
            'text-transform': 'capitalize',
            'border-left': '5px solid #5FAEE3',
            'border-radius': 0
        }
    } else return {'text-transform': 'capitalize'}
};

class NewMenu extends Component {
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
            <div>
                {isAuthenticated() && (
                    <aside className='main-sidebar sidebar-dark-primary elevation-4' style={{position: 'fixed', height: '100%'}} id="workflowNavBar">
                        <a href="index.html" className="brand-link">
                            <span className="brand-text font-weight-light">Lim's Realty</span>
                        </a>

                        <div className="sidebar">
                            <nav className="mt-2">
                                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                    <li className="nav-item">
                                        <Link className="nav-link" style={isActive(history, `/${this.companyId}/dashboard`)} to={`/${this.companyId}/dashboard`}>
                                            <div style={{'font-size': '1rem'}}>
                                                <i 
                                                    className="fa fa-circle-o nav-icon mr-2"
                                                    aria-hidden="true"
                                                />
                                                Dashboard
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" style={isActive(history, `/${this.companyId}/customers`)} to={`/${this.companyId}/customers`}>
                                            <div style={{'font-size': '1rem'}}>
                                                <i 
                                                    className="fa fa-users nav-icon mr-2"
                                                    aria-hidden="true"
                                                />
                                                Customers
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
                                            <div style={{'font-size': '1rem'}}>
                                                <i 
                                                    className="fa fa-handshake-o nav-icon mr-2"
                                                    aria-hidden="true"
                                                />
                                                Handshakes
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <a href="task.html" className="nav-link">
                                            <i className="fa fa-file-text-o nav-icon mr-2"></i>
                                            <p>My Handshakes</p>
                                        </a>
                                    </li>
                                    {/* <h6 className="sidebar-heading d-flex align-items-center px-3 mt-4 mb-2">
                                        <div>
                                            <span style={{'font-size': '1rem', 'color': 'white'}}>Recently Viewed</span>
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
                                            {historyData.handshakes && historyData.handshakes.map((item) => {
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
                                            {historyData.customers && historyData.customers.map((item) => {
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
                                    </ul> */}
                                </ul>
                            </nav>
                        </div>
                    </aside>
                )}
            </div>
        );
    }
};

export default withRouter(NewMenu);