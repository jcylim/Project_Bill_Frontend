import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DefaultProfile from '../img/avatar.png';

export class CompanyTabs extends Component {
    render() {
        const { handshakes, users } = this.props;
        return (
            <div>
                <div className='row'>
                    <div className='col-md-4'>
                        <h3 className='text-primary'>Employees</h3>
                        <hr/>
                        <div style={{'overflow-y': 'auto', 'height': '300px'}}>
                            {users.map((user, i) => (
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
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <h3 className='text-primary'>Handshakes</h3>
                        <hr/>
                        <div style={{'overflow-y': 'auto', 'height': '300px'}}>
                            {handshakes.map((handshake, i) => (
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
                </div>
            </div>
        );
    }
}

export default CompanyTabs;