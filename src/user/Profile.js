import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import { read, removeUser } from './apiUser';
import { list, listByUser } from '../task/apiTask';
import { listHandshakes } from '../handshake/apiHandshake';
import ProfileTabs from './ProfileTabs';
import DefaultProfile from '../img/avatar.png';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: {},
            redirectToSignIn: false,
            redirectToDashboard: false,
            error: '',
            tasks: [],
            allTasks: [],
            handshakes: []
        }
    }

    loadHandshakes = companyId => {
        const token = isAuthenticated().token;

        listHandshakes(companyId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ handshakes: data, loading: false });
            }
        })
    };

    loadTasks = (companyId, userId) => {
        const token = isAuthenticated().token;

        listByUser(companyId, userId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ tasks: data });
            }
        });

        list(companyId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ allTasks: data, loading: false });
            }
        })
    };

    init = userId => {
        const token = isAuthenticated().token;
        const companyId = this.props.match.params.companyId;

        read(companyId, userId, token)
        .then(data => {
            if(data.error) {
                this.setState({ redirectToSignIn: true });
            } else {
                this.setState({ user: data });
                this.loadTasks(companyId, data._id);
                this.loadHandshakes(companyId);
            }
        })
    };

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
    }

    clickRemoveSubmit = () => {
        const token = isAuthenticated().token;

        removeUser(this.state.user.company, this.state.user._id, token)
        .then(data => {
            if (data.error) this.setState({ error: data.error })
            else 
                this.setState({
                    error: '',
                    redirectToDashboard: true
                })
        });
    };

    clickRemoveSubmitConfirmation = () => {
        let answer = window.confirm("Are you sure you want to delete this employee?");
        if (answer) {
            this.clickRemoveSubmit();
        }
    };

    render() {
        const { user, redirectToSignIn, redirectToDashboard, tasks, allTasks, handshakes } = this.state;
        if (redirectToSignIn) {
            return <Redirect to="/signin" />
        } else if (redirectToDashboard) {
            return <Redirect to={`/${user.company}/dashboard`} />
        }

        const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/${user.company}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile;

        return (
            <div className="container">
                <h2 className='mt-5 mb-5'>Profile</h2>
                <div className="row">
                    <div className="col-md-4">
                        <img 
                            src={photoUrl}
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            alt={user.email} 
                            style={{height: '200px', width: 'auto'}}
                            className='img-thumbnail'
                        />
                    </div>

                    <div className="col-md-8">
                        <div className="lead mt-2">
                            <p>Hello {user.first_name} {user.last_name}!</p>
                            <p>Title: {user.title}</p>
                            <p>Email: {user.email}</p>
                            <p>Joined since {new Date(user.created).toDateString()}</p>
                        </div>
                        {isAuthenticated().user && 
                         isAuthenticated().user._id === user._id && (
                            <div className="d-inline-block">
                                <Link className="btn btn-raised btn-success mr-5" to={`/${user.company}/employee/edit/${user._id}`}>
                                    Edit Profile
                                </Link>
                            </div>
                        )}
                        {isAuthenticated().company && (
                            <div className="d-inline-block">
                                <Link className="btn btn-raised btn-success mr-5" to={`/${user.company}/employee/edit/${user._id}`}>
                                    Edit Profile
                                </Link>
                                <button 
                                    className="btn btn-raised btn-danger mr-5"
                                    onClick={this.clickRemoveSubmitConfirmation}
                                >
                                    Remove Employee
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col md-12 mt-5 mb-3">
                        <ProfileTabs 
                            handshakes={handshakes}
                            tasks={tasks}
                            allTasks={allTasks}
                            user={user._id}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;