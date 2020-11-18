import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarContent,
} from 'react-pro-sidebar';


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
        const { history, collapsed, toggled, handleToggleSidebar } = this.props;

        console.log('collapsed: ' + collapsed);
        console.log('collapsed: ' + toggled);

        return (
            <>
                {isAuthenticated() && (
                    // <aside className='main-sidebar sidebar-dark-primary elevation-4' style={{position: 'fixed', height: '100%'}}>
                    //     <a href="index.html" className="brand-link">
                    //         <span className="brand-text font-weight-light">Lim's Realty</span>
                    //     </a>

                    //     <div className="sidebar">
                    //         <nav className="mt-2">
                    //             <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    //                 <li className="nav-item">
                    //                     <Link className="nav-link" style={isActive(history, `/${this.companyId}/dashboard`)} to={`/${this.companyId}/dashboard`}>
                    //                         <div style={{'font-size': '1rem'}}>
                    //                             <i 
                    //                                 className="fa fa-circle-o nav-icon mr-2"
                    //                                 aria-hidden="true"
                    //                             />
                    //                             Dashboard
                    //                         </div>
                    //                     </Link>
                    //                 </li>
                    //                 <li className="nav-item">
                    //                     <Link className="nav-link" style={isActive(history, `/${this.companyId}/customers`)} to={`/${this.companyId}/customers`}>
                    //                         <div style={{'font-size': '1rem'}}>
                    //                             <i 
                    //                                 className="fa fa-users nav-icon mr-2"
                    //                                 aria-hidden="true"
                    //                             />
                    //                             Customers
                    //                         </div>
                    //                     </Link>
                    //                 </li>
                    //                 <li className="nav-item">
                    //                     <Link 
                    //                         className="nav-link" 
                    //                         style={isActive(history, `/${this.companyId}/handshakes`)} 
                    //                         to={{
                    //                             pathname: `/${this.companyId}/handshakes`,
                    //                             // state: {
                    //                             //     func: this.init()
                    //                             // }
                    //                         }}
                    //                     >
                    //                         <div style={{'font-size': '1rem'}}>
                    //                             <i 
                    //                                 className="fa fa-handshake-o nav-icon mr-2"
                    //                                 aria-hidden="true"
                    //                             />
                    //                             Handshakes
                    //                         </div>
                    //                     </Link>
                    //                 </li>
                    //                 <li className="nav-item">
                    //                     <a href="task.html" className="nav-link">
                    //                         <i className="fa fa-file-text-o nav-icon mr-2"></i>
                    //                         <p>My Handshakes</p>
                    //                     </a>
                    //                 </li>
                    //             </ul>
                    //         </nav>
                    //     </div>
                    // </aside>
                    <ProSidebar 
                        className='main-sidebar sidebar-dark-primary elevation-4' 
                        collapsed={collapsed}
                        toggled={toggled}
                        onToggle={handleToggleSidebar}
                    >
                        <SidebarHeader>
                            <a href="index.html" className="brand-link">
                             <span className="brand-text font-weight-light">Lim's Realty</span>
                            </a>
                        </SidebarHeader>

                        <SidebarContent className="nav nav-pills nav-sidebar flex-column">
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
                        
                        </SidebarContent>
                    </ProSidebar>
                )}
            </>
        );
    }
};

export default withRouter(NewMenu);