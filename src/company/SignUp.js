import React, { Component } from 'react';
import { signUp } from '../auth';
import { Link } from 'react-router-dom';

class RootSignUp extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            about: '',
            email: '',
            password: '',
            error: '',
            open: false
        };
    }

    clickSubmit = event => {
        event.preventDefault();
        const { name, about, email, password } = this.state;
        const company = {
            name,
            about,
            email,
            password
        };
        signUp(company)
        .then(data => {
            if (data.error) this.setState({error: data.error})
            else 
                this.setState({
                    name: '',
                    about: '',
                    email: '',
                    password: '',
                    error: '',
                    open: true
                })
        });
    };

    handlerChange = field => event => {
        this.setState({ error: '' });
        this.setState({ [field]: event.target.value });
    };

    signUpForm = (name, about, email, password) => (
        <form>
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
                Register
            </button>
        </form>
    );

    render() {
        const { name, about, email, password, error, open } = this.state;

        return (
            <div className='container'>
                <h2 className='mt-5 mb-5'>Create a new company account</h2>
                
                <div
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>
                <div 
                    className='alert alert-info'
                    style={{ display: open ? '' : 'none'}}
                >
                    New account has been created successfully. Please{""} <Link to="/root/signin">sign in</Link>
                </div>

                { this.signUpForm(name, about, email, password) }

            </div>
        )
    }
}

export default RootSignUp;