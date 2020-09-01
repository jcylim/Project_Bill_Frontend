import React, { Component } from 'react';
import { comment, uncomment } from './apiCompany';
import { isAuthenticated } from '../auth';

class Announcements extends Component {
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
            this.setState({ error: 'Announcement should not be empty or go over 150 characters' });
            return false;
        }
        return true;
    };

    addComment = event => {
        event.preventDefault();

        if (!isAuthenticated()) {
            this.setState({ error: 'Please sign in to leave a company announcement' });
            return false;
        }

        if (this.isValid()) {
            const companyId = this.props.companyId;
            const token = isAuthenticated().token;

            comment(companyId, token, {text: this.state.text})
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
        const companyId = this.props.companyId;
        const token = isAuthenticated().token;

        uncomment(companyId, token, comment)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.props.updateComments(data.comments);
            }
        });
    };

    deleteCommentConfirmation = comment => {
        let answer = window.confirm("Are you sure you want to delete the announcement?");
        if (answer) {
            this.deleteComment(comment);
        }
    };

    render() {
        const { comments } = this.props;
        const { error } = this.state;

        return (
            <div className='ml-5'>
                <h4>Announcements ({comments.length})</h4>
                {isAuthenticated().company && (
                    <>
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
                                    placeholder="Post an announcment..."
                                />
                                <button className='btn btn-raised btn-success mt-2'>
                                    Post
                                </button>
                            </div>
                        </form>
                    </>
                )}
                <hr/>
                <div className='col-md-12'>
                    <div style={{'overflow-y': 'auto', 'height': '250px'}}>
                        {comments.map((comment, i) => (
                            <div key={i}>
                                <div>
                                    <div>
                                        <p style={{'word-wrap': 'break-word'}}>{comment.text}</p>
                                        {isAuthenticated().company && (
                                            <>
                                                <span 
                                                    className="text-danger float-left"
                                                    onClick={() => this.deleteCommentConfirmation(comment)}
                                                >
                                                    Remove
                                                </span>
                                            </>
                                        )}
                                        <p className='font-italic mark'>
                                            Posted on {new Date(comment.created).toDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Announcements;