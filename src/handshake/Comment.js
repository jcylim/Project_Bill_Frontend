import React, { Component } from 'react';
import { comment, uncomment } from './apiHandshake';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import editorStyle from '../css/editorStyles.module.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import DefaultProfile from '../img/avatar.png';


class Comment extends Component {
    constructor() {
        super();
        this.mentionPlugin = createMentionPlugin();
    }

    state = {
        editorState: EditorState.createEmpty(),
        text: '',
        mentions: [],
        suggestions: [],
        error: ''
    };

    processMentions = employees => {
        const mentions = employees.map(employee => {
            return {
              'name': employee.first_name + " " + employee.last_name,
              'link': `/${employee.company}/employee/${employee._id}`
            }
        });

        return mentions;
    };

    handleChange = editorState => {
        this.setState({ editorState });
    };

    onSearchChange = ({ value }) => {
        this.setState({
            suggestions: defaultSuggestionsFilter(value, this.processMentions(this.props.employees))
        })
    };

    isValid = () => {
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent();
        const raw = convertToRaw(contentState); 
        const text = raw.blocks[0].text;
        const mentions = [];

        if (!text.length > 0 || text.length > 150) {
            this.setState({ error: 'Comment should not be empty or go over 500 characters' });
            return false;
        }

        for (let key in raw.entityMap) {
            const ent = raw.entityMap[key];
            if (ent.type === 'mention') {
                mentions.push(ent.data.mention);
            }
        }

        return true;
    };

    addComment = event => {
        event.preventDefault();

        if (!isAuthenticated()) {
            this.setState({ error: 'Please sign in to leave a note on handshake' });
            return false;
        }

        if (this.isValid()) {
            const companyId = this.props.companyId;
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const handshakeId = this.props.handshakeId;
            const contentState = this.state.editorState.getCurrentContent();
            const raw = convertToRaw(contentState);
            const text = raw.blocks[0].text;

            comment(companyId, userId, handshakeId, token, { text })
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({ editorState: EditorState.createEmpty() });
                    this.props.updateComments(data.comments);
                }
            })
        }
    };

    deleteComment = comment => {
        const companyId = this.props.companyId;
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const handshakeId = this.props.handshakeId;

        uncomment(companyId, userId, handshakeId, token, comment)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.props.updateComments(data.comments);
            }
        });
    };

    deleteCommentConfirmation = comment => {
        let answer = window.confirm("Are you sure you want to delete your handshake note?");
        if (answer) {
            this.deleteComment(comment);
        }
    };

    render() {
        const { comments } = this.props;
        const { editorState, suggestions, error } = this.state;
        const { MentionSuggestions } = this.mentionPlugin;
        const plugins = [this.mentionPlugin];

        return (
            <div className='container float-left'>
                {isAuthenticated().user && (
                    <>
                        <h2 className='mt-5 mb-4'>Leave a note</h2>

                        <div 
                            className='alert alert-danger'
                            style={{ display: error ? '' : 'none'}}
                        >
                            {error}
                        </div>

                        <form onSubmit={this.addComment}>
                            <div className='form-group'>
                                <div className={editorStyle.editor}>
                                    <Editor 
                                        editorState={editorState} 
                                        onChange={this.handleChange}
                                        plugins={plugins}
                                    />
                                    <MentionSuggestions 
                                        onSearchChange={this.onSearchChange}
                                        suggestions={suggestions}
                                    />
                                </div>
                                <button className='btn btn-raised btn-success mt-2'>
                                    Post
                                </button>
                            </div>
                        </form>
                    </>
                )}

                <br/>

                <h3 className='text-primary'>Notes ({comments.length})</h3>
                <hr/>
                <div className='col-md-12' style={{'overflow-y': 'auto', 'height': '200px'}}>
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
                                    <p className='mt-4' >{comment.text}</p>
                                    <p className='font-italic mark'>
                                        Posted
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