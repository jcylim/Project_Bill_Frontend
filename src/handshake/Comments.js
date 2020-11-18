import React, { Component } from 'react';
import { uncomment } from './apiHandshake';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import 'draft-js-mention-plugin/lib/plugin.css';
import DefaultProfile from '../img/avatar.png';


class Comments extends Component {

    deleteComment = comment => {
        const companyId = this.props.companyId;
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const customerId = this.props.customerId;

        uncomment(companyId, userId, customerId, token, comment)
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

        return (
            <div className="card card-default">
                <div class="card-header">
                    <h3 class="card-title">Comments ({comments.length})</h3>
                </div>
                <div className='card-body col-md-12' style={{'overflow-y': 'auto', 'height': '300px'}}>
                    {comments.map((comment, i) => (
                        <div key={i}>
                            <div>
                                <Link to={`/${comment.postedBy.company}/employee/${comment.postedBy._id}`}>
                                    <img
                                        className='float-left mr-2'
                                        height='30px'
                                        width='30px'
                                        style={{borderRadius: '50%', border: '1px solid black'}}
                                        src={`${process.env.REACT_APP_API_URL}/${comment.postedBy.company}/user/photo/${comment.postedBy._id}`}
                                        alt={comment.postedBy.email}
                                        onError={i => (i.target.src = `${DefaultProfile}`)}
                                    />
                                </Link>
                                <div>
                                    <Link to={`/${comment.postedBy.company}/employee/${comment.postedBy._id}`}>
                                        {comment.postedBy.first_name} {comment.postedBy.last_name}
                                    </Link>
                                    <br/>
                                    <p className='mt-4' style={{'word-wrap': 'break-word'}}>{comment.text}</p>
                                    <p className='font-italic mark'>
                                        Posted
                                        {' '}on {new Date(comment.created).toDateString()}
                                        <span>
                                            {((isAuthenticated().user && isAuthenticated().user._id === comment.postedBy._id) || isAuthenticated().company) && (
                                                <>
                                                    <a 
                                                        className="text-danger float-right mr-1"
                                                        onClick={() => this.deleteCommentConfirmation(comment)}
                                                    >
                                                        Remove
                                                    </a>
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

export default Comments;