import React, { Component } from 'react';
import { signUp } from '../auth';
import { Link } from 'react-router-dom';
import StateDropdownMenu from './StateDropdownMenu';
import CountryDropdownMenu from './CountryDropdownMenu';

class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            first_name: '',
            last_name: '',
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
        console.log("checked");
        return true; 
    };

    clickSubmit = event => {
        event.preventDefault();
        const { first_name, last_name, email, password, type, street, city, state, country, phone} = this.state;
        const user = {
            first_name,
            last_name,
            email,
            password,
            type,
            street,
            city,
            state,
            country,
            phone
        };

        if (this.isAddressValid()) {
            signUp(user)
            .then(data => {
                if (data.error) this.setState({error: data.error})
                else 
                    this.setState({
                        first_name: '',
                        last_name: '',
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
        }
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

    signUpForm = (first_name, last_name, email, password, street, city, phone) => {
        let types = [
            'Consumer',
            'Local Food Supplier'
        ];

        let options = types.map((type, i) =>
            <option key={i}>
                {type}
            </option>
        );

        return (
            <form>
                <div className="form-row">
                    <div className='form-group col'>
                        <label className='text'>First Name<span style={{color: 'red'}}>*</span></label>
                        <input 
                            onChange={this.handleChange('first_name')} 
                            type='text'
                            className='form-control'
                            value={first_name}
                        />
                    </div>
                    <div className='form-group col'>
                        <label className='text'>Last Name<span style={{color: 'red'}}>*</span></label>
                        <input 
                            onChange={this.handleChange('last_name')} 
                            type='text'
                            className='form-control'
                            value={last_name}
                        />
                    </div>
                </div>
                <div className='form-group'>
                    <label className='text'>Email<span style={{color: 'red'}}>*</span></label>
                    <input 
                        onChange={this.handleChange('email')} 
                        type='email' 
                        className='form-control'
                        value={email}
                    />
                </div>
                <div className='form-group'>
                    <label className='text'>Password<span style={{color: 'red'}}>*</span></label>
                    <input 
                        onChange={this.handleChange('password')} 
                        type='password' 
                        className='form-control'
                        value={password}
                    />
                </div>
                <div className="form-group">
                    <label for="inputAddress">Address<span style={{color: 'red'}}>*</span></label>
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
                        <label for="inputCity">City<span style={{color: 'red'}}>*</span></label>
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
                    <label for="inputCell">Phone Number</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="inputCell"
                        value={phone} 
                        onChange={this.handleChange('phone')}
                    />
                </div>
                <div className="form-group">
                    <label for="inputState">Account Type<span style={{color: 'red'}}>*</span></label>
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
        const { first_name, last_name, email, password, street, city, phone, error, open } = this.state;

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

                { this.signUpForm(first_name, last_name, email, password, street, city, phone) }

            </div>
        )
    }
}

export default SignUp;