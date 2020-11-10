import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { listCustomers, removeCustomer } from './apiCustomer';
import { isAuthenticated } from '../auth';
import { typeSelectOptions, industrySelectOptions } from './CustomerSelectOptions';
import CustomerCSVReader from './CustomerCSVReader';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { CSVLink } from "react-csv";

class Customers extends Component {
    constructor() {
        super();
        this.state = {
            customers: [],
            selectedCustomer: '',
            error: ''
        }
    }

    componentDidMount() {
        this.companyId = this.props.match.params.companyId;

        listCustomers(this.companyId, isAuthenticated().token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ customers: data });
            }
        })
    }

    removeCustomerSubmit = selectedCustomer => {
        const token = isAuthenticated().token;

        removeCustomer(this.companyId, selectedCustomer, token)
        .then(data => {
            if (data.error) this.setState({ error: data.error })
            else 
                this.setState({
                    error: '',
                    selectedCustomer: ''
                })
        });
    };

    removeCustomerSubmitConfirmation = () => {
        let selectedCustomer = this.state.selectedCustomer;
        
        if (selectedCustomer) {
            let answer = window.confirm("Are you sure you want to delete this customer profile?");
            if (answer) {
                this.removeCustomerSubmit(selectedCustomer);
            }
        } else {
            window.alert("Select a customer first");
        }
    };

    CellFormatter(cell, row) {
        return (
            <div>
                <a href={`/${this.companyId}/customer/${row._id}`}>{cell}</a>
            </div>
        );
    }

    renderCustomers = customers => {
        const columns = [
            {
                dataField: 'name', 
                text: 'Name', 
                formatter: (cell, row) => this.CellFormatter(cell, row),
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i class="fa fa-arrow-circle-up" aria-hidden="true"/> <i class="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i class="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i class="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'email', 
                text: 'Email', 
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i class="fa fa-arrow-circle-up" aria-hidden="true"/> <i class="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i class="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i class="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'type', 
                text: 'Type', 
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i class="fa fa-arrow-circle-up" aria-hidden="true"/> <i class="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i class="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i class="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'address', 
                text: 'Address', 
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i class="fa fa-arrow-circle-up" aria-hidden="true"/> <i class="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i class="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i class="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'tin', 
                text: 'SSN/TIN', 
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i class="fa fa-arrow-circle-up" aria-hidden="true"/> <i class="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i class="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i class="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'work', 
                text: 'Work Number', 
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i class="fa fa-arrow-circle-up" aria-hidden="true"/> <i class="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i class="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i class="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'cell', 
                text: 'Cell Number', 
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i class="fa fa-arrow-circle-up" aria-hidden="true"/> <i class="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i class="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i class="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'naics', 
                text: 'NAICS Code', 
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i class="fa fa-arrow-circle-up" aria-hidden="true"/> <i class="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i class="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i class="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'industry', 
                text: 'Industry', 
                // formatter: cell => industrySelectOptions[cell],
                // filter: selectFilter({
                //     options: industrySelectOptions
                // })
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i class="fa fa-arrow-circle-up" aria-hidden="true"/> <i class="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i class="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i class="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'created', 
                text: 'Date Created', 
                sort: true,
                formatter: cell => cell.substring(0,10),
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i class="fa fa-arrow-circle-up" aria-hidden="true"/> <i class="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i class="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i class="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }
        ]; 

        const selectRow = {
            mode: 'radio',
            clickToSelect: true,
            style: { backgroundColor: '#c8e6c9'},
            onSelect: row => {
                this.setState({ selectedCustomer: row._id });
            }
        };

        return (
            <>
                <div className='row'>
                    <CSVLink
                        data={customers}
                        filename={"workflow_customers.csv"}
                        className="btn btn-raised btn-info"
                        target="_blank"
                    >
                        Export to CSV
                    </CSVLink>
                    <Link
                        to={`/${this.companyId}/customer/create`}
                        className="btn btn-raised btn-success ml-4 mr-4"
                    >
                        Add
                    </Link>
                    {isAuthenticated().company && (
                        <button 
                            className="btn btn-raised btn-danger"
                            onClick={this.removeCustomerSubmitConfirmation}
                        >
                            <div style={{'font-size': '0.9rem'}}>
                                <i 
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                />{' '}
                                Delete
                            </div>
                        </button>
                    )}
                </div>
                <br/>
                <BootstrapTable
                    keyField='name'
                    data={ customers }
                    columns={ columns }
                    pagination={ paginationFactory() }
                    filter={ filterFactory() }
                    selectRow={ selectRow }
                />
            </>
        );

        // <div className="row">
        //     {customers.map((customer, i) => (
        //             <div className="card col-md-4" style={{width: "18rem"}} key={i}>
        //                 <div className="card-body">
        //                     <h5 className="card-title">{customer.name}</h5>
        //                     <p className="card-text">
        //                         {customer.email}
        //                     </p>
        //                     <p className="card-text">
        //                         Type: {customer.type}
        //                     </p>
        //                     <p className="card-text">
        //                         Address: {customer.address}
        //                     </p>
        //                     <Link 
        //                         to={`/${customer.company}/customer/${customer._id}`}
        //                         className="btn btn-raised btn-primary btn-sm"
        //                     >
        //                         View Profile
        //                     </Link>
        //                 </div>
        //             </div>
        //         )
        //     )}
        // </div>
    };

    render() {
        const { customers } = this.state; 
        return (
            <div>
                {customers.length === 0 ? (
                    <h3 className="mt-5 mb-5">
                        No customers profiles created to company yet. Please{""} <Link to={`/${this.companyId}/customer/create`}>create profile for customer</Link>.
                    </h3>
                ) : (
                    <h3 className="mt-5 mb-5">
                        {!customers.length ? 'Loading...' : 'Customers'}
                    </h3>
                )}
                <CustomerCSVReader companyId={this.companyId} token={isAuthenticated().token}/>
                <br/>
                {this.renderCustomers(customers)}
            </div>
        );
    }
}

export default Customers;