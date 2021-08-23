import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import DeleteUser from './DeleteUser';
import { read, onboardPayment, checkOnboardStatus } from './apiUser';
import { listByUser } from '../post/apiPost';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import DefaultProfile from '../img/avatar.png';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: { following: [], followers: [] },
            isStripeOnboarded: false,
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

    setUpPayment = userId => {
        const token = isAuthenticated().token;
        onboardPayment(userId, token)
        .then(data => {
            if (data.error) {
                this.setState({error: data.error});
            } else {
                window.location.href = data.url;
            }
        });
    };

    checkIfOnboarded = userId => {
        const token = isAuthenticated().token;

        checkOnboardStatus(userId, token)
        .then(data => {
            if (data.error) {
                this.setState({error: data.error});
            } else {
                this.setState( { isStripeOnboarded: data.isOnboarded });
            }
        })
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
        this.checkIfOnboarded(userId);
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
        this.checkIfOnboarded(userId);
    }

    render() {
        const { user, redirectToSignIn, following, posts, isStripeOnboarded } = this.state;
        if (redirectToSignIn) return <Redirect to="/signin" />

        const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile;

        const isUser = isAuthenticated().user && isAuthenticated().user._id === user._id;

        return (
            <div className="container">
                <div className='d-flex align-items-center mt-5 mb-5'>
                    <h2 className='mr-3'>Profile</h2>
                    {user && user.type === "local food supplier" && (
                        <h6><span className="badge badge-pill badge-success">Homely Certified Local Food Supplier</span></h6>
                    )}
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <img 
                            src={photoUrl}
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            alt={user.last_name} 
                            style={{height: '200px', width: 'auto'}}
                            className='img-thumbnail'
                        />
                    </div>

                    <div className="col-md-8">
                        <div className="lead mt-2">
                            {isUser && <p><b>Hello {user.first_name} {user.last_name}!</b></p>}
                            <p><b>Email:</b> {user.email}</p>
                            {user.phone && (<p><b>Phone:</b> {user.phone}</p>)}
                            {user.address && (<p><b>Address:</b> {user.address}</p>)}
                            <p>Joined since {new Date(user.created).toDateString()}</p>
                        </div>
                        {isUser ? (
                            <>
                                <div className="d-inline-block">
                                    {isAuthenticated().user.type === "local food supplier" && (
                                        <Link className="btn btn-raised btn-info mr-5" to={'/post/create'}>
                                            Create Post
                                        </Link>
                                    )}
                                    <Link className="btn btn-raised btn-success mr-5" to={`/user/edit/${user._id}`}>
                                        Edit Profile
                                    </Link>
                                    <DeleteUser userId={user._id}/>
                                </div>
                                {!isAuthenticated().user.stripeAccountId ? (
                                    <div style={{ 'paddingTop': '20px'}}>
                                        <button 
                                            onClick={() => this.setUpPayment(user._id)} 
                                            className="btn btn-raised btn-outline-secondary"
                                            >
                                                Set Up Payment
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {!isStripeOnboarded && (
                                            <div style={{ 'paddingTop': '20px'}}>
                                                <button 
                                                    onClick={() => this.setUpPayment(user._id)} 
                                                    className="btn btn-raised btn-outline-warning"
                                                    >
                                                        Complete Payment Onboarding
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
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