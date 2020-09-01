import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { listHandshakes } from './apiHandshake';
import { listUsers } from '../user/apiUser';
import { isAuthenticated } from '../auth';
import DefaultProfile from '../img/avatar.png';

class UserHandshakes extends Component {
    constructor() {
        super();
        this.state = {
            employees: [],
            handshakes: []
        }
    }

    loadHandshakes = token => {
        listHandshakes(this.companyId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ handshakes: data, loading: false });
            }
        })
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

    componentDidMount() {
        this.companyId = this.props.companyId;
        const token = isAuthenticated().token;
        this.setState({ loading: true });

        this.loadHandshakes(token);
        this.loadUsers(token);
    }

    calculateHandshakeProgress = handshakes => {
        let activeHandshakes = handshakes.filter(handshake => !(handshake.stage === 'COMPLETED'));
        let completedHandshakes = handshakes.filter(handshake => handshake.stage === 'COMPLETED');

        let percentActive = Math.ceil((activeHandshakes / completedHandshakes) * 100);

        return percentActive.toString();
    };

    renderUsersHandshakes = (employees, handshakes) => {
        return (
            <div>
                {employees.map((user, i) => {
                    let assignedHandshakes = handshakes.filter(handshake => handshake.assignedTo.some(a => a._id === user._id));
                    let activeHandshakes = assignedHandshakes.filter(handshake => !(handshake.stage === 'COMPLETED' || handshake.stage === 'WITHDRAWN'));
                    let completedHandshakes = assignedHandshakes.filter(handshake => handshake.stage === 'COMPLETED');
                    let withdrawnHandshakes = assignedHandshakes.filter(handshake => handshake.stage === 'WITHDRAWN');

                    return (
                        <div className='mb-3' key={i}>
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
                            <div>
                                <Link 
                                    className='lead' 
                                    to={{
                                        pathname: `/${this.companyId}/handshakes`,
                                        state: {
                                            userId: user._id
                                        }
                                    }}
                                >
                                    Pending: 
                                </Link>{' '}
                                {activeHandshakes.length}
                                <br/>
                                <Link 
                                    className='lead' 
                                    to={{
                                        pathname: `/${this.companyId}/handshakes`,
                                        state: {
                                            userId: user._id,
                                            stage: 'COMPLETED'
                                        }
                                    }}
                                >
                                    Completed:
                                </Link>{' '}
                                {completedHandshakes.length}
                                <br/>
                                <Link 
                                    className='lead' 
                                    to={{
                                        pathname: `/${this.companyId}/handshakes`,
                                        state: {
                                            userId: user._id,
                                            stage: 'WITHDRAWN'
                                        }
                                    }}
                                >
                                    Withdrawn:
                                </Link>{' '}
                                {withdrawnHandshakes.length}
                                <br/>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        const { employees, handshakes } = this.state;
        return (
            <div>
                {/* {(employees.length === 0 || handshakes.length === 0) ? (
                    <h3 className="mt-5 mb-5">
                        No team members or handshakes added yet. Please{""} <Link to={`/${this.companyId}/handshake/create`}>create handshake</Link>.
                    </h3>
                ) : (
                    this.renderUsersHandshakes(employees, handshakes)
                )} */}
                <h3 className="mb-3">
                    Handshakes Per Team Member
                </h3>
                <hr/>
                {this.renderUsersHandshakes(employees, handshakes)}
            </div>
        );
    }
}

export default UserHandshakes;