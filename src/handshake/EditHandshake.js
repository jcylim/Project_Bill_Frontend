import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { singleHandshake, update } from './apiHandshake';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';
 
class EditHandshake extends Component {
    constructor() {
        super()
        this.state = {
            id: '',
            title: '',
            about: '',
            deadline: '',
            error: "",
            redirectToHandshake: false,
            loading: false
        }
    }

    init = (companyId, handshakeId, token) => {
        singleHandshake(companyId, handshakeId, token)
        .then(data => {
            if (data.error) {
                this.setState({ redirectToHandshake: true });
            } else {
                this.setState({
                    id: data._id, 
                    title: data.title,
                    about: data.about,
                    deadline: data.deadline,
                    error: '',
                    loading: false 
                });
            }
        });
    };

    componentDidMount() {
        this.companyId = this.props.match.params.companyId;
        const handshakeId = this.props.match.params.handshakeId;
        const token = isAuthenticated().token;

        this.init(this.companyId, handshakeId, token);
    }

    isValid = () => {
        const { title, about } = this.state;
        if (title.length === 0 || about.length === 0) {
            this.setState({error: "All fields are required", loading: false});
            return false;
        }
        return true; 
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const { id, title, about, deadline } = this.state;
            const token = isAuthenticated().token;

            const handshake = {
                title,
                about,
                deadline
            }

            update(this.companyId, id, token, handshake)
            .then(data => {
                if (data.error) {
                    this.setState({error: data.error});
                } else {
                    this.setState({
                        loading: false, 
                        title: '', 
                        about: '',
                        deadline: '',
                        redirectToHandshake: true
                    });
                }
            });
        }
    };

    handlerChange = field => event => {
        this.setState({ error: "" });
        this.setState({ [field]: event.target.value });
    };

    editHandshakeForm = (title, about, deadline) => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Title</label>
                <input 
                    onChange={this.handlerChange('title')} 
                    type='text' 
                    className='form-control'
                    value={title}
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>About</label>
                <textarea 
                    onChange={this.handlerChange('about')} 
                    type='text' 
                    className='form-control'
                    value={about}
                />
            </div>
            <div className='row'>
                <div className='form-group col-md-2'>
                    <label className='text-muted'>Due Date</label>
                    <input 
                        onChange={this.handlerChange('deadline')} 
                        type='date' 
                        className='form-control'
                        value={deadline}
                    />
                </div>
            </div>
            <button 
                onClick={this.clickSubmit}
                className='btn btn-raised btn-primary'>
                Update
            </button>
        </form>
    );

    render() {
        const { 
            id,
            title, 
            about, 
            deadline,
            redirectToHandshake, 
            error,
            loading 
        } = this.state;

        if (redirectToHandshake) {
            return <Redirect to={`/${this.companyId}/handshake/${id}`} />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Handshake</h2>
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>

                <Loading loading={loading} />

                { this.editHandshakeForm(title, about, deadline) }
            </div>
        );
    }
}

export default EditHandshake;