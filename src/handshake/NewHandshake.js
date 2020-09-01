import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { addHandshake } from './apiHandshake';
import { listCustomers } from '../customer/apiCustomer';
import { listUsers } from '../user/apiUser';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';
import UserDropdownMenu from './UserDropdownMenu';
 
class NewHandshake extends Component {
    constructor() {
        super()
        this.state = {
            title: '',
            about: '',
            deadline: '',
            user: {},
            users: [],
            assignedTo: '',
            customerId: {},
            customers: [],
            assigned: false,
            redirectToHandshakes: false,
            error: '',
            loading: false
        }
    }

    loadCustomers = token => {
        listCustomers(this.companyId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ customers: data });
            }
        })
    };

    loadUsers = token => {
        listUsers(this.companyId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ users: data });
            }
        })
    };

    componentDidMount() {
        const token = isAuthenticated().token
        const user = isAuthenticated().user;
        this.companyId = this.props.match.params.companyId;
        if (this.props.location.state) {
            this.customerId = this.props.location.state.customerId;
        }

        if (user) {
            this.setState({ user });
        }
        this.loadCustomers(token);
        this.loadUsers(token);
    }

    isValid = () => {
        const { title, about, deadline, customer } = this.state;
        if (title.length === 0 || about.length === 0 || deadline.length === 0) {
            this.setState({error: "All fields are required", loading: false});
            return false;
        } else if (!customer) {
            if (this.props.location.state) {
                return true;
            }
            this.setState({error: "Select what company this handshake is for", loading: false});
            return false;
        }
        return true; 
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const { title, about, deadline, assignedTo, customer } = this.state;
        const token = isAuthenticated().token;

        if (this.isValid()) {
            const handshake = {
                title,
                about,
                deadline,
                userId: assignedTo && assignedTo._id,
                customerId: customer ? customer._id : this.customerId
            };

            addHandshake(this.companyId, token, handshake)
            .then(data => {
                if (data.error) {
                    this.setState({error: data.error, loading: false});
                } else {
                    this.setState({
                        loading: false, 
                        title: '', 
                        about: '',
                        deadline: '',
                        assignedTo: '',
                        redirectToHandshakes: true
                    });
                }
            });
        }
    };

    onButtonClick = customer => {
        this.setState({ customer });
    };

    onAssignClick = user => {
        this.setState({ assignedTo: user });
    };

    assignToMeClick = e => {
        e.preventDefault();
        this.setState({ assigned: true, assignedTo: this.state.user });
    };

    unassignToMeClick = e => {
        e.preventDefault();
        this.setState({ assigned: !this.state.assigned, assignedTo: '' });
    };

    handlerChange = field => event => {
        this.setState({ error: '' });
        this.setState({ [field]: event.target.value });
    };

    newHandshakeForm = (title, about, deadline, user, users, customers) => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Title</label>
                <input 
                    onChange={this.handlerChange('title')} 
                    type='text' 
                    className='form-control'
                    value={title}
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>About</label>
                <textarea 
                    onChange={this.handlerChange('about')} 
                    type='text' 
                    className='form-control'
                    value={about}
                />
            </div>
            <div className='row'>
                <div className='form-group col-md-2'>
                    <label className='text-muted'>Due Date</label>
                    <input 
                        onChange={this.handlerChange('deadline')} 
                        type='date' 
                        className='form-control'
                        value={deadline}
                    />
                </div>
                <div className='d-inline-block mb-4'>
                    <UserDropdownMenu users={users} onAssignClick={this.onAssignClick} />
                    {user && (
                        <div className='d-inline-block'>
                            {
                                !this.state.assigned ? (
                                    <button onClick={this.assignToMeClick} className='btn btn-success btn-raised mr-5'>
                                        Assign to me
                                    </button>
                                ) : (
                                    <button onClick={this.unassignToMeClick} className='btn btn-danger btn-raised'>
                                        Unassign
                                    </button>
                                )
                            }
                        </div>
                    )}
                </div>
            </div>
            {!this.customerId && (
                <div className="form-group">
                    <button type='button' className="btn btn-secondary dropdown-toggle " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Select Company
                    </button>
                    <div className="dropdown-menu">
                        {customers.map((customer, i) => (
                            <a className="dropdown-item" onClick={() => {this.onButtonClick(customer)}}>{customer.name}</a>
                        ))}
                    </div>
                </div>
            )}
            <button 
                onClick={this.clickSubmit}
                className='btn btn-raised btn-primary'>
                Create
            </button>
        </form>
    );

    render() {
        const { 
            title, 
            about,
            deadline,
            user,
            users,
            assignedTo,
            customer,
            customers,
            redirectToHandshakes,
            error,
            loading 
        } = this.state;

        if (redirectToHandshakes) {
            return <Redirect to={`/${this.companyId}/handshakes`} />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-4">Create New Handshake</h2>
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>
                {customer && (
                    <p className='mb-3'>Company Selected: {customer.name}</p>
                )}
                {assignedTo && (
                    <p className='mb-3'>Assigned To: {assignedTo.first_name} {assignedTo.last_name}</p>
                )}

                <Loading loading={loading} />

                { this.newHandshakeForm(title, about, deadline, user, users, customers) }
            </div>
        );
    }
}

export default NewHandshake;