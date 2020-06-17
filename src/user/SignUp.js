import React, { Component } from 'react';
import { signUp } from '../auth';
import { Link } from 'react-router-dom';

class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            email: '',
            password: '',
            error: '',
            open: false
        };
    }

    clickSubmit = event => {
        event.preventDefault();
        const { username, email, password } = this.state;
        const user = {
            username,
            email,
            password
        };
        signUp(user)
        .then(data => {
            if (data.error) this.setState({error: data.error})
            else 
                this.setState({
                    username: '',
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

    signUpForm = (username, email, password) => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Username</label>
                <input 
                    onChange={this.handlerChange('username')} 
                    type='text' 
                    className='form-control'
                    value={username}
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
        const { username, email, password, error, open } = this.state;

        return (
            <div className='container'>
                <h2 className='mt-5 mb-5'>Sign Up</h2>
                
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
                    New account has been created successfully. Please{""} <Link to="/signin">sign in</Link>
                </div>

                { this.signUpForm(username, email, password) }

            </div>
        )
    }
}

export default SignUp;