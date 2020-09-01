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
import Task from './Task';

class SingleHandshake extends Component {
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

    renderHandshake = handshake => {
        const { assignees, deadline, stage } = this.state;

        return (
            <div>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 border-bottom">
                    <h3 className='display-4 mb-2'>
                        {handshake.title}
                    </h3>
            
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <Link 
                            to={`/${this.companyId}/handshakes`}
                            className="btn btn-raised btn-outline-primary mr-5"
                        >
                            Back to Handshakes
                        </Link>
                        <Link 
                            className="btn btn-raised btn-outline-info mr-5" 
                            to={{
                                pathname: `/${this.companyId}/task/create`,
                                state: {
                                    handshakeId: handshake._id,
                                    customerId: handshake.customer
                                }
                            }}
                        >
                            Create Task
                        </Link>
                        <Link 
                            to={`/${handshake.company}/handshake/edit/${handshake._id}`}
                            className="btn btn-raised btn-outline-info mr-5"
                        >
                            Edit Handshake
                        </Link>
                        <button 
                            className="btn btn-raised btn-outline-danger mr-5"
                            onClick={this.deleteHandshakeConfirmation}
                        >
                            <div style={{'font-size': '0.9rem'}}>
                                <i 
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                />{' '}
                                Delete Handshake
                            </div>
                        </button>
                    </div>
                </div>
                
                <div className='row'>
                    <div className="card-body col-md-8">
                        <h4 className='ml-2'><StageBadge stage={stage} /></h4>
                        <h5 className='ml-2'><b>Due:</b> {deadline}</h5>
                        <StageDropdownMenu
                            onButtonClick={this.setHandshakeStage} 
                        />
                        <br/>
                        <div className='d-inline-block mb-4'>
                            <Link
                                to={`/${this.companyId}/handshake/assign/${handshake._id}`}
                                className="btn btn-raised btn-info mr-4"
                            >
                                Assign To
                            </Link>
                            <Link
                                to={`/${this.companyId}/handshake/unassign/${handshake._id}`}
                                className="btn btn-raised btn-warning mr-4"
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
                        <br/>
                        <h6>
                            <b>Description</b>
                        </h6>
                        <p className="card-text">
                            {handshake.about}
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
                        {this.renderHandshake(handshake)}
                        <Task tasks={tasks} />
                        <Comment 
                            companyId={handshake.company}
                            handshakeId={handshake._id} 
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

export default SingleHandshake;