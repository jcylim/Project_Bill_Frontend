import React, { Component } from 'react';
import { singleHandshake, remove, unassign, setStage } from './apiHandshake';
import { listByHandshake } from '../task/apiTask';
import { listUsers } from '../user/apiUser';
import { isAuthenticated, saveHistoryToStorage } from '../auth';
import { Link, Redirect } from 'react-router-dom';
import DefaultProfile from '../img/avatar.png';
import AssignHandshakeButton from "./AssignHandshakeButton";
import StageDropdownMenu from "./StageDropdownMenu";
import StageBadge from "./StageBadge";
import Comment from './Comment';
import AddComment from './AddComment';
import Comments from './Comments';
import Task from './Task';

class NewSingleHandshake extends Component {
    state = {
        handshake: '',
        deadline: '',
        assignees: [],
        stage: '',
        redirectToHome: false,
        tasks: [],
        employees: [],
        comments: [],
        assigned: false,
        redirectToSignin: false,
        loading: false
    }

    loadTasks = token => {
        listByHandshake(this.companyId, this.handshakeId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ tasks: data, loading: false });
            }
        })
    };

    loadUsers = token => {
        listUsers(this.companyId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ employees: data });
            }
        })
    };

    init = token => {
        let history = JSON.parse(localStorage.getItem('history'));

        singleHandshake(this.companyId, this.handshakeId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                let assigned = isAuthenticated().user ? this.checkAssign(data) : false;
                this.setState({ 
                    handshake: data,
                    stage: data.stage,
                    deadline: data.deadline,
                    assignees: data.assignedTo,
                    assigned,
                    comments: data.comments,
                    loading: false
                });
                saveHistoryToStorage(history, this.state.handshake.title, `/${this.companyId}/handshake/${this.handshakeId}`, 'handshake');
            }
        })
    };

    componentDidMount = () => {
        this.companyId = this.props.match.params.companyId;
        this.handshakeId = this.props.match.params.handshakeId;
        const token = isAuthenticated().token;
        this.setState({ loading: true });

        this.init(token);
        this.loadTasks(token);
        this.loadUsers(token);
    };
    
    setHandshakeStage = stage => {
        const token = isAuthenticated().token;

        setStage(this.companyId, this.handshakeId, stage, token).then(data => {
        if (data.error) {
            this.setState({ error: data.error });
        } else {
            this.setState({ stage: data.stage });
        }
        });
    };

    // check assign
    checkAssign = handshake => {
        const jwt = isAuthenticated();
        const match = handshake.assignedTo.find(user => {
        return user._id === jwt.user._id;
        });
        return match;
    };

    clickAssignButton = callApi => {
        const email = isAuthenticated().user.email;
        const token = isAuthenticated().token;

        callApi(this.companyId, this.handshakeId, email, token).then(data => {
        if (data.error) {
            this.setState({ error: data.error });
        } else {
            this.setState({ 
                assignees: data.result.assignedTo,
                assigned: !this.state.assigned 
            });
        }
        });
    };

    unassignUser = email => {
        const token = isAuthenticated().token;

        unassign(this.companyId, this.handshakeId, email, token).then(data => {
        if (data.error) {
            this.setState({ error: data.error });
        }});
    };

    deleteHandshake = () => {
        remove(this.companyId, this.handshakeId, isAuthenticated().token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ redirectToHome: true });
            }
        });
    };

    deleteHandshakeConfirmation = () => {
        let answer = window.confirm("Are you sure you want to delete this handshake?");
        if (answer) {
            this.deleteHandshake();
        }
    };

    updateComments = comments => {
        this.setState({ comments });
    };

    renderHandshake = (handshake, comments, employees) => {
        const { assignees, deadline, stage } = this.state;

        return (
            <div className='content-wrapper'>
                <div>
                    <h1 className='ml-3'>
                        {handshake.title}{' '}
                        <StageBadge stage={stage} />
                    </h1>
                </div>
                <br/>
                <section class="content">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="card card-primary">
                                    <div class="card-header">
                                        <h3 class="card-title">About Handshake</h3>
                                    </div>
                                    <div class="card-body">
                                        <strong><i class="fa fa-clock-o mr-1"></i> Handshake Created On</strong>
                                        <p class="text-muted">
                                            {new Date(handshake.created).toDateString()}
                                        </p>
                                        <hr/>
                                        <strong><i class="fa fa-clock-o mr-1"></i> Due On</strong>
                                        <hr/>
                                        <p class="text-muted">{deadline}</p>
                                        <h6>
                                            <b>Description</b>
                                        </h6>
                                        <p className="card-text">
                                            {handshake.about}
                                        </p>
                                    </div>
                                    <Link className="btn btn-raised btn-outline-success" to={`/${handshake.company}/handshake/edit/${handshake._id}`}>
                                        Edit Handshake
                                    </Link>
                                    
                                </div>
                                <Comments 
                                    companyId={handshake.company}
                                    customerId={handshake.customer} 
                                    comments={comments.reverse()} 
                                    updateComments={this.updateComments}
                                />
                            </div>
                            <div class="col-md-8">
                                <div className='row container-fluid'>
                                    <div className='col-md-8'>
                                        <div class="card card-info">
                                            <div class="card-header">
                                                <h3 class="card-title">Actions</h3>
                                            </div>
                                            <StageDropdownMenu
                                                onButtonClick={this.setHandshakeStage} 
                                            />
                                            <br/>
                                            <div className='mb-3' style={{'text-align': 'center'}}>
                                                <Link
                                                    to={`/${this.companyId}/handshake/assign/${handshake._id}`}
                                                    className="btn btn-raised btn-info mr-5"
                                                >
                                                    Assign To
                                                </Link>
                                                <Link
                                                    to={`/${this.companyId}/handshake/unassign/${handshake._id}`}
                                                    className="btn btn-raised btn-warning mr-5"
                                                >
                                                    Remove Assignee
                                                </Link>
                                                {isAuthenticated().user && (
                                                    <AssignHandshakeButton
                                                        assigned={this.state.assigned}
                                                        onButtonClick={this.clickAssignButton}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card card-default col-md-4">
                                        <div class="card-header">
                                            <h3 class="card-title">Assignee(s)</h3>
                                        </div>
                                        <div class="card-body">
                                            {assignees && assignees.map((user, i) => (
                                                <div key={i}>
                                                    <>
                                                        <Link to={`/${user.company}/employee/${user._id}`}>
                                                            <img
                                                                className='float-left mr-2'
                                                                height='30px'
                                                                width='30px'
                                                                style={{borderRadius: '50%', border: '1px solid black'}}
                                                                src={`${process.env.REACT_APP_API_URL}/${user.company}/user/photo/${user._id}`}
                                                                alt={user.first_name}
                                                                onError={i => (i.target.src = `${DefaultProfile}`)}
                                                            />
                                                            <p className='lead'>{user.first_name} {user.last_name}</p>
                                                        </Link>
                                                    </>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <AddComment 
                                    companyId={handshake.company}
                                    customerId={handshake.customer} 
                                    employees={employees} 
                                    updateComments={this.updateComments}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    };

    render() {
        const { 
            handshake,
            tasks,
            employees,
            comments,
            redirectToHome, 
            redirectToSignin, 
            loading 
        } = this.state;
        if (redirectToHome) {
            return <Redirect to={`/${handshake.company}/dashboard`} />;
        } else if (redirectToSignin) {
            return <Redirect to="/signin" />;
        }
        
        return (
            <div>
                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    <>
                        {this.renderHandshake(handshake, comments, employees)}
                    </>
                )}
            </div>
        );
    }
}

export default NewSingleHandshake;