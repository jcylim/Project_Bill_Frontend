import React, { Component } from 'react';
import { isAuthenticated, saveHistoryToStorage } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import { listUsers } from '../user/apiUser';
import { read, removeCustomer, convertToCustomer } from './apiCustomer';
import { listByCustomer } from '../task/apiTask';
import { listHandshakesByCustomer } from '../handshake/apiHandshake';
import Notes from './Notes';
import AddNote from './AddNote';
import HandshakeTabs from './HandshakeTabs';
import TaskTabs from './TaskTabs';
import RecentHandshakes from './RecentHandshakes';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import NewHandshakeTabs from './NewHandshakeTabs';


const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return {color: "#ff9900", 'text-transform': 'capitalize'}
    } else return {color: "green", 'text-transform': 'capitalize'}
};

class NewSingleCustomer extends Component {
    constructor() {
        super();
        this.state = {
            customer: {},
            isProspect: true,
            comments: [],
            redirectToSignIn: false,
            redirectToCustomers: false,
            error: '',
            employees: [],
            tasks: [],
            handshakes: []
        }
    }

    loadTasks = (companyId, customerId) => {
        const token = isAuthenticated().token;
        listByCustomer(companyId, customerId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ tasks: data });
            }
        });
    };

    loadHandshakes = (companyId, customerId) => {
        const token = isAuthenticated().token;
        listHandshakesByCustomer(companyId, customerId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ handshakes: data });
            }
        });
    };

    loadUsers = companyId => {
        const token = isAuthenticated().token;

        listUsers(companyId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ employees: data });
            }
        })
    };

    init = customerId => {
        const token = isAuthenticated().token;
        const companyId = this.props.match.params.companyId;
        let history = JSON.parse(localStorage.getItem('history'));

        read(companyId, customerId, token)
        .then(data => {
            if(data.error) {
                this.setState({ redirectToSignIn: true });
            } else {
                this.setState({ 
                    customer: data,
                    isProspect: data.isProspect,
                    comments: data.comments 
                });
                this.loadTasks(companyId, data._id);
                this.loadHandshakes(companyId, data._id);
                this.loadUsers(companyId);

                saveHistoryToStorage(history, this.state.customer.name, `/${companyId}/customer/${customerId}`, 'customer');
            }
        })
    };

    componentDidMount() {
        const customerId = this.props.match.params.customerId;
        this.init(customerId);
    }

    componentWillReceiveProps(props) {
        const customerId = props.match.params.customerId;
        this.init(customerId);
    }

    convertCustomer = () => {
        const token = isAuthenticated().token;
        const companyId = this.props.match.params.companyId;
        const customerId = this.props.match.params.customerId;

        convertToCustomer(companyId, customerId, !this.state.isProspect, token)
        .then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                this.setState({ isProspect: !this.state.isProspect });
            }
        });
    };

    removeCustomerSubmit = () => {
        const token = isAuthenticated().token;

        removeCustomer(this.state.customer.company, this.state.customer._id, token)
        .then(data => {
            if (data.error) this.setState({ error: data.error })
            else 
                this.setState({
                    error: '',
                    redirectToCustomers: true
                })
        });
    };

    removeCustomerSubmitConfirmation = () => {
        let answer = window.confirm("Are you sure you want to delete this customer profile?");
        if (answer) {
            this.removeCustomerSubmit();
        }
    };

    updateComments = comments => {
        this.setState({ comments });
    };

    render() {
        const { 
            customer, 
            isProspect,
            comments, 
            redirectToSignIn, 
            redirectToCustomers, 
            employees,
            tasks,
            handshakes 
        } = this.state;

        let handshakesTab = <Tab>Handshakes</Tab>;
        let documentsTab = <Tab>Documents</Tab>;

        if (redirectToSignIn) {
            return <Redirect to="/signin" />
        } else if (redirectToCustomers) {
            return <Redirect to={`/${customer.company}/customers`} />
        }

        if (isProspect) {
            handshakesTab = <Tab disabled>Handshakes</Tab>;
            documentsTab = <Tab disabled>Documents</Tab>;
        }

        return (
            <div className='content-wrapper'>
                <h3 className='display-4 ml-3'>
                    {customer.name}
                </h3>
                <br/>
                <Tabs>
                    <TabList>
                        <Tab>Overview</Tab>
                        {handshakesTab}
                        {documentsTab}
                    </TabList>

                    <TabPanel>
                        <section class="content">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="card card-primary">
                                            <div class="card-header">
                                                <h3 class="card-title">About Customer</h3>
                                                {
                                                    isProspect ? (
                                                        <button onClick={this.convertCustomer} className='btn-success btn-raised float-right'>
                                                            Convert to Customer
                                                        </button>
                                                    ) : (
                                                        <button onClick={this.convertCustomer} className='btn-info btn-raised float-right'>
                                                            Convert back to Prospect
                                                        </button>
                                                    )
                                                }
                                            </div>
                                            <div class="card-body">
                                                <strong><i class="fa fa-clock-o mr-1"></i> Customer Since</strong>
                                                <p class="text-muted">
                                                    {new Date(customer.created).toDateString()}
                                                </p>
                                                <hr/>
                                                <strong><i class="fa fa-clock-o mr-1"></i> Joined On</strong>
                                                <p class="text-muted">{new Date(customer.created).toDateString()}</p>
                                            </div>
                                            <Link className="btn btn-raised btn-outline-success" to={`/${customer.company}/customer/edit/${customer._id}`}>
                                                Edit Customer
                                            </Link>
                                            <ul class="list-group mb-3">
                                                {customer.type === 'Individual' ? (
                                                    <div>
                                                        <li class="list-group-item">
                                                            <b>Type:</b> <a class="float-right">{customer.type}</a>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <b>Email:</b> <a class="float-right">{customer.email}</a>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <b>Address:</b> <a class="float-right">{customer.address}</a>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <b>Cell:</b> <a class="float-right">{customer.cell}</a>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <b>Home:</b> <a class="float-right">{customer.home}</a>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <b>SSN:</b> <a class="float-right">{customer.tin}</a>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <b>Birthday:</b> <a class="float-right">{customer.birthday}</a>
                                                        </li>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <li class="list-group-item">
                                                            <b>Type:</b> <a class="float-right">+123-456-7890</a>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <b>Email:</b> <a class="float-right">{customer.email}</a>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <b>Address:</b> <a class="float-right">{customer.address}</a>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <b>Work:</b> <a class="float-right">{customer.work}</a>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <b>Cell:</b> <a class="float-right">{customer.cell}</a>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <b>TIN:</b> <a class="float-right">{customer.tin}</a>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <b>NAICS:</b> <a class="float-right">{customer.naics}</a>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <b>Industry:</b> <a class="float-right">{customer.industry}</a>
                                                        </li>
                                                    </div>
                                                )}
                                            </ul>
                                        </div>
                                        <Notes 
                                            companyId={customer.company}
                                            customerId={customer._id} 
                                            comments={comments.reverse()} 
                                            updateComments={this.updateComments}
                                        />
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card card-default">
                                            <div class="card-header">
                                                <h3 class="card-title">Recently Added Files</h3>
                                                <a href="#" class="float-right">+ Add Document</a>
                                            </div>
                                            <div class="card-body">
                                                <strong><i class="fas fa-clip mr-1"></i> New Document</strong>
                                                <p class="text-muted">
                                                    John Doe Added this 5 hours ago
                                                </p>
                                                <hr/>
                                                <strong><i class="fa fa-clock mr-1"></i> New Document</strong>
                                                <p class="text-muted">John Doe Added this 5 hours ago</p>
                                            </div>
                                        </div>
                                        <div class="card card-default">
                                            <div class="card-header">
                                                <h3 class="card-title">Recent Handshakes</h3>
                                                <Link 
                                                    className="float-right" 
                                                    to={{
                                                        pathname: `/${customer.company}/handshake/create`,
                                                        state: {
                                                            customerId: customer._id
                                                        }
                                                    }}
                                                >
                                                    + Add Handshake
                                                </Link>
                                            </div>
                                            <RecentHandshakes handshakes={handshakes}/>
                                        </div>
                                        <AddNote 
                                            companyId={customer.company}
                                            customerId={customer._id} 
                                            employees={employees} 
                                            updateComments={this.updateComments}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </TabPanel>

                    <TabPanel>
                        <section class="content">
                            <div class="container-fluid">
                                <NewHandshakeTabs handshakes={handshakes}/>
                            </div>
                        </section>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}

export default NewSingleCustomer;