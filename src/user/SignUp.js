import React, { Component } from 'react';
import { signUp } from '../auth';
import { Link } from 'react-router-dom';
import StateDropdownMenu from './StateDropdownMenu';
import CountryDropdownMenu from './CountryDropdownMenu';

class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            type: '',
            street: '',
            city: '',
            state: '',
            country: '',
            phone: '',
            error: '',
            open: false
        };
    }

    isAddressValid = () => {
        const { street, city, state, country } = this.state;
        if (street.length === 0 || city.length === 0 || state.length === 0 || country.length === 0) {
            this.setState({error: "Address field is required", loading: false});
            return false;
        }
        return true; 
    };

    clickSubmit = event => {
        event.preventDefault();
        const { name, email, password, type, street, city, state, country, phone} = this.state;
        const user = {
            name,
            email,
            password,
            type,
            street,
            city,
            state,
            country,
            phone
        };

        signUp(user)
        .then(data => {
            if (data.error) this.setState({error: data.error})
            else 
                this.setState({
                    name: '',
                    email: '',
                    password: '',
                    type: '',
                    street: '',
                    city: '',
                    state: '',
                    country: '',
                    phone: '',
                    error: '',
                    open: true
                })
        });
    };

    handleChange = field => event => {
        this.setState({ error: '' });
        this.setState({ [field]: event.target.value });
    };

    onSelectStateChange = state => {
        this.setState({ state });
    };

    onSelectCountryChange = country => {
        this.setState({ country });
    };

    signUpForm = (name, email, password, type, street, city, state, country, phone) => {
        let types = [
            'Customer',
            'Chef',
            'Food Supplier'
        ];

        let options = types.map((type, i) =>
            <option key={i}>
                {type}
            </option>
        );

        return (
            <form>
                <div className='form-group'>
                    <label className='text'>Name</label>
                    <input 
                        onChange={this.handleChange('name')} 
                        type='text'
                        className='form-control'
                        value={name}
                    />
                </div>
                <div className='form-group'>
                    <label className='text'>Email</label>
                    <input 
                        onChange={this.handleChange('email')} 
                        type='email' 
                        className='form-control'
                        value={email}
                    />
                </div>
                <div className='form-group'>
                    <label className='text'>Password</label>
                    <input 
                        onChange={this.handleChange('password')} 
                        type='password' 
                        className='form-control'
                        value={password}
                    />
                </div>
                <div className="form-group">
                    <label for="inputAddress">Address</label>
                    <input 
                        type="text"
                        className="form-control"
                        id="inputAddress" 
                        placeholder="e.g. 1234 Main St"
                        value={street} 
                        onChange={this.handleChange('street')} 
                    />
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label for="inputCity">City</label>
                        <input 
                            type="text"
                            className="form-control"
                            id="inputCity"
                            value={city}
                            onChange={this.handleChange('city')}
                        />
                    </div>
                    <StateDropdownMenu onSelectStateChange={this.onSelectStateChange} />
                    <CountryDropdownMenu onSelectCountryChange={this.onSelectCountryChange} />
                </div>
                <div className="form-group">
                    <label for="inputCell">Phone Number (Optional)</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="inputCell"
                        value={phone} 
                        onChange={this.handleChange('phone')}
                    />
                </div>
                <div className="form-group">
                    <label for="inputState">Account Type</label>
                    <select id="inputState" className="form-control" onChange={this.handleChange('type')}>
                        <option>Choose...</option>
                        {options}
                    </select>
                </div>
                <br/>
                <button 
                    onClick={this.clickSubmit}
                    className='btn btn-raised btn-primary'>
                    Register
                </button>
            </form>
        )
    };

    render() {
        const { name, email, password, type, street, city, state, country, phone, error, open } = this.state;

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

                { this.signUpForm(name, email, password, type, street, city, state, country, phone) }

            </div>
        )
    }
}

export default SignUp;