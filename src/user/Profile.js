import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import DeleteUser from './DeleteUser';
import { read } from './apiUser';
import { listByUser } from '../post/apiPost';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import DefaultProfile from '../img/avatar.png';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: { following: [], followers: [] },
            redirectToSignIn: false,
            following: false,
            error: '',
            posts: []
        }
    }

    // check follow
    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            return follower._id === jwt.user._id;
        })
        return match;
    };

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        callApi(userId, token, this.state.user._id)
        .then(data => {
            if (data.error) {
                this.setState({error: data.error});
            } else {
                this.setState({user: data, following: !this.state.following});
            }
        })
    };

    loadPosts = userId => {
        const token = isAuthenticated().token;
        listByUser(userId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        });
    };

    init = userId => {
        const token = isAuthenticated().token;

        read(userId, token)
        .then(data => {
            if(data.error) {
                this.setState({ redirectToSignIn: true });
            } else {
                let following = this.checkFollow(data);
                this.setState({ user: data, following });
                this.loadPosts(data._id);
            }
        })
    };

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
    }

    render() {
        const { user, redirectToSignIn, following, posts } = this.state;
        if (redirectToSignIn) return <Redirect to="/signin" />

        const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile;

        return (
            <div className="container">
                <h2 className='mt-5 mb-5'>Profile</h2>
                <div className="row">
                    <div className="col-md-4">
                        <img 
                            src={photoUrl}
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            alt={user.username} 
                            style={{height: '200px', width: 'auto'}}
                            className='img-thumbnail'
                        />
                    </div>

                    <div className="col-md-8">
                        <div className="lead mt-2">
                            <p>Hello {user.username}!</p>
                            <p>Email: {user.email}</p>
                            <p>Joined since {new Date(user.created).toDateString()}</p>
                        </div>
                        {isAuthenticated().user && 
                         isAuthenticated().user._id === user._id ? (
                            <div className="d-inline-block">
                                <Link className="btn btn-raised btn-info mr-5" to={'/post/create'}>
                                    Create Post
                                </Link>
                                <Link className="btn btn-raised btn-success mr-5" to={`/user/edit/${user._id}`}>
                                    Edit Profile
                                </Link>
                                <DeleteUser userId={user._id}/>
                            </div>
                        ) : (
                            <FollowProfileButton 
                                following={following}
                                onButtonClick={this.clickFollowButton}
                            />
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col md-12 mt-5 mb-3">
                        <hr />
                        <p className="lead">{user.about}</p>
                        <hr />
                        <ProfileTabs 
                            followers={user.followers} 
                            following={user.following}
                            posts={posts}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;