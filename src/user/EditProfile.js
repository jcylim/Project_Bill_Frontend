import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser';
import DefaultProfile from '../img/avatar.png';
import { Redirect } from 'react-router-dom';
import Loading from '../Loading';
import StateDropdownMenu from './StateDropdownMenu';
import CountryDropdownMenu from './CountryDropdownMenu';
 
class EditProfile extends Component {
    constructor() {
        super()
        this.state = {
            id: "",
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            type: "",
            address: "",
            street: "",
            city: "",
            state: "",
            country: "",
            phone: "",
            error: "",
            fileSize: 0,
            redirectToProfile: false,
            loading: false
        }
    }

    init = userId => {
        read(userId, isAuthenticated().token)
        .then(data => {
            if(data.error) {
                this.setState({ redirectToSignIn: true });
            } else {
                this.setState({ 
                    id: data._id, 
                    first_name: data.first_name,
                    last_name: data.last_name, 
                    email: data.email,
                    address: data.address,
                    phone: data.phone,
                    error: "" 
                });
                
                if (this.state.address) {
                    let street = this.state.address.split(',')[0].trim();
                    let city = this.state.address.split(',')[1].trim();
                    let state = this.state.address.split(',')[2].trim();
                    let country = this.state.address.split(',')[3].trim();

                    this.setState({ street, city, state, country });
                }

            }
        })
    };

    componentDidMount() {
        this.userData = new FormData();
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    isValid = () => {
        const { first_name, last_name, email, password, fileSize } = this.state;
        if (fileSize > 100000) {
            this.setState({error: "File size should be less than 100KB", loading: false});
            return false;
        }
        if (first_name.length === 0) {
            this.setState({error: "First name is required", loading: false});
            return false;
        }
        if (last_name.length === 0) {
            this.setState({error: "Last name is required", loading: false});
            return false;
        }
        // email@domain.com
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            this.setState({error: "Valid email is required", loading: false});
            return false;
        } 
        if (password.length >= 1 && password.length <= 5) {
            this.setState({error: "Password must be at least 6 characters long", loading: false});
            return false;
        }
        return true; 
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const { id } = this.state;
            update(id, isAuthenticated().token, this.userData)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error, loading: false });
                } else {
                    updateUser(data, () => {
                        this.setState({
                            redirectToProfile: true
                        })
                    });
                }
            });
        }
    };

    handlerChange = field => event => {
        this.setState({ error: "" });
        const value = field === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = field === 'photo' ? event.target.files[0].size : 0;
        this.userData.set(field, value);
        this.setState({ [field]: value, fileSize });
    };

    onSelectStateChange = state => {
        this.userData.set("state", state);
        this.setState({ ["state"]: state });
    };

    onSelectCountryChange = country => {
        this.userData.set("country", country);
        this.setState({ ["country"]: country });
    };

    editForm = (first_name, last_name, email, password, street, city, phone) => {
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
                <div className='form-group'>
                    <label className='text-muted'>Profile Photo</label>
                    <input 
                        onChange={this.handlerChange('photo')} 
                        type='file'
                        accept='image/*'
                        className='form-control'
                    />
                </div>
                <div className="form-row">
                    <div className='form-group col'>
                        <label className='text-muted'>First Name</label>
                        <input 
                            onChange={this.handlerChange('first_name')} 
                            type='text' 
                            className='form-control'
                            value={first_name}
                        />
                    </div>
                    <div className='form-group col'>
                        <label className='text-muted'>Last Name</label>
                        <input 
                            onChange={this.handlerChange('last_name')} 
                            type='text'
                            className='form-control'
                            value={last_name}
                        />
                    </div>
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
                </div>
                <div className="form-group">
                    <label for="inputCell">Phone Number</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="inputCell"
                        value={phone} 
                        onChange={this.handlerChange('phone')}
                    />
                </div>
                <div className="form-group">
                    <label for="inputState">Account Type</label>
                    <select id="inputState" className="form-control" onChange={this.handlerChange('type')}>
                        <option>Choose...</option>
                        {options}
                    </select>
                </div>
                <br/>
                <button 
                    onClick={this.clickSubmit}
                    className='btn btn-raised btn-primary'>
                    Update
                </button>
            </form>
        );
    };

    render() {
        const { 
            id, 
            first_name,
            last_name, 
            email, 
            password, 
            street, 
            city, 
            phone,
            redirectToProfile, 
            error,
            loading 
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />;
        }

        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile;

        return (
            <div className="container mb-5">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                <div 
                    className='alert alert-danger'
                    style={{ display: error ? '' : 'none'}}
                >
                    {error}
                </div>

                <Loading loading={loading} />

                <img 
                    src={photoUrl}
                    onError={i => (i.target.src = `${DefaultProfile}`)}
                    alt={first_name} 
                    style={{height: '200px', width: 'auto'}}
                    className='img-thumbnail'
                />

                { this.editForm(first_name, last_name, email, password, street, city, phone) }
                <br/>
            </div>
        );
    }
}

export default EditProfile;