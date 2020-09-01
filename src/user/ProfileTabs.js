import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class ProfileTabs extends Component {
    render() {
        const {
            handshakes, 
            tasks, 
            allTasks, 
            user 
        } = this.props;
        let assignedHandshake = handshakes.filter(handshake => handshake.assignedTo.some(a => a._id === user));
        let assignedTask = allTasks.filter(task => task.assignedTo.some(a => a._id === user));

        return (
            <div>
                <div className='row'>
                    <div className='col-md-12'>
                        <h4 className='text-primary'>Handshakes Assigned ({assignedHandshake.length})</h4>
                        <hr/>
                        {assignedHandshake.map((handshake, i) => (
                            <div key={i}>
                                <div>
                                    <Link to={`/${handshake.company}/handshake/${handshake._id}`}>
                                        <div>
                                            <p className='lead'>{handshake.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <br/>
                <div className='row'>
                    <div className='col-md-6'>
                        <h4 className='text-primary'>Tasks Assigned ({assignedTask.length})</h4>
                        <hr/>
                        {assignedTask.map((task, i) => (
                            <div key={i}>
                                <div>
                                    <Link to={`/${task.company}/task/${task._id}`}>
                                        <div>
                                            <p className='lead'>{task.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='col-md-6'>
                        <h4 className='text-primary'>Tasks Created ({tasks.length})</h4>
                        <hr/>
                        {tasks.map((task, i) => (
                            <div key={i}>
                                <div>
                                    <Link to={`/${task.company}/task/${task._id}`}>
                                        <div>
                                            <p className='lead'>{task.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileTabs;