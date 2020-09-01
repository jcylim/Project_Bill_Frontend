import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { userSignIn, authenticate } from '../auth';
import Loading from '../Loading';

class SignIn extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            companyId: '',
            error: '',
            redirectToReferer: false,
            loading: false
        };
    }

    clickSubmit = event => {
        event.preventDefault();
        this.setState({loading: true});
        const { email, password } = this.state;
        const user = {
            email,
            password
        };

        userSignIn(user)
        .then(data => {
            if (data.error) {
                this.setState({error: data.error, loading: false});
            } else {
                // authenticate
                authenticate(data, () => {
                    this.setState({ companyId: data.user.company, redirectToReferer: true });
                });
            }
        });
    };

    handlerChange = field => event => {
        this.setState({ error: '' });
        this.setState({ [field]: event.target.value });
    };

    signInForm = (email, password) => (
        <form>
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
                Sign In
            </button>
        </form>
    );

    render() {
        const { email, password, companyId, error, redirectToReferer, loading } = this.state;

        if (redirectToReferer) {
            return <Redirect to={`/${companyId}/dashboard`} />
        }

        return (
            <div className='container'>
                <h2 className='mt-5 mb-5'>Sign in as employee</h2>
                
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>

                <Loading loading={loading} />

                { this.signInForm(email, password) }

                <p>
                    <Link
                        to="/root/signin"
                        className="btn btn-raised btn-info mt-3 mr-4"
                    >
                        {" "}
                        Sign in as admin
                    </Link>
                    <Link
                        to='/forgot-password'
                        className="btn btn-raised btn-danger mt-3"
                    >
                        {" "}
                        Forgot Password
                    </Link>
                </p>
            </div>
        );
    }
}

export default SignIn;