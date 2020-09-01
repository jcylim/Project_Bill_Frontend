import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { listUsers } from './apiUser';
import { isAuthenticated } from '../auth';
import DefaultProfile from '../img/avatar.png';

class Users extends Component {
    constructor() {
        super();
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        this.companyId = this.props.match.params.companyId;

        listUsers(this.companyId, isAuthenticated().token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ users: data });
            }
        })
    }

    renderUsers = users => (
        <div className="row">
            {users.map((user, i) => (
                    <div className="card col-md-4" style={{width: "18rem"}} key={i}>
                        <img 
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`}
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            alt={user.username} 
                            style={{height: '200px', width: 'auto'}}
                            className='img-thumbnail'
                        />
                        <div className="card-body">
                            <h5 className="card-title">{user.first_name} {user.last_name}</h5>
                            <p className="card-text">
                                {user.email}
                            </p>
                            <Link 
                                to={`/${user.company}/employee/${user._id}`}
                                className="btn btn-raised btn-primary btn-sm"
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>
                )
            )}
        </div>
    );

    render() {
        const { users } = this.state; 
        return (
            <div className="container">
                {users.length === 0 ? (
                    <h3 className="mt-5 mb-5">
                        No employees added to company yet. Please{""} <Link to={`/${this.companyId}/employee/add`}>add employee</Link>.
                    </h3>
                ) : (
                    <h3 className="mt-5 mb-5">
                        {!users.length ? 'Loading...' : 'Employees'}
                    </h3>
                )}
                {this.renderUsers(users)}
            </div>
        );
    }
}

export default Users;