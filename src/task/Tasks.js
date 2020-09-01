import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { list } from './apiTask';
import { isAuthenticated } from '../auth';
import DefaultProfile from '../img/avatar.png';
import StageBadge from "./StageBadge";

class Tasks extends Component {
    constructor() {
        super();
        this.state = {
            tasks: []
        }
    }

    componentDidMount() {
        this.companyId = this.props.companyId;
        this.setState({ loading: true });

        list(this.companyId, isAuthenticated().token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ tasks: data, loading: false });
            }
        })
    }

    renderTasks = tasks => {
        return (
            <div className="row">
                {tasks.map((task, i) => {
                    let posterId = '';
                    if (isAuthenticated().company) {
                        posterId = task.postedBy ? 
                        `/${this.companyId}/employee/${task.postedBy._id}` : 
                        `/${this.companyId}/profile`;
                    } else {
                        posterId = task.postedBy ? 
                        `/${this.companyId}/employee/${task.postedBy._id}` : 
                        `/${this.companyId}/dashboard`;
                    }
                    const posterName = task.postedBy ? 
                    task.postedBy.first_name + " " + task.postedBy.last_name : 
                    'Admin';

                    return (
                        <div className="card col-md-4" style={{width: "18rem"}} key={i}>
                            <div className="card-body">
                                <h5 className="card-title">{task.title}</h5>
                                <br/>
                                <p className='font-italic'>
                                    Created by{' '} 
                                    <Link to={`${posterId}`}>
                                        {posterName}
                                    </Link>
                                    {' '}on {new Date(task.created).toDateString()}
                                </p>
                                
                                <h5>
                                    <StageBadge stage={task.stage} />
                                </h5>
                                <p className='card-text'>
                                    <b>Assignee(s):</b>
                                    {task.assignedTo && task.assignedTo.map((user, i) => (
                                        <div key={i}>
                                            <div>
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
                                                    <div>
                                                        <p className='lead'>{user.first_name} {user.last_name}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </p>
                                <h5 className='mb-5'>
                                    <i 
                                        className='fa fa-comment text-info'
                                    />{' '}
                                    {task.comments ? task.comments.length : 0}
                                </h5>
                                <Link 
                                    to={`/${this.companyId}/task/${task._id}`}
                                    className="btn btn-raised btn-primary btn-sm"
                                >
                                    Expand
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        const { tasks } = this.state;
        return (
            <div className="container">
                {tasks.length === 0 ? (
                    <h3 className="mt-5 mb-5">
                        No tasks created yet. Please{""} <Link to={`/${this.companyId}/task/create`}>create task</Link>.
                    </h3>
                ) : (
                    <h3 className="mt-5 mb-5">
                        {!tasks.length ? 'Loading...' : 'Tasks'}
                    </h3>
                )}

                {this.renderTasks(tasks)}
            </div>
        );
    }
}

export default Tasks;