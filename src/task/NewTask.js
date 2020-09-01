import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { adminCreate, create } from './apiTask';
import { listUsers } from '../user/apiUser';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';
import UserDropdownMenu from './UserDropdownMenu';
 

class NewTask extends Component {
    constructor() {
        super()
        this.state = {
            title: '',
            about: '',
            deadline: '',
            assignedTo: '',
            users: [],
            assigned: false,
            redirectToHandshake: false,
            error: '',
            loading: false
        }
    }

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
        this.companyId = this.props.match.params.companyId;
        const token = isAuthenticated().token;

        if (this.props.location.state) {
            this.customerId = this.props.location.state.customerId;
            this.handshakeId = this.props.location.state.handshakeId;
        }

        this.loadUsers(token);
    }

    isValid = () => {
        const { title, about, deadline } = this.state;
        if (title.length === 0 || about.length === 0 || deadline.length === 0) {
            this.setState({error: "All fields are required", loading: false});
            return false;
        }
        return true; 
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const { title, about, deadline, assignedTo } = this.state;
        const token = isAuthenticated().token;

        if (this.isValid()) {
            const task = {
                title,
                about,
                deadline,
                customerId: this.customerId,
                handshakeId: this.handshakeId,
                userId: assignedTo && assignedTo._id
            };

            if (isAuthenticated().company) {
                adminCreate(this.companyId, token, task)
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
                            redirectToHandshake: true
                        });
                    }
                });
            } else {
                const userId = isAuthenticated().user._id;

                create(this.companyId, userId, token, task)
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
                            redirectToHandshake: true
                        });
                    }
                });
            }
        }
    };

    handlerChange = field => event => {
        this.setState({ error: '' });
        this.setState({ [field]: event.target.value });
    };

    onAssignClick = user => {
        this.setState({ assignedTo: user });
    };

    assignToMeClick = e => {
        e.preventDefault();
        this.setState({ assigned: true, assignedTo: isAuthenticated().user });
    };

    unassignToMeClick = e => {
        e.preventDefault();
        this.setState({ assigned: !this.state.assigned, assignedTo: '' });
    };

    newTaskForm = (title, about, deadline, users) => (
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
                    <label className='text-muted'>Deadline</label>
                    <input 
                        onChange={this.handlerChange('deadline')} 
                        type='date' 
                        className='form-control'
                        value={deadline}
                    />
                </div>
                <div className='d-inline-block mb-4'>
                    <UserDropdownMenu users={users} onAssignClick={this.onAssignClick} />
                    {isAuthenticated().user && (
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
            assignedTo,
            users,
            redirectToHandshake,
            error,
            loading 
        } = this.state;

        if (redirectToHandshake) {
            return <Redirect to={`/${this.companyId}/handshake/${this.handshakeId}`} />;
        }

        return (
            <div className="container">
                {this.props.location.state ? (
                    <>
                        <h2 className="mt-5 mb-4">Create New Task</h2>
                        <div 
                            className='alert alert-danger'
                            style={{ display: error ? '' : 'none'}}
                        >
                            {error}
                        </div>
                        {assignedTo && (
                            <p className='mb-3'>Assigned To: {assignedTo.first_name} {assignedTo.last_name}</p>
                        )}
        
                        <Loading loading={loading} />
        
                        { this.newTaskForm(title, about, deadline, users) }
                    </>
                ) : (
                    <h2 className="mt-5 mb-4">Must create task through handshake page</h2>
                )}
            </div>
        );
    }
}

export default NewTask;