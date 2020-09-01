import React, { Component } from 'react';
import { singleTask, remove, unassign, setStage } from './apiTask';
import { listUsers } from '../user/apiUser';
import { isAuthenticated } from '../auth';
import { Link, Redirect } from 'react-router-dom';
import DefaultProfile from '../img/avatar.png';
import AssignTaskButton from "./AssignTaskButton";
import StageDropdownMenu from "./StageDropdownMenu";
import StageBadge from "./StageBadge";
import Comment from './Comment';

class SingleTask extends Component {
    state = {
        task: '',
        employees: [],
        assignees: [],
        stage: '',
        redirectToHandshake: false,
        comments: [],
        assigned: false,
        redirectToSignin: false,
        loading: false
    }

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
        singleTask(this.companyId, this.taskId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                let assigned = isAuthenticated().user ? this.checkAssign(data) : false;
                this.setState({ 
                    task: data,
                    stage: data.stage,
                    assignees: data.assignedTo,
                    assigned,
                    comments: data.comments,
                    loading: false
                });
            }
        })
    };

    componentDidMount = () => {
        this.companyId = this.props.match.params.companyId;
        this.taskId = this.props.match.params.taskId;
        const token = isAuthenticated().token;
        this.setState({ loading: true });

        this.init(token);
        this.loadUsers(token);
    };
    
    setTaskStage = stage => {
        const token = isAuthenticated().token;

        setStage(this.companyId, this.taskId, stage, token).then(data => {
        if (data.error) {
            this.setState({ error: data.error });
        } else {
            this.setState({ stage: data.stage });
        }
        });
    };

    // check assign
    checkAssign = task => {
        const jwt = isAuthenticated();
        const match = task.assignedTo.find(user => {
        return user._id === jwt.user._id;
        });
        return match;
    };

    clickAssignButton = callApi => {
        const email = isAuthenticated().user.email;
        const token = isAuthenticated().token;

        callApi(this.companyId, this.taskId, email, token).then(data => {
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

        unassign(this.companyId, this.taskId, email, token).then(data => {
        if (data.error) {
            this.setState({ error: data.error });
        }});
    };

    deleteTask = () => {
        remove(this.companyId, this.state.task._id, isAuthenticated().token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ redirectToHandshake: true });
            }
        });
    };

    deleteTaskConfirmation = () => {
        let answer = window.confirm("Are you sure you want to delete this task?");
        if (answer) {
            this.deleteTask();
        }
    };

    updateComments = comments => {
        this.setState({ comments });
    };

    renderTask = task => {
        let posterId = '';
        if (isAuthenticated().company) {
            posterId = `/${this.companyId}/profile`;
        } else {
            posterId = task.postedBy ? 
            `/${this.companyId}/employee/${task.postedBy._id}` : 
            `/${this.companyId}/dashboard`;
        }
        const posterName = task.postedBy ? 
        task.postedBy.first_name + " " + task.postedBy.last_name : 'Admin';
        const userId = task.postedBy ? `${task.postedBy._id}` : '';
        const { assignees, stage } = this.state;

        return (
            <div>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 border-bottom">
                    <h3 className='display-4 mb-2'>
                        {task.title}
                    </h3>
            
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <Link 
                            to={`/${this.companyId}/handshake/${task.handshake}`}
                            className="btn btn-raised btn-outline-primary mr-5"
                        >
                            Back to Handshake
                        </Link>
                        {isAuthenticated().company && (
                            <>  
                                <Link 
                                    to={`/${task.company}/task/edit/${task._id}`}
                                    className="btn btn-raised btn-outline-info mr-5"
                                >
                                    Edit Task
                                </Link>
                                <button 
                                    className="btn btn-raised btn-outline-danger"
                                    onClick={this.deleteTaskConfirmation}
                                >
                                    Delete Task
                                </button>
                            </>
                        )}
                        {isAuthenticated().user && 
                        isAuthenticated().user._id === userId && (
                            <>  
                                <Link 
                                    to={`/${task.company}/task/edit/${task._id}`}
                                    className="btn btn-raised btn-outline-info mr-5"
                                >
                                    Edit Task
                                </Link>
                                <button 
                                    className="btn btn-raised btn-outline-danger mr-5"
                                    onClick={this.deleteTaskConfirmation}
                                >
                                    Delete Task
                                </button>
                            </>
                        )}
                    </div>
                </div>
                
                <div className='row'>
                    <div className="card-body col-md-8">
                        <p className='font-italic mb-4'>
                            Created by{' '} 
                            <Link to={`${posterId}`}>
                                {posterName}
                            </Link>
                            {' '}on {new Date(task.created).toDateString()}
                        </p>
                        <h4 className='ml-2'><StageBadge stage={stage} /></h4>
                        <StageDropdownMenu
                            onButtonClick={this.setTaskStage} 
                        />
                        <br/>
                        <div className='d-inline-block mb-4'>
                            <Link
                                to={`/${this.companyId}/task/assign/${task._id}`}
                                className="btn btn-raised btn-info mr-5"
                            >
                                Assign To
                            </Link>
                            <Link
                                to={`/${this.companyId}/task/unassign/${task._id}`}
                                className="btn btn-raised btn-warning mr-5"
                            >
                                Remove Assignee
                            </Link>
                            {isAuthenticated().user && (
                                <AssignTaskButton
                                    assigned={this.state.assigned}
                                    onButtonClick={this.clickAssignButton}
                                />
                            )}
                        </div>
                        <br/>
                        <h6>
                            <b>Description</b>
                        </h6>
                        <p className="card-text">
                            {task.about}
                        </p>
                    </div>
                    <div className='mt-3 col-md-3'>
                        <h4 className='text-primary'>Assignee(s)</h4>
                        <hr/>
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
        );
    };

    render() {
        const { 
            task,
            employees,
            comments,
            redirectToHandshake, 
            redirectToSignin, 
            loading 
        } = this.state;
        if (redirectToHandshake) {
            return <Redirect to={`/${task.company}/handshake/${task.handshake}`} />;
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
                        {this.renderTask(task)}
                        <Comment 
                            companyId={task.company}
                            taskId={task._id} 
                            comments={comments.reverse()} 
                            updateComments={this.updateComments}
                            employees={employees}
                        />
                    </>
                )}
            </div>
        );
    }
}

export default SingleTask;