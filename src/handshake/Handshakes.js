import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { listHandshakes, remove } from './apiHandshake';
import { isAuthenticated } from '../auth';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
import { CSVLink } from "react-csv";
import StageBadge from './StageBadge';


class Handshakes extends Component {
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
                <div className='row'>
                    <CSVLink
                        data={handshakes}
                        filename={"workflow_handshakes.csv"}
                        className="btn btn-raised btn-info"
                        target="_blank"
                    >
                        Export to CSV
                    </CSVLink>
                    <Link
                        to={`/${this.companyId}/handshake/create`}
                        className="btn btn-raised btn-success ml-4 mr-4"
                    >
                        Add
                    </Link>
                    <button 
                        className="btn btn-raised btn-danger"
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
                <br/>
                <BootstrapTable
                    keyField='title'
                    data={ handshakes }
                    columns={ columns }
                    pagination={ paginationFactory() }
                    filter={ filterFactory() }
                    selectRow={ selectRow }
                />
            </>
        );
    };

    render() {
        const { handshakes } = this.state;
        return (
            <div>
                {handshakes.length === 0 ? (
                    <h3 className="mt-5 mb-5">
                        No handshakes created yet. Please{""} <Link to={`/${this.companyId}/handshake/create`}>create handshake</Link>.
                    </h3>
                ) : (
                    <h3 className="mt-5 mb-5">
                        {!handshakes.length ? 'Loading...' : 'Handshakes'}
                    </h3>
                )}

                {this.renderHandshakes(this.processHandshakes(handshakes))}
            </div>
        );
    }
}

export default Handshakes;