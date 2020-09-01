import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { listCustomers } from '../customer/apiCustomer';
import { isAuthenticated } from '../auth';

class CustomersSearch extends Component {
    constructor() {
        super();
        this.state = {
            customers: [],
            input: '',
            loading: false
        }
    }

    init = () => {
        this.companyId = this.props.match.params.companyId;
        this.setState({ 
            input: this.props.location.state.input,
            loading: true 
        });

        listCustomers(this.companyId, isAuthenticated().token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ 
                    customers: data, 
                    loading: false
                });
            }
        })
    };

    componentDidMount() {
        this.init();
    }

    componentDidUpdate(prevProps) {
        if (!(this.props.location.state.input === prevProps.location.state.input)) {
            this.init();
        }
    }

    filterCustomers = (customers, input) => {
        let filteredCustomers =  customers.filter(customer => {
            let isTin = customer.tin.toLowerCase().includes(input.toLowerCase());
            let isName = customer.name.toLowerCase().includes(input.toLowerCase());
            return isTin || isName;
        });

        return filteredCustomers;
    };

    renderCustomers = customers => {
        return (
            <div className="row">
                {customers.map((customer, i) => {
                    return (
                        <div className="card col-md-4" style={{width: "18rem"}} key={i}>
                            <div className="card-body">
                                <h5 className="card-title">{customer.name}</h5>
                                <h5 className="card-title">{customer.email}</h5>
                                <h5 className="card-title">{customer.tin}</h5>
                                <br/>
                                <Link 
                                    to={`/${this.companyId}/customer/${customer._id}`}
                                    className="btn btn-raised btn-primary btn-sm"
                                >
                                    Expand
                                </Link>
                                
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        const { customers, input } = this.state;

        if (!input && this.companyId) {
            return <Redirect to={`/${this.companyId}/dashboard`} />;
        }

        return (
            <div className="container">
                {!customers.length ? (
                    <h3 className="mt-5 mb-5">
                        Loading...
                    </h3>
                ) : (
                    <>
                        <h3 className="mt-5 mb-5">
                            Search Results
                            <hr/>
                        </h3>
                        {this.renderCustomers(this.filterCustomers(customers, input))}
                    </>
                )}

            </div>
        );
    }
}

export default CustomersSearch;