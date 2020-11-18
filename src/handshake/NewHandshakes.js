import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// new 
import $ from 'jquery';
import Chart from 'chart.js';

import { listHandshakes, remove } from './apiHandshake';
import { isAuthenticated } from '../auth';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
import { CSVLink } from "react-csv";
import StageBadge from './StageBadge';


class NewHandshakes extends Component {
    constructor() {
        super();
        this.state = {
            handshakes: [],
            selectedHandshake: '',
            error: ''
        }
    }

    componentDidMount() {
        this.companyId = this.props.match.params.companyId;
        console.log(this.props.match);

        if (this.props.location.state) {
            this.userId = this.props.location.state.userId;
            this.stage = this.props.location.state.stage;
        }

        this.setState({ loading: true });
        
        listHandshakes(this.companyId, isAuthenticated().token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ handshakes: data, loading: false });
            }
        })
    }

    deleteHandshake = selectedHandshake => {
        remove(this.companyId, selectedHandshake, isAuthenticated().token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ selectedHandshake: '' })
            }
        });
    };

    deleteHandshakeConfirmation = () => {
        let selectedHandshake = this.state.selectedHandshake;
        
        if (selectedHandshake) {
            let answer = window.confirm("Are you sure you want to delete this handshake?");
            if (answer) {
                this.deleteHandshake(selectedHandshake);
            }
        } else {
            window.alert("Select a handshake first");
        }
    };

    CellFormatter(cell, row) {
        return (
            <div>
                <a href={`/${this.companyId}/handshake/${row._id}`}>{cell}</a>
            </div>
        );
    }

    processHandshakes = handshakes => {
        let processedHandshakes = handshakes;
        if (this.props.location.state) {
            let assignedHandshakes = handshakes.filter(handshake => handshake.assignedTo.some(a => a._id === this.userId));
            if (this.stage) {
                processedHandshakes = assignedHandshakes.filter(handshake => handshake.stage === this.stage);
            } else {
                processedHandshakes = assignedHandshakes.filter(handshake => !(handshake.stage === 'COMPLETED' || handshake.stage === 'WITHDRAWN'));
            }
        }
        return processedHandshakes;
    };

    renderHandshakes = handshakes => {
        const selectOptions = {
            'NOT STARTED': 'NOT STARTED',
            'ASSIGNMENT': 'ASSIGNMENT',
            'IN PROGRESS': 'IN PROGRESS',
            'ON HOLD': 'ON HOLD',
            'APPROVAL': 'APPROVAL',
            'POST APPROVAL': 'POST APPROVAL',
            'COMPLETED': 'COMPLETED'
        };

        const columns = [
            {
                dataField: 'title', 
                text: 'Title',
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
                dataField: 'stage', 
                text: 'Stage', 
                formatter: cell => <StageBadge stage={cell} />,
                // filter: selectFilter({
                //     options: selectOptions
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
                this.setState({ selectedHandshake: row._id });
            }
        };

        return (
            <>
                <div className="col-lg-12 card">
                    <div className="card-header">
                        <h3 className="card-title">Handshakes Information</h3>
                        <div className='row float-right'>
                            <CSVLink
                                data={handshakes}
                                filename={"workflow_handshakes.csv"}
                                className="btn btn-raised btn-info"
                                target="_blank"
                                style={{'font-size': '0.9rem'}}
                            >
                                Export to CSV
                            </CSVLink>
                            <Link
                                to={`/${this.companyId}/handshake/create`}
                                className="btn btn-raised btn-success ml-4 mr-4" style={{'font-size': '0.9rem'}}
                            >
                                Add
                            </Link>
                            <button 
                                className="btn btn-raised btn-danger mr-4"
                                onClick={this.deleteHandshakeConfirmation}
                            >
                                <div style={{'font-size': '0.9rem'}}>
                                    <i 
                                        className="fa fa-trash"
                                        aria-hidden="true"
                                    />{' '}
                                    Delete
                                </div>
                            </button>
                        </div>
                    </div>
                    <BootstrapTable
                        keyField='title'
                        data={ handshakes }
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
        const { handshakes } = this.state;

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
                {handshakes.length === 0 ? (
                    <h3 className="mt-5 mb-5">
                        No handshakes created yet. Please{""} <Link to={`/${this.companyId}/handshake/create`}>create handshake</Link>.
                    </h3>
                ) : (
                    <section className="content-header">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-sm-6">
                                    <h1>Handshakes</h1>
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
                                            <i className="fa fa-square text-primary"></i> This Week Handshakes
                                        </span>

                                        <span>
                                            <i className="fa fa-square text-gray"></i> Last Week Handshakes
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {this.renderHandshakes(this.processHandshakes(handshakes))}
                    </div>
                </section>

            </div>
        );
    }
}

export default NewHandshakes;