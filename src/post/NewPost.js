import React, { Component } from 'react';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { isAuthenticated } from '../auth';
import { checkOnboardStatus, onboardPayment } from '../user/apiUser';
import { create } from './apiPost';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
 
class NewPost extends Component {
    constructor() {
        super()
        this.state = {
            title: '',
            body: '',
            price: '',
            address: '',
            coordinates: {lat: null, lng: null},
            photo: '',
            fileSize: 0,
            user: {},
            isStripeOnboarded: false,
            redirectToProfile: false,
            error: ''
        }
    }

    componentDidMount() {
        this.postData = new FormData();
        this.setState({ user: isAuthenticated().user });
        this.checkIfOnboarded(isAuthenticated().user._id);
    }

    setUpPayment = userId => {
        const token = isAuthenticated().token;
        onboardPayment(userId, token)
        .then(data => {
            if (data.error) {
                this.setState({error: data.error});
            } else {
                window.location.href = data.url;
            }
        });
    };

    checkIfOnboarded = userId => {
        const token = isAuthenticated().token;

        checkOnboardStatus(userId, token)
        .then(data => {
            if (data.error) {
                this.setState({error: data.error});
            } else {
                this.setState({ isStripeOnboarded: data.isOnboarded });
            }
        })
    };

    isValid = () => {
        const { title, body, price, fileSize } = this.state;
        if (fileSize > 10000000) {
            this.setState({error: "File size should be less than 10MB", loading: false});
            return false;
        }
        if (title.length === 0 || body.length === 0 || price.length === 0) {
            this.setState({error: "Title, body, and price fields are required", loading: false});
            return false;
        }
        return true; 
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;

            create(userId, token, this.postData)
            .then(data => {
                if (data.error) {
                    this.setState({error: data.error, loading: false});
                } else {
                    this.setState({
                        loading: false, 
                        title: '', 
                        body: '',
                        price: '',
                        address: '',
                        coordinates: {},
                        redirectToProfile: true
                    });
                }
            });
        }
    };

    handlerChange = field => event => {
        this.setState({ error: "" });
        const value = field === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = field === 'photo' ? event.target.files[0].size : 0;
        this.postData.set(field, value);
        this.setState({ [field]: value, fileSize });
    };

    onAddressChange = value => {
        this.setState({ error: "" });
        this.postData.set("address", value);
        this.setState({ ["address"]: value });
    };

    onAddressSelect = async value => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);

        this.setState({ error: "" });
        this.postData.set("lat", latLng.lat);
        this.postData.set("lng", latLng.lng);
        this.setState({ ["coordinates"]: latLng });

        this.onAddressChange(value);
    };

    newPostForm = (title, body, price, address) => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Post Photo</label>
                <input 
                    onChange={this.handlerChange('photo')} 
                    type='file'
                    accept='image/*'
                    className='form-control'
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Title<span style={{color: 'red'}}>*</span></label>
                <input 
                    onChange={this.handlerChange('title')} 
                    type='text' 
                    className='form-control'
                    value={title}
                    placeholder='e.g. Home-grown apples'
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Body<span style={{color: 'red'}}>*</span></label>
                <textarea 
                    onChange={this.handlerChange('body')} 
                    type='text' 
                    className='form-control'
                    value={body}
                    placeholder='Brief description of the produce selling, quantity, and pick-up/delivery details'
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Price<span style={{color: 'red'}}>*</span> <span style={{color: 'red'}}>(fixed convenience fee of $1.23 per transaction)</span></label>
                <input 
                    onChange={this.handlerChange('price')} 
                    type='text' 
                    className='form-control'
                    value={price}
                    placeholder='e.g. 5, 6.5, 4.39'
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Pickup Location</label>
                <PlacesAutocomplete
                    value={address}
                    onChange={this.onAddressChange}
                    onSelect={this.onAddressSelect}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                        <>
                            <input 
                                {...getInputProps({
                                    type: 'text', 
                                    className: 'form-control',
                                    placeholder: 'Enter pickup location...'
                                })}
                            />
                            
                            <div className="autocomplete-dropdown-container">
                                {loading ? <div>...loading</div> : null}

                                {suggestions.map(suggestion => {
                                    const className = suggestion.active
                                        ? 'suggestion-item--active'
                                        : 'suggestion-item';
                                    
                                        // inline style for demonstration purpose
                                    const style = suggestion.active
                                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                        : { backgroundColor: '#ffffff', cursor: 'pointer' };

                                    return (
                                        <div
                                            {...getSuggestionItemProps(suggestion, {
                                                className,
                                                style,
                                            })}
                                        >
                                            <LocationOnIcon />
                                            <span>{suggestion.description}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </PlacesAutocomplete>
            </div>
            <button 
                onClick={this.clickSubmit}
                className='btn btn-raised btn-primary'>
                Create
            </button>
        </form>
    );

    render() {
        const { 
            title, 
            body,
            price,
            address,
            user,
            redirectToProfile,
            isStripeOnboarded,
            error,
            loading 
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create New Post</h2>
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>

                <Loading loading={loading} />

                {!user.stripeAccountId ? (
                    <button 
                        onClick={() => this.setUpPayment(user._id)} 
                        className="btn btn-lg btn-outline-secondary"
                        >
                            Set Up Payment
                    </button>
                ) : (
                    <>
                        {!isStripeOnboarded ? (
                            <button 
                                onClick={() => this.setUpPayment(user._id)} 
                                className="btn btn-lg btn-outline-warning"
                                >
                                    Complete Payment Onboarding
                            </button>
                        ) : this.newPostForm(title, body, price, address)}
                    </>
                )}
            </div>
        );
    }
}

export default NewPost;