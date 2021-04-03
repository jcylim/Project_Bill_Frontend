import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { findPeople, follow } from './apiUser';
import DefaultProfile from '../img/avatar.png';
import { isAuthenticated } from '../auth';
import Loading from '../Loading';

class FindPeople extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            open: false,
            followMessage: '',
            error: '',
            loading: false
        }
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        this.setState({ loading: true });

        findPeople(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ users: data, loading: false });
            }
        })
    }

    clickFollow = (user, i) => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        follow(userId, token, user._id)
        .then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                let toFollow = this.state.users;
                toFollow.splice(i, 1);
                this.setState({ 
                    users: toFollow, 
                    open: true,
                    followMessage: `Following ${user.name}`
                });
            }
        })
    };

    renderUsers = users => (
        <div className="row">
            {users.map((user, i) => (
                    <div className="card col-md-4" style={{width: "18rem"}} key={i}>
                        <img 
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}`}
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            alt={user.name} 
                            style={{height: '200px', width: 'auto'}}
                            className='img-thumbnail'
                        />
                        <div className="card-body">
                            <h5 className="card-title">{user.name}</h5>
                            <p className="card-text">
                                {user.email}
                            </p>
                            <Link 
                                to={`/user/${user._id}`}
                                className="btn btn-raised btn-primary btn-sm"
                            >
                                View Profile
                            </Link>

                            <button 
                                className='btn btn-raised btn-info float-right btm-sm'
                                onClick={() => this.clickFollow(user, i)}
                            >
                                Follow
                            </button>
                        </div>
                    </div>
                )
            )}
        </div>
    );

    render() {
        const { users, open, followMessage, loading } = this.state; 
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Find People</h2>

                <Loading loading={loading} />

                {open && (
                    <div className='alert alert-success'>
                        <p>{followMessage}</p>
                    </div>
                )}

                {this.renderUsers(users)}
            </div>
        );
    }
}

export default FindPeople;