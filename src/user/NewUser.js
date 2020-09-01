import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { addNewUser } from './apiUser';
import Loading from '../Loading';
 
class NewUser extends Component {
    constructor() {
        super()
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            title: '',
            displayMessage: false,
            error: '',
            loading: false
        }
    }

    isValidAdd = () => {
        const { first_name, last_name, email, password } = this.state;
        if (first_name.length === 0 || last_name.length === 0 || email.length === 0 || password.length === 0) {
            this.setState({error: "All fields are required for adding employee", loading: false});
            return false;
        }
        return true; 
    };

    isValidRemove = () => {
        const { first_name, last_name, email } = this.state;
        if (first_name.length === 0 || last_name.length === 0 || email.length === 0) {
            this.setState({error: "All fields except password are required for removing employee", loading: false});
            return false;
        }
        return true; 
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        const { first_name, last_name, email, password, title } = this.state;
        const companyId = this.props.match.params.companyId;
        const token = isAuthenticated().token;
        const user = {
            first_name,
            last_name,
            email,
            password,
            title
        };

        if (this.isValidAdd()) {
            addNewUser(companyId, token, user)
            .then(data => {
                if (data.error) this.setState({error: data.error, loading: false})
                else 
                    this.setState({
                        first_name: '',
                        last_name: '',
                        email: '',
                        password: '',
                        title: '',
                        error: '',
                        displayMessage: true,
                        loading: false
                    })
            });
        }
    };

    handlerChange = field => event => {
        this.setState({ error: "" });
        this.setState({ [field]: event.target.value });
    };

    newUserForm = (first_name, last_name, email, password, title) => (
        <form>
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
            <div className='form-group'>
                <label className='text-muted'>Title (Optional)</label>
                <input 
                    onChange={this.handlerChange('title')} 
                    type='text' 
                    className='form-control'
                    value={title}
                />
            </div>
            <button 
                onClick={this.clickSubmit}
                className='btn btn-raised btn-primary mr-4'>
                Add Employee
            </button>
        </form>
    );

    render() {
        const { 
            first_name, 
            last_name,
            email,
            password,
            title,
            displayMessage,
            error,
            loading 
        } = this.state;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Add New Employee</h2>
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>

                <Loading loading={loading} />

                <div 
                    className='alert alert-info'
                    style={{ display: displayMessage ? '' : 'none'}}
                >
                    New employee has been added successfully.
                </div>

                { this.newUserForm(first_name, last_name, email, password, title) }
            </div>
        );
    }
}

export default NewUser;