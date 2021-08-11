import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { singlePost, update } from './apiPost';
import DefaultPost from '../img/postPic.jpg';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';
 
class EditPost extends Component {
    constructor() {
        super()
        this.state = {
            id: '',
            title: '',
            body: '',
            price: 0,
            error: "",
            fileSize: 0,
            redirectToPost: false,
            loading: false
        }
    }

    init = postId => {
        singlePost(postId)
        .then(data => {
            if (data.error) {
                this.setState({ redirectToPost: true });
            } else {
                this.setState({
                    id: data._id, 
                    title: data.title,
                    body: data.body,
                    price: data.price,
                    error: '',
                    loading: false 
                });
            }
        });
    };

    componentDidMount() {
        this.postData = new FormData();
        const postId = this.props.match.params.postId;
        this.init(postId);
    }

    isValid = () => {
        const { title, body, fileSize } = this.state;
        if (fileSize > 10000000) {
            this.setState({error: "File size should be less than 10MB", loading: false});
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
            const postId = this.state.id;
            const token = isAuthenticated().token;

            update(postId, token, this.postData)
            .then(data => {
                if (data.error) {
                    this.setState({error: data.error});
                } else {
                    this.setState({
                        loading: false, 
                        title: '', 
                        body: '',
                        price: 0,
                        redirectToPost: true
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

    editPostForm = (title, body, price) => (
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
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Body</label>
                <textarea 
                    onChange={this.handlerChange('body')} 
                    type='text' 
                    className='form-control'
                    value={body}
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Price</label>
                <input 
                    onChange={this.handlerChange('price')} 
                    type='text' 
                    className='form-control'
                    value={price}
                    placeholder='Default price is $0'
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
            body, 
            price,
            redirectToPost, 
            error,
            loading 
        } = this.state;

        if (redirectToPost) {
            return <Redirect to={`/post/${id}`} />;
        }

        const photoUrl = `${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Post</h2>
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>

                <Loading loading={loading} />

                <img 
                    src={photoUrl}
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    alt={title} 
                    style={{height: '200px', width: 'auto'}}
                    className='img-thumbnail'
                />

                { this.editPostForm(title, body, price) }
            </div>
        );
    }
}

export default EditPost;