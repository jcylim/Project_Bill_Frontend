import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser';
import DefaultProfile from '../img/avatar.png';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';
 
class EditProfile extends Component {
    constructor() {
        super()
        this.state = {
            id: "",
            first_name: "",
            last_name: "",
            title: "",
            email: "",
            password: "",
            error: "",
            fileSize: 0,
            redirectToProfile: false,
            loading: false
        }
    }

    init = (companyId, userId) => {
        read(companyId, userId, isAuthenticated().token)
        .then(data => {
            if(data.error) {
                this.setState({ redirectToProfile: true });
            } else {
                this.setState({ 
                    id: data._id, 
                    first_name: data.first_name, 
                    last_name: data.last_name, 
                    title: data.title, 
                    email: data.email,
                    error: "" 
                });
            }
        })
    };

    componentDidMount() {
        this.userData = new FormData();
        this.companyId = this.props.match.params.companyId;
        const userId = this.props.match.params.userId;
        this.init(this.companyId, userId);
    }

    isValid = () => {
        const { first_name, last_name, title, email, password, fileSize } = this.state;
        if (fileSize > 100000) {
            this.setState({error: "File size should be less than 100KB", loading: false});
            return false;
        }
        if (first_name.length === 0 || last_name.length === 0) {
            this.setState({error: "Name is required", loading: false});
            return false;
        }
        if (title.length === 0) {
            this.setState({error: "Title is required", loading: false});
            return false;
        }
        // email@domain.com
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({error: "Valid email is required", loading: false});
            return false;
        } 
        if (password.length >= 1 && password.length <= 5) {
            this.setState({error: "Password must be at least 6 characters long", loading: false});
            return false;
        }
        return true; 
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const { id } = this.state;
            update(this.companyId, id, isAuthenticated().token, this.userData)
            .then(data => {
                if (data.error) {
                    this.setState({error: data.error});
                } else {
                    updateUser(data, () => {
                        this.setState({
                            redirectToProfile: true
                        })
                    });
                }
            });
        }
    };

    handlerChange = field => event => {
        this.setState({ error: "" });
        const value = field === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = field === 'photo' ? event.target.files[0].size : 0;
        this.userData.set(field, value);
        this.setState({ [field]: value, fileSize });
    };

    editForm = (first_name, last_name, title, email, password) => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Profile Photo</label>
                <input 
                    onChange={this.handlerChange('photo')} 
                    type='file'
                    accept='image/*'
                    className='form-control'
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>First Name</label>
                <input 
                    onChange={this.handlerChange('first_name')} 
                    type='text' 
                    className='form-control'
                    value={first_name}
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Last Name</label>
                <input 
                    onChange={this.handlerChange('last_name')} 
                    type='text' 
                    className='form-control'
                    value={last_name}
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
                <label className='text-muted'>Email</label>
                <input 
                    onChange={this.handlerChange('email')} 
                    type='email' 
                    className='form-control'
                    value={email}
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Password</label>
                <input 
                    onChange={this.handlerChange('password')} 
                    type='password' 
                    className='form-control'
                    value={password}
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
            first_name,
            last_name, 
            title,
            email, 
            password,
            redirectToProfile, 
            error,
            loading 
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/${this.companyId}/employee/${id}`} />;
        }

        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/${this.companyId}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>

                <Loading loading={loading} />

                <img 
                    src={photoUrl}
                    onError={i => (i.target.src = `${DefaultProfile}`)}
                    alt={id} 
                    style={{height: '200px', width: 'auto'}}
                    className='img-thumbnail'
                />

                { this.editForm(first_name, last_name, title, email, password) }
            </div>
        );
    }
}

export default EditProfile;