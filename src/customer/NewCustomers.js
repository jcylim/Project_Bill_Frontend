import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// new 
import $ from 'jquery';
import Chart from 'chart.js';

import { listCustomers, removeCustomer } from './apiCustomer';
import { isAuthenticated } from '../auth';
import { typeSelectOptions, industrySelectOptions } from './CustomerSelectOptions';
import CustomerCSVReader from './CustomerCSVReader';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { CSVLink } from "react-csv";

class NewCustomers extends Component {
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
                        <span>&nbsp;&nbsp;<i className="fa fa-arrow-circle-up" aria-hidden="true"/> <i className="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i className="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i className="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'email', 
                text: 'Email', 
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i className="fa fa-arrow-circle-up" aria-hidden="true"/> <i className="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i className="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i className="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'type', 
                text: 'Type', 
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i className="fa fa-arrow-circle-up" aria-hidden="true"/> <i className="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i className="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i className="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'address', 
                text: 'Address', 
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i className="fa fa-arrow-circle-up" aria-hidden="true"/> <i className="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i className="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i className="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'tin', 
                text: 'SSN/TIN', 
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i className="fa fa-arrow-circle-up" aria-hidden="true"/> <i className="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i className="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i className="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'work', 
                text: 'Work Number', 
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i className="fa fa-arrow-circle-up" aria-hidden="true"/> <i className="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i className="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i className="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'cell', 
                text: 'Cell Number', 
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i className="fa fa-arrow-circle-up" aria-hidden="true"/> <i className="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i className="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i className="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
                    );
                    return null;
                }
            }, {
                dataField: 'naics', 
                text: 'NAICS Code', 
                sort: true,
                sortCaret: (order, column) => {
                    if (!order) return (
                        <span>&nbsp;&nbsp;<i className="fa fa-arrow-circle-up" aria-hidden="true"/> <i className="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i className="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i className="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
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
                        <span>&nbsp;&nbsp;<i className="fa fa-arrow-circle-up" aria-hidden="true"/> <i className="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i className="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i className="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
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
                        <span>&nbsp;&nbsp;<i className="fa fa-arrow-circle-up" aria-hidden="true"/> <i className="fa fa-arrow-circle-down" aria-hidden="true"/></span>
                    );
                    else if (order === 'asc') return (
                        <span>&nbsp;&nbsp;<font color="green"><i className="fa fa-arrow-circle-up" aria-hidden="true"/></font></span>
                    );
                    else if (order === 'desc') return (
                        <span>&nbsp;&nbsp;<font color="red"><i className="fa fa-arrow-circle-down" aria-hidden="true"/></font></span>
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
                <div className="col-lg-12 card">
                    <div className="card-header">
                        <h3 className="card-title">Customers Information</h3>
                        <div className='row float-right'>
                            <CSVLink
                                data={customers}
                                filename={"workflow_customers.csv"}
                                className="btn btn-raised btn-info"
                                target="_blank"
                                style={{'font-size': '0.9rem'}}
                            >
                                Export to CSV
                            </CSVLink>
                            <Link
                                to={`/${this.companyId}/customer/create`}
                                className="btn btn-raised btn-success ml-4 mr-4"
                                style={{'font-size': '0.9rem'}}
                            >
                                Add
                            </Link>
                            {isAuthenticated().company && (
                                <button 
                                    className="btn btn-raised btn-danger mr-2"
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
                    </div>
                    <BootstrapTable
                        keyField='name'
                        data={ customers }
                        columns={ columns }
                        pagination={ paginationFactory() }
                        filter={ filterFactory() }
                        selectRow={ selectRow }
                    />
                </div>
            </>
        );
    };

    render() {
        const { customers } = this.state;
        
        var ticksStyle = {
            fontColor: '#495057',
            fontStyle: 'bold'
        }
        var mode = 'index'
        var intersect = true
        var $visitorsChart = $('#visitors-chart')
        var visitorsChart  = new Chart($visitorsChart, {
            data   : {
            labels  : ['18th', '20th', '22nd', '24th', '26th', '28th', '30th'],
            datasets: [{
                type                : 'line',
                data                : [100, 120, 170, 167, 180, 177, 160],
                backgroundColor     : 'transparent',
                borderColor         : '#007bff',
                pointBorderColor    : '#007bff',
                pointBackgroundColor: '#007bff',
                fill                : false
                // pointHoverBackgroundColor: '#007bff',
                // pointHoverBorderColor    : '#007bff'
            },
                {
                type                : 'line',
                data                : [60, 80, 70, 67, 80, 77, 100],
                backgroundColor     : 'tansparent',
                borderColor         : '#ced4da',
                pointBorderColor    : '#ced4da',
                pointBackgroundColor: '#ced4da',
                fill                : false
                // pointHoverBackgroundColor: '#ced4da',
                // pointHoverBorderColor    : '#ced4da'
                }]
            },
            options: {
                maintainAspectRatio: false,
                tooltips           : {
                    mode     : mode,
                    intersect: intersect
                },
                hover              : {
                    mode     : mode,
                    intersect: intersect
                },
                legend             : {
                    display: false
                },
                scales             : {
                    yAxes: [{
                    // display: false,
                    gridLines: {
                        display      : true,
                        lineWidth    : '4px',
                        color        : 'rgba(0, 0, 0, .2)',
                        zeroLineColor: 'transparent'
                    },
                    ticks    : $.extend({
                        beginAtZero : true,
                        suggestedMax: 200
                    }, ticksStyle)
                    }],
                    xAxes: [{
                    display  : true,
                    gridLines: {
                        display: false
                    },
                    ticks    : ticksStyle
                    }]
                }
            }
        });

        return (
            <div className='content-wrapper'>
                {customers.length === 0 ? (
                    <h3 className="mt-5 mb-5">
                        No customers profiles created to company yet. Please{""} <Link to={`/${this.companyId}/customer/create`}>create profile for customer</Link>.
                    </h3>
                ) : (
                    <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1>Customers</h1>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
                <section className="content">
                    <div className="container-fluid">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header border-0">
                                    <div className="d-flex justify-content-between">
                                        <h3 className="card-title">Quick Statistics</h3>
                                    </div>
                                </div>
                                <div className="card-body">

                                    <div className="position-relative mb-4">
                                        <canvas id="visitors-chart" height="200"></canvas>
                                    </div>

                                    <div className="d-flex flex-row justify-content-end">
                                        <span className="mr-2">
                                            <i className="fa fa-square text-primary"></i> This Week Tenants
                                        </span>

                                        <span>
                                            <i className="fa fa-square text-gray"></i> Last Week Tenants
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <CustomerCSVReader companyId={this.companyId} token={isAuthenticated().token}/>
                        <br/>
                        {this.renderCustomers(customers)}
                    </div>
                </section>
            </div>
        );
    }
}

export default NewCustomers;