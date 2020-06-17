import React, { Component } from 'react';
import { comment, uncomment } from './apiPost';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import DefaultProfile from '../img/avatar.png';

class Comment extends Component {
    state = {
        text: '',
        error: ''
    };

    handleChange = event => {
        this.setState({ text: event.target.value, error: '' });
    };

    isValid = () => {
        const { text } = this.state;
        if (!text.length > 0 || text.length > 150) {
            this.setState({ error: 'Comment should not be empty or go over 150 characters' });
            return false;
        }
        return true;
    };

    addComment = event => {
        event.preventDefault();

        if (!isAuthenticated()) {
            this.setState({ error: 'Please sign in to leave a comment' });
            return false;
        }

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const postId = this.props.postId;

            comment(userId, token, postId, {text: this.state.text})
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({ text: '' });
                    // dispatch fresh list of comments to parent (SinglePost)
                    this.props.updateComments(data.comments);
                }
            })
        }
    };

    deleteComment = comment => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = this.props.postId;

        uncomment(userId, token, postId, comment)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.props.updateComments(data.comments);
            }
        });
    };

    deleteCommentConfirmation = comment => {
        let answer = window.confirm("Are you sure you want to delete your comment?");
        if (answer) {
            this.deleteComment(comment);
        }
    };

    render() {
        const { comments } = this.props;
        const { error } = this.state;

        return (
            <div>
                <h2 className='mt-5 mb-4'>Leave a comment</h2>

                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>

                <form onSubmit={this.addComment}>
                    <div className='form-group'>
                        <input 
                            type='text' 
                            onChange={this.handleChange}
                            className='form-control'
                            value={this.state.text}
                            placeholder="Leave a comment..."
                        />
                        <button className='btn btn-raised btn-success mt-2'>
                            Post
                        </button>
                    </div>
                </form>

                <br/>

                <div className='col-md-12'>
                    <h3 className='text-primary'>({comments.length}) Comments</h3>
                    <hr/>
                    {comments.map((comment, i) => (
                        <div key={i}>
                            <div>
                                <Link to={`/user/${comment.postedBy._id}`}>
                                    <img
                                        className='float-left mr-2'
                                        height='30px'
                                        width='30px'
                                        style={{borderRadius: '50%', border: '1px solid black'}}
                                        src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                                        alt={comment.postedBy.username}
                                        onError={i => (i.target.src = `${DefaultProfile}`)}
                                    />
                                </Link>
                                <div>
                                    <p className='lead'>{comment.text}</p>
                                    <br/>
                                    <p className='font-italic mark'>
                                        Posted by{' '} 
                                        <Link to={`${comment.postedBy._id}`}>
                                            {comment.postedBy.username}
                                        </Link>
                                        {' '}on {new Date(comment.created).toDateString()}
                                        <span>
                                            {isAuthenticated().user && 
                                             isAuthenticated().user._id === comment.postedBy._id && (
                                                <>
                                                    <span 
                                                        className="text-danger float-right mr-1"
                                                        onClick={() => this.deleteCommentConfirmation(comment)}
                                                    >
                                                        Remove
                                                    </span>
                                                </>
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Comment;