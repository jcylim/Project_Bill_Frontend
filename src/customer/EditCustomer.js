import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { read, update } from './apiCustomer';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';
import StateDropdownMenu from './StateDropdownMenu';
import IndustryDropdownMenu from './IndustryDropdownMenu';
 
class EditCustomer extends Component {
    constructor() {
        super()
        this.state = {
            id: '',
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
            address: '',
            error: "",
            redirectToCustomer: false,
            loading: false
        }
    }

    init = (companyId, customerId, token) => {
        read(companyId, customerId, token)
        .then(data => {
            if (data.error) {
                this.setState({ redirectToCustomer: true });
            } else {
                this.setState({
                    id: data._id, 
                    type: data.type,
                    name: data.name,
                    about: data.about,
                    email: data.email,
                    address: data.address,
                    tin: data.tin,
                    cell: data.cell,
                    home: data.home,
                    work: data.work,
                    naics: data.naics,
                    industry: data.industry,
                    birthday: data.birthday,
                    error: '',
                    loading: false 
                });

                let street = this.state.address.split(',')[0].trim();
                let city = this.state.address.split(',')[1].trim();
                let state = this.state.address.split(',')[2].trim();
                let country = this.state.address.split(',')[3].trim();

                this.setState({ street, city, state, country });
            }
        });

    };

    componentDidMount() {
        this.companyId = this.props.match.params.companyId;
        const customerId = this.props.match.params.customerId;
        const token = isAuthenticated().token;

        this.init(this.companyId, customerId, token);
    }

    isValid = () => {
        const { name, about, email, street, city, state, country, tin } = this.state;
        if (name.length === 0 || 
            about.length === 0 || 
            email.length === 0 || 
            street.length === 0 || 
            city.length === 0 || 
            state.length === 0 || 
            country.length === 0 || 
            tin.length === 0) {
            this.setState({error: "'Name', 'Description', 'Email', 'Address', and 'SSN/TIN' fields are required", loading: false});
            return false;
        }
        return true; 
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const {
                id,
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
            const token = isAuthenticated().token;
            const companyId = this.companyId;

            const customer = {
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

            update(companyId, id, token, customer)
            .then(data => {
                if (data.error) {
                    this.setState({error: data.error, loading: false});
                } else {
                    this.setState({
                        loading: false, 
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
                        redirectToCustomer: true
                    });
                }
            });
        }
    };

    handlerChange = field => event => {
        this.setState({ error: "" });
        this.setState({ [field]: event.target.value });
    };

    onSelectStateChange = state => {
        this.setState({ state });
    };

    onSelectIndustryChange = industry => {
        this.setState({ industry });
    };

    editCustomerForm = (type, name, about, email, street, city, country, tin, cell, home, work, naics, birthday) => (
        <form>
            {type === 'Individual' ? (
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
                        <div className="form-group col-md-2">
                            <label for="inputCountry">Country</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputCountry" 
                                value={country} 
                                onChange={this.handlerChange('country')}  
                            />
                        </div>
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
                            <label for="inputHome">Home Number</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputHome" 
                                value={home} 
                                onChange={this.handlerChange('home')}  
                            />
                        </div>
                        <div className="form-group col-md-2">
                            <label for="inputBirthday">Birthday</label>
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
                </>
            ) : (
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
                        <div className="form-group col-md-2">
                            <label for="inputCountry">Country</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputCountry" 
                                value={country} 
                                onChange={this.handlerChange('country')}  
                            />
                        </div>
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
                </>
            )}
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
            redirectToCustomer, 
            error,
            loading 
        } = this.state;

        if (redirectToCustomer) {
            return <Redirect to={`/${this.companyId}/customer/${id}`} />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Customer Profile</h2>
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>

                <Loading loading={loading} />

                { this.editCustomerForm(type, name, about, email, street, city, country, tin, cell, home, work, naics, birthday) }
            </div>
        );
    }
}

export default EditCustomer;