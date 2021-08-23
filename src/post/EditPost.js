import React, { Component } from 'react';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { isAuthenticated } from '../auth';
import { singlePost, update } from './apiPost';
import DefaultPost from '../img/postPic.jpg';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';
 
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

class EditPost extends Component {
    constructor() {
        super()
        this.state = {
            id: '',
            title: '',
            body: '',
            price: 0,
            address: '',
            coordinates: {lat: null, lng: null},
            error: "",
            fileSize: 0,
            redirectToPost: false,
            loading: false
        }
    }

    init = postId => {
        singlePost(postId)
        .then(data => {
            if (data.error) {
                this.setState({ redirectToPost: true });
            } else {
                this.setState({
                    id: data._id, 
                    title: data.title,
                    body: data.body,
                    price: data.price,
                    address: data.address ? data.address.text : '',
                    coordinates: data.address ? data.address.coordinates : {},
                    error: '',
                    loading: false 
                });
            }
        });
    };

    componentDidMount() {
        this.postData = new FormData();
        const postId = this.props.match.params.postId;
        this.init(postId);
    }

    isValid = () => {
        const { title, body, fileSize } = this.state;
        if (fileSize > 10000000) {
            this.setState({error: "File size should be less than 10MB", loading: false});
            return false;
        }
        if (title.length === 0 || body.length === 0) {
            this.setState({error: "All fields are required", loading: false});
            return false;
        }
        return true; 
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const postId = this.state.id;
            const token = isAuthenticated().token;

            update(postId, token, this.postData)
            .then(data => {
                if (data.error) {
                    this.setState({error: data.error});
                } else {
                    this.setState({
                        loading: false, 
                        title: '', 
                        body: '',
                        price: 0,
                        address: '',
                        coordinates: {},
                        redirectToPost: true
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

    editPostForm = (title, body, price, address) => (
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
                <label className='text-muted'>Title</label>
                <input 
                    onChange={this.handlerChange('title')} 
                    type='text' 
                    className='form-control'
                    value={title}
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Body</label>
                <textarea 
                    onChange={this.handlerChange('body')} 
                    type='text' 
                    className='form-control'
                    value={body}
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Price</label>
                <input 
                    onChange={this.handlerChange('price')} 
                    type='text' 
                    className='form-control'
                    value={price}
                    placeholder='Default price is $0'
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
                Update
            </button>
        </form>
    );

    render() {
        const { 
            id,
            title, 
            body, 
            price,
            address,
            redirectToPost, 
            error,
            loading 
        } = this.state;

        if (redirectToPost) {
            return <Redirect to={`/post/${id}`} />;
        }

        const photoUrl = `${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Post</h2>
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>

                <Loading loading={loading} />

                <img 
                    src={photoUrl}
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    alt={title} 
                    style={{height: '200px', width: 'auto'}}
                    className='img-thumbnail'
                />

                { this.editPostForm(title, body, price, address) }
            </div>
        );
    }
}

export default EditPost;