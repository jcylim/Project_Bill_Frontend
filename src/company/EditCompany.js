import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { getCompany, update, updateCompany } from './apiCompany';
import DefaultCompany from '../img/companyPic.jpg';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';
 
class EditCompany extends Component {
    constructor() {
        super()
        this.state = {
            id: "",
            name: "",
            about: "",
            email: "",
            password: "",
            error: "",
            fileSize: 0,
            redirectToProfile: false,
            loading: false
        }
    }

    init = companyId => {
        getCompany(companyId, isAuthenticated().token)
        .then(data => {
            if(data.error) {
                this.setState({ redirectToProfile: true });
            } else {
                this.setState({ 
                    id: data._id, 
                    name: data.name, 
                    about: data.about, 
                    email: data.email,
                    error: "" 
                });
            }
        })
    };

    componentDidMount() {
        this.companyData = new FormData();
        const companyId = this.props.match.params.companyId;

        this.init(companyId);
    }

    isValid = () => {
        const { name, about, email, password, fileSize } = this.state;
        if (fileSize > 100000) {
            this.setState({error: "File size should be less than 100KB", loading: false});
            return false;
        }
        if (name.length === 0) {
            this.setState({error: "Name is required", loading: false});
            return false;
        }
        if (about.length === 0) {
            this.setState({error: "Company description is required", loading: false});
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
            update(id, isAuthenticated().token, this.companyData)
            .then(data => {
                if (data.error) {
                    this.setState({error: data.error});
                } else {
                    updateCompany(data, () => {
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
        this.companyData.set(field, value);
        this.setState({ [field]: value, fileSize });
    };

    editForm = (name, about, email, password) => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Company Profile Photo</label>
                <input 
                    onChange={this.handlerChange('photo')} 
                    type='file'
                    accept='image/*'
                    className='form-control'
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Company Name</label>
                <input 
                    onChange={this.handlerChange('name')} 
                    type='text' 
                    className='form-control'
                    value={name}
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Company Description</label>
                <textarea 
                    onChange={this.handlerChange('about')} 
                    type='text' 
                    className='form-control'
                    value={about}
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
            name,
            about,
            email, 
            password,
            redirectToProfile, 
            error,
            loading 
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/${id}/profile`} />;
        }

        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/${id}/photo?${new Date().getTime()}` : DefaultCompany;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Company Profile</h2>
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>

                <Loading loading={loading} />

                <img 
                    src={photoUrl}
                    onError={i => (i.target.src = `${DefaultCompany}`)}
                    alt={id} 
                    style={{height: '200px', width: 'auto'}}
                    className='img-thumbnail'
                />

                { this.editForm(name, about, email, password) }
            </div>
        );
    }
}

export default EditCompany;