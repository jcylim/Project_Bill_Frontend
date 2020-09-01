import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { addCustomer } from './apiCustomer';
import Loading from '../Loading';
import StateDropdownMenu from './StateDropdownMenu';
import CountryDropdownMenu from './CountryDropdownMenu';
import IndustryDropdownMenu from './IndustryDropdownMenu';
 
class NewCustomer extends Component {
    constructor() {
        super()
        this.state = {
            type: '',
            name: '',
            about: '',
            email: '',
            street: '',
            city: '',
            state: '',
            country: '',
            tin: '',
            cell: '',
            home: '',
            work: '',
            naics: '',
            industry: '',
            birthday: '',
            displayMessage: false,
            error: '',
            loading: false
        }
    }

    isValid = () => {
        const { name, about, email } = this.state;
        if (name.length === 0 || about.length === 0 || email.length === 0) {
            this.setState({error: "All fields are required", loading: false});
            return false;
        }
        return true; 
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        const {
            type, 
            name, 
            about, 
            email,
            street,
            city,
            state,
            country,
            tin, 
            cell,
            home,
            work,
            naics,
            industry,
            birthday
        } = this.state;
        const companyId = this.props.match.params.companyId;
        const token = isAuthenticated().token;
        const customer = {
            type, 
            name, 
            about, 
            email,
            street,
            city,
            state,
            country,
            tin, 
            cell,
            home,
            work,
            naics,
            industry,
            birthday
        };

        if (this.isValid()) {
            addCustomer(companyId, token, customer)
            .then(data => {
                if (data.error) this.setState({error: data.error, loading: false})
                else 
                    this.setState({
                        type: '',
                        name: '',
                        about: '',
                        email: '',
                        error: '',
                        street: '',
                        city: '',
                        state: '',
                        country: '',
                        tin: '', 
                        cell: '',
                        home: '',
                        work: '',
                        naics: '',
                        industry: '',
                        birthday: '',
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

    onItemClick = type => {
        this.setState({ type });
    };

    onSelectStateChange = state => {
        this.setState({ state });
    };

    onSelectCountryChange = country => {
        this.setState({ country });
    };

    onSelectIndustryChange = industry => {
        this.setState({ industry });
    };

    newCustomerForm = (type, name, about, email, street, city, country, tin, cell, home, work, naics, birthday) => (
        <form>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="radios" id="radio1" value="option1" onClick={() => {this.onItemClick('Individual')}} />
                <label className="form-check-label" for="radio1">
                    Individual
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="radios" id="radio2" value="option2" onClick={() => {this.onItemClick('Corporation')}} />
                <label className="form-check-label" for="radio2">
                    Corporation
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="radios" id="radio3" value="option3" onClick={() => {this.onItemClick('Non-Profit')}} />
                <label className="form-check-label" for="radio3">
                    Non-Profit
                </label>
            </div>
            <div className="form-check mb-4">
                <input className="form-check-input" type="radio" name="radios" id="radio4" value="option4" onClick={() => {this.onItemClick('Trust')}} />
                <label className="form-check-label" for="radio4">
                    Trust/Estate
                </label>
            </div>
            {type === 'Individual' && (
                <>
                    <div className='form-group'>
                        <label className='text-muted'>Name</label>
                        <input 
                            onChange={this.handlerChange('name')} 
                            type='text' 
                            className='form-control'
                            value={name}
                            placeholder='John Smith'
                        />
                    </div>
                    <div className='form-group'>
                        <label className='text-muted'>Description</label>
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
                    <div className="form-group">
                        <label for="inputAddress">Address</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="inputAddress" 
                            placeholder="e.g. 1234 Main St"
                            value={street} 
                            onChange={this.handlerChange('street')} 
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
                                onChange={this.handlerChange('city')}  
                            />
                        </div>
                        <StateDropdownMenu onSelectStateChange={this.onSelectStateChange} />
                        <CountryDropdownMenu onSelectCountryChange={this.onSelectCountryChange} />
                        {/* <div className="form-group col-md-2">
                            <label for="inputCountry">Country</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputCountry" 
                                value={country} 
                                onChange={this.handlerChange('country')}  
                            />
                        </div> */}
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-2">
                            <label for="inputSocial">SSN</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputSocial"
                                value={tin} 
                                onChange={this.handlerChange('tin')}  
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label for="inputCell">Cell Number</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputCell"
                                value={cell} 
                                onChange={this.handlerChange('cell')}   
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label for="inputHome">Home Number (Optional)</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputHome" 
                                value={home} 
                                onChange={this.handlerChange('home')}  
                            />
                        </div>
                        <div className="form-group col-md-2">
                            <label for="inputBirthday">Birthday (Optional)</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputBirthday"
                                placeholder='yyyy/mm/dd'
                                value={birthday} 
                                onChange={this.handlerChange('birthday')}   
                            />
                        </div>
                    </div>
                    <button 
                        onClick={this.clickSubmit}
                        className='btn btn-raised btn-primary mr-4'>
                        Create
                    </button>
                </>
            )}
            {(type === 'Corporation' || type === 'Non-Profit' || type === 'Trust') && (
                <>
                    <div className='form-group'>
                        <label className='text-muted'>Organization Name</label>
                        <input 
                            onChange={this.handlerChange('name')} 
                            type='text' 
                            className='form-control'
                            value={name}
                        />
                    </div>
                    <div className='form-group'>
                        <label className='text-muted'>Description</label>
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
                    <div className="form-group">
                        <label for="inputAddress">Address</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="inputAddress" 
                            placeholder="e.g. 1234 Main St"
                            value={street} 
                            onChange={this.handlerChange('street')} 
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
                                onChange={this.handlerChange('city')}  
                            />
                        </div>
                        <StateDropdownMenu onSelectStateChange={this.onSelectStateChange} />
                        <CountryDropdownMenu onSelectCountryChange={this.onSelectCountryChange} />
                        {/* <div className="form-group col-md-2">
                            <label for="inputCountry">Country</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputCountry" 
                                value={country} 
                                onChange={this.handlerChange('country')}  
                            />
                        </div> */}
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-2">
                            <label for="inputSocial">TIN</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputSocial"
                                value={tin} 
                                onChange={this.handlerChange('tin')}  
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label for="inputCell">Work Number</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputCell"
                                value={work} 
                                onChange={this.handlerChange('work')}   
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label for="inputCell">Cell Number (Optional)</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputCell"
                                value={cell} 
                                onChange={this.handlerChange('cell')}   
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-3">
                            <label for="inputNaics">NAICS Code</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputNaics" 
                                value={naics} 
                                onChange={this.handlerChange('naics')}   
                            />
                        </div>
                        <IndustryDropdownMenu onSelectIndustryChange={this.onSelectIndustryChange} />
                    </div>
                    <button 
                        onClick={this.clickSubmit}
                        className='btn btn-raised btn-primary mr-4'>
                        Create
                    </button>
                </>
            )}
        </form>
    );

    render() {
        const {
            type, 
            name, 
            about,
            email,
            street, 
            city,
            country,
            tin,
            cell,
            home,
            work,
            naics,
            birthday,
            displayMessage,
            error,
            loading 
        } = this.state;
        
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create New Customer Profile</h2>
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
                    New customer profile has been created successfully.
                </div>

                { this.newCustomerForm(type, name, about, email, street, city, country, tin, cell, home, work, naics, birthday) }
            </div>
        );
    }
}

export default NewCustomer;