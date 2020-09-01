import React, { Component } from 'react';
import { isAuthenticated, saveHistoryToStorage } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import { listUsers } from '../user/apiUser';
import { read, removeCustomer } from './apiCustomer';
import { listByCustomer } from '../task/apiTask';
import { listHandshakesByCustomer } from '../handshake/apiHandshake';
import Comment from './Comment';
import HandshakeTabs from './HandshakeTabs';
import TaskTabs from './TaskTabs';


const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return {color: "#ff9900", 'text-transform': 'capitalize'}
    } else return {color: "green", 'text-transform': 'capitalize'}
};

class SingleCustomer extends Component {
    constructor() {
        super();
        this.state = {
            customer: {},
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
            comments, 
            redirectToSignIn, 
            redirectToCustomers, 
            employees,
            tasks,
            handshakes 
        } = this.state;
        if (redirectToSignIn) {
            return <Redirect to="/signin" />
        } else if (redirectToCustomers) {
            return <Redirect to={`/${customer.company}/customers`} />
        }

        return (
            <div>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 border-bottom">
                    <h3 className='display-4 mb-2'>
                        {customer.name}
                    </h3>
            
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <Link 
                            to={`/${customer.company}/customers`}
                            className="btn btn-raised btn-outline-info mr-5"
                        >
                            Back to Customers
                        </Link>
                        <Link 
                            className="btn btn-raised btn-outline-info mr-5" 
                            to={{
                                pathname: `/${customer.company}/handshake/create`,
                                state: {
                                    customerId: customer._id
                                }
                            }}
                        >
                            Create Handshake
                        </Link>
                        <div className="d-inline-block">
                            <Link className="btn btn-raised btn-outline-success mr-5" to={`/${customer.company}/customer/edit/${customer._id}`}>
                                Edit Customer
                            </Link>
                        </div>
                        {isAuthenticated().company && (
                            <div className="d-inline-block">
                                <button 
                                    className="btn btn-raised btn-outline-danger mr-5"
                                    onClick={this.removeCustomerSubmitConfirmation}
                                >
                                    Remove Customer Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-7">
                        {customer.type === 'Individual' ? (
                            <div className="lead mt-3 mb-5">
                                <p><b>Type:</b> {customer.type}</p>
                                <p><b>Email:</b> {customer.email}</p>
                                <p><b>Address:</b> {customer.address}</p>
                                <p><b>Cell:</b> {customer.cell}</p>
                                <p><b>Home:</b> {customer.handshakes}</p>
                                <p><b>SSN:</b> {customer.tin}</p>
                                <p><b>Birthday:</b> {customer.birthday}</p>
                                <p>Joined since {new Date(customer.created).toDateString()}</p>
                            </div>
                        ) : (
                            <div className="lead mt-3 mb-5">
                                <p><b>Type:</b> {customer.type}</p>
                                <p><b>Email:</b> {customer.email}</p>
                                <p><b>Address:</b> {customer.address}</p>
                                <p><b>Work:</b> {customer.work}</p>
                                <p><b>Cell:</b> {customer.cell}</p>
                                <p><b>TIN:</b> {customer.tin}</p>
                                <p><b>NAICS Code:</b> {customer.naics}</p>
                                <p><b>Industry:</b> {customer.industry}</p>
                                <p>Joined since {new Date(customer.created).toDateString()}</p>
                            </div>
                        )}
                    </div>
                    <div className='col-md-4'>
                        <Comment 
                            companyId={customer.company}
                            customerId={customer._id} 
                            comments={comments.reverse()} 
                            updateComments={this.updateComments}
                            employees={employees}
                        />
                    </div>
                </div>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="handshakes-tab" data-toggle="tab" href="#handshakes" role="tab" aria-controls="handshakes" aria-selected="true">Handshakes</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="tasks-tab" data-toggle="tab" href="#tasks" role="tab" aria-controls="tasks" aria-selected="false">Tasks</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="documents-tab" data-toggle="tab" href="#documents" role="tab" aria-controls="documents" aria-selected="false">Documents</a>
                    </li>
                </ul>
                <hr/>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="handshakes" role="tabpanel" aria-labelledby="handshakes-tab">
                        <HandshakeTabs handshakes={handshakes} />
                    </div>
                    <div className="tab-pane fade" id="tasks" role="tabpanel" aria-labelledby="tasks-tab">
                        <TaskTabs tasks={tasks} />
                    </div>
                    <div className="tab-pane fade" id="documents" role="tabpanel" aria-labelledby="documents-tab">documents</div>
                </div>
            </div>
        );
    }
}

export default SingleCustomer;