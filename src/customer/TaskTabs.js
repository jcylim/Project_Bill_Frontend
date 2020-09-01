import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import StageBadge from '../handshake/StageBadge';

export class TaskTabs extends Component {
    calculateProgress = stage => {
        if (stage === 'NOT STARTED') {
            return '0%';
        } else if (stage === 'IN PROGRESS') {
            return '50%';
        }
    };
    
    render() {
        const { tasks } = this.props;
        let activeTasks = tasks.filter(task => !(task.stage === 'COMPLETED'));
        let completedTasks = tasks.filter(task => task.stage === 'COMPLETED');

        return (
            <div>
                <div className='container'>
                    <div>
                        <div>
                            <h4 className='text-primary'>Active Tasks ({activeTasks.length})</h4>
                            <hr/>
                            {activeTasks.map((task, i) => (
                                <div key={i} className='mb-3'>
                                    <div>
                                        <Link to={`/${task.company}/task/${task._id}`}>
                                            <div>
                                                <p className='lead'>{task.title}</p>
                                            </div>
                                        </Link>
                                        <div className="progress">
                                            <div className="progress-bar bg-info" role="progressbar" style={{width: this.calculateProgress(task.stage)}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <br/>
                        <div>
                            <h4 className='text-primary'>Completed Tasks ({completedTasks.length})</h4>
                            <hr/>
                            {completedTasks.map((task, i) => (
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
            </div>
        );
    }
}

export default TaskTabs;