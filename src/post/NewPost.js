import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { create } from './apiPost';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';
 
class NewPost extends Component {
    constructor() {
        super()
        this.state = {
            title: '',
            body: '',
            price: '',
            photo: '',
            fileSize: 0,
            user: {},
            redirectToProfile: false,
            error: ''
        }
    }

    componentDidMount() {
        this.postData = new FormData();
        this.setState({ user: isAuthenticated().user });
    }

    isValid = () => {
        const { title, body, fileSize } = this.state;
        if (fileSize > 100000) {
            this.setState({error: "File size should be less than 100KB", loading: false});
            return false;
        }
        if (title.length === 0 || body.length === 0) {
            this.setState({error: "All fields are required", loading: false});
            return false;
        }
        return true; 
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;

            create(userId, token, this.postData)
            .then(data => {
                if (data.error) {
                    this.setState({error: data.error});
                } else {
                    this.setState({
                        loading: false, 
                        title: '', 
                        body: '',
                        price: 0,
                        redirectToProfile: true
                    });
                }
            });
        }
    };

    handlerChange = field => event => {
        this.setState({ error: "" });
        const value = field === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = field === 'photo' ? event.target.files[0].size : 0;
        this.postData.set(field, value);
        this.setState({ [field]: value, fileSize });
    };

    newPostForm = (title, body, price) => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Post Photo</label>
                <input 
                    onChange={this.handlerChange('photo')} 
                    type='file'
                    accept='image/*'
                    className='form-control'
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Title</label>
                <input 
                    onChange={this.handlerChange('title')} 
                    type='text' 
                    className='form-control'
                    value={title}
                    placeholder='e.g. Home-grown apples'
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Body</label>
                <textarea 
                    onChange={this.handlerChange('body')} 
                    type='text' 
                    className='form-control'
                    value={body}
                    placeholder='Brief description of the produce selling and pick-up/delivery details'
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Price</label>
                <input 
                    onChange={this.handlerChange('price')} 
                    type='text' 
                    className='form-control'
                    value={price}
                    placeholder='Optional. Default price is $0'
                />
            </div>
            <button 
                onClick={this.clickSubmit}
                className='btn btn-raised btn-primary'>
                Create
            </button>
        </form>
    );

    render() {
        const { 
            title, 
            body,
            price,
            user,
            redirectToProfile,
            error,
            loading 
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create New Post</h2>
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>

                <Loading loading={loading} />

                { this.newPostForm(title, body, price) }
            </div>
        );
    }
}

export default NewPost;