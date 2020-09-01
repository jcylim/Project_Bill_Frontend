import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { singleTask, update } from './apiTask';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';
 
class EditTask extends Component {
    constructor() {
        super()
        this.state = {
            id: '',
            title: '',
            about: '',
            error: "",
            redirectToTask: false,
            loading: false
        }
    }

    init = (companyId, taskId, token) => {
        singleTask(companyId, taskId, token)
        .then(data => {
            if (data.error) {
                this.setState({ redirectToTask: true });
            } else {
                this.setState({
                    id: data._id, 
                    title: data.title,
                    about: data.about,
                    error: '',
                    loading: false 
                });
            }
        });
    };

    componentDidMount() {
        this.companyId = this.props.match.params.companyId;
        const taskId = this.props.match.params.taskId;
        const token = isAuthenticated().token;

        this.init(this.companyId, taskId, token);
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
            const { id, title, about } = this.state;
            const token = isAuthenticated().token;
            const companyId = this.companyId;

            const task = {
                title,
                about,
                companyId
            }

            update(companyId, id, token, task)
            .then(data => {
                if (data.error) {
                    this.setState({error: data.error});
                } else {
                    this.setState({
                        loading: false, 
                        title: '', 
                        about: '',
                        redirectToTask: true
                    });
                }
            });
        }
    };

    handlerChange = field => event => {
        this.setState({ error: "" });
        this.setState({ [field]: event.target.value });
    };

    editTaskForm = (title, about) => (
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
            redirectToTask, 
            error,
            loading 
        } = this.state;

        if (redirectToTask) {
            return <Redirect to={`/${this.companyId}/task/${id}`} />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Task</h2>
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>

                <Loading loading={loading} />

                { this.editTaskForm(title, about) }
            </div>
        );
    }
}

export default EditTask;