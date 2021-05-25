import React, { Component } from 'react';
import { singlePost, remove, like, unlike, setStatus, pay } from './apiPost';
import { isAuthenticated } from '../auth';
import { Link, Redirect } from 'react-router-dom';
import DefaultPost from '../img/postPic.jpg';
import Comment from './Comment';
import StripeCheckout from 'react-stripe-checkout';
import StatusBadge from './StatusBadge';
import StatusDropdownMenu from './StatusDropdownMenu';

class SinglePost extends Component {
    state = {
        post: '',
        redirectToHome: false,
        like: false,
        likes: 0,
        status: '',
        comments: [],
        redirectToSignin: false,
        loading: false
    }
    
    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };

    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        this.setState({ loading: true });

        singlePost(postId)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ 
                    post: data,
                    likes: data.likes.length,
                    like: this.checkLike(data.likes),
                    status: data.status,
                    comments: data.comments,
                    loading: false 
                });
            }
        })
    };
    
    deletePost = () => {
        remove(this.state.post._id, isAuthenticated().token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ redirectToHome: true });
            }
        });
    };

    deletePostConfirmation = () => {
        let answer = window.confirm("Are you sure you want to delete this post?");
        if (answer) {
            this.deletePost();
        }
    };

    updateComments = comments => {
        this.setState({ comments });
    };

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }

        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;

        callApi(userId, token, postId)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                })
            }
        });
    };

    setPostStatus = status => {
        const token = isAuthenticated().token;

        setStatus(this.state.post._id, token, status).then(data => {
        if (data.error) {
            this.setState({ error: data.error });
        } else {
            this.setState({ status: data.status });
        }
        });
    };

    makePayment = token => {  
        const authToken = isAuthenticated().token;  
        pay(this.state.post._id, token, authToken).then(data => {
            console.log("response: ", data);
            const { status } = data;
            console.log(`status : ${status}`);
            // change status to "SOLD"
            this.setPostStatus("SOLD");
        });
    };

    renderPost = post => {
        const posterId = post.postedBy ? 
        `/user/${post.postedBy._id}` : 
        '';
        const posterName = post.postedBy ? 
        `${post.postedBy.first_name} ${post.postedBy.last_name}` : 
        'Unknown';
        const userId = post.postedBy ? 
        `${post.postedBy._id}` : 
        '';
        const { like, likes, status } = this.state;
        const price = post.price;

        return (
            <div className="card-body">
                <p className='font-italic mark'>
                    Posted by{' '} 
                    <Link to={`${posterId}`}>
                        {posterName}
                    </Link>
                    {' '}on {new Date(post.created).toDateString()}
                </p>
                <div className='d-flex justify-content-between'>  
                    <h3 className='ml-2'><StatusBadge status={status} /></h3>
                    {isAuthenticated().user && 
                        isAuthenticated().user._id === userId && (
                        <StatusDropdownMenu
                            onButtonClick={this.setPostStatus} 
                        />
                    )}
                </div>
                <br/>
                <img 
                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}?${new Date().getTime()}`}
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    alt={post.title} 
                    style={{
                        height: '300px', 
                        width: '100%',
                        objectFit: 'cover' 
                    }}
                    className='img-thumbnail'
                />

                {/* {like ? (
                    <h3 onClick={this.likeToggle} className='mt-3'>
                        <i 
                            className='fa fa-thumbs-up text-success'
                            style={{
                                padding: '10px',
                                borderRadius:'50%'
                            }}
                            aria-hidden="true"
                        />{' '}
                        {likes} Likes 
                    </h3>
                ) : (
                    <h3 onClick={this.likeToggle} className='mt-3'>
                        <i 
                            className='fa fa-thumbs-up text-danger'
                            style={{
                                padding: '10px', 
                                borderRadius:'50%'
                            }} 
                        />{' '}
                        {likes} Likes
                    </h3>
                )} */}
                <div className='d-flex justify-content-between mt-3'>
                    <h4 className="card-text" style={{color: 'green'}}>
                        {`$${price}`}
                    </h4>  
                    {isAuthenticated().user && (
                        // <StripeCheckout 
                        //     stripeKey={process.env.REACT_APP_STRIPE_PUB_KEY}
                        //     token={this.makePayment} 
                        //     name="Buy Produce"
                        //     amount={price * 100}
                        // >
                        //     <button className="btn btn-lg btn-outline-info">Pay ${price}</button>
                        // </StripeCheckout>
                        <Link 
                            to={`/pay/${post._id}`}
                            className="btn btn-lg btn-outline-info"
                        >
                            Pay ${price}
                        </Link>
                    )}
                </div>              
                <p className="card-text mt-4">
                    {post.body}
                </p>
                <br/>
                <div className='d-inline-block'>
                    <Link 
                        to={'/'}
                        className="btn btn-raised btn-primary btn-sm mr-5"
                    >
                        Back to Home
                    </Link>
                    {isAuthenticated().user && 
                     isAuthenticated().user._id === userId && (
                        <>  
                            <Link 
                                to={`/post/edit/${post._id}`}
                                className="btn btn-raised btn-info mr-5"
                            >
                                Edit Post
                            </Link>
                            <button 
                                className="btn btn-raised btn-danger"
                                onClick={this.deletePostConfirmation}
                            >
                                Delete Post
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    render() {
        const { 
            post,
            comments,
            redirectToHome, 
            redirectToSignin, 
            loading 
        } = this.state;
        if (redirectToHome) {
            return <Redirect to="/" />;
        } else if (redirectToSignin) {
            return <Redirect to="/signin" />;
        }

        return (
            <div className='container'>
                <h2 className='display-4 mt-5 mb-3'>{post.title}</h2>
            
                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                    this.renderPost(post)
                )}

                <Comment 
                    postId={post._id} 
                    comments={comments.reverse()} 
                    updateComments={this.updateComments}
                />
            </div>
        );
    }
}

export default SinglePost;