import React, { Component } from 'react';
import { comment } from './apiHandshake';
import { isAuthenticated } from '../auth';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import editorStyle from '../css/editorStyles.module.css';
import 'draft-js-mention-plugin/lib/plugin.css';


class AddComment extends Component {
    constructor() {
        super();
        this.mentionPlugin = createMentionPlugin();
        this.processMentions = this.processMentions.bind(this);
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
              'link': `/${employee.company}/employee/${employee._id}`,
              //'avatar': `${process.env.REACT_APP_API_URL}/${employee.company}/user/photo/${employee._id}`
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
            this.setState({ error: 'Comment should not be empty or go over 150 characters' });
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
            this.setState({ error: 'Please sign in to leave a customer note' });
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

    render() {
        const { editorState, suggestions, error } = this.state;
        const { MentionSuggestions } = this.mentionPlugin;
        const plugins = [this.mentionPlugin];

        return (
            <div class="card card-warning">
                <div class="card-header">
                    <h3 class="card-title">Quick Comment</h3>
                </div>
                
                <div class="card-body">
                    <form onSubmit={this.addComment}>
                        <div className='form-group'>
                            <div className={editorStyle.editor}>
                                <Editor 
                                    editorState={editorState} 
                                    onChange={this.handleChange}
                                    plugins={plugins}
                                    placeholder="Leave your note here..."
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
                </div>
            </div>
        );
    }
}

export default AddComment;