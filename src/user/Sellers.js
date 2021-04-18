import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { listChefs, listFoodSuppliers } from './apiUser';
import DefaultProfile from '../img/avatar.png';

class Sellers extends Component {
    constructor() {
        super();
        this.state = {
            chefs: [],
            foodSuppliers: []
        }
    }

    componentDidMount() {
        listChefs().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ chefs: data });
            }
        })

        listFoodSuppliers().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ foodSuppliers: data });
            }
        })
    }

    renderChefs = chefs => (
        <div className="row">
            {chefs.map((chef, i) => (
                    <div className="card col-md-4" style={{width: "18rem"}} key={i}>
                        <img 
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${chef._id}?${new Date().getTime()}`}
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            alt={chef.name} 
                            style={{height: '200px', width: 'auto'}}
                            className='img-thumbnail'
                        />
                        <div className="card-body">
                            <h5 className="card-title">{chef.name}</h5>
                            <p className="card-text">
                                {chef.email}
                            </p>
                            <Link 
                                to={`/user/${chef._id}`}
                                className="btn btn-raised btn-primary btn-sm"
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>
                )
            )}
        </div>
    );

    renderFoodSuppliers = foodSuppliers => (
        <div className="row">
            {foodSuppliers.map((foodSupplier, i) => (
                    <div className="card col-md-4" style={{width: "18rem"}} key={i}>
                        <img 
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${foodSupplier._id}?${new Date().getTime()}`}
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            alt={foodSupplier.name} 
                            style={{height: '200px', width: 'auto'}}
                            className='img-thumbnail'
                        />
                        <div className="card-body">
                            <h5 className="card-title">{foodSupplier.name}</h5>
                            <p className="card-text">
                                {foodSupplier.email}
                            </p>
                            <Link 
                                to={`/user/${foodSupplier._id}`}
                                className="btn btn-raised btn-primary btn-sm"
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>
                )
            )}
        </div>
    );

    render() {
        const { chefs, foodSuppliers } = this.state; 
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Home-Chefs</h2>
                {this.renderChefs(chefs)}
                <h2 className="mt-5 mb-5">Local Food Suppliers</h2>
                {this.renderFoodSuppliers(foodSuppliers)}
            </div>
        );
    }
}

export default Sellers;