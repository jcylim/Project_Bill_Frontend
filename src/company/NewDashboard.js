import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// new 
import $ from 'jquery';
import Chart from 'chart.js';

import { getBasicCompanyInfo } from './apiCompany';
import { list } from '../task/apiTask';
import { listHandshakes } from '../handshake/apiHandshake';
//import Tasks from '../task/Tasks';
import UserHandshakes from '../handshake/UserHandshakes';
import { isAuthenticated } from '../auth';
import DefaultProfile from '../img/avatar.png';
import Announcements from './Announcements';
import CanvasJSReact from '../canvasjs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class NewDashboard extends Component {
    constructor() {
        super();
        this.state = {
            company: '',
            comments: '',
            tasks: [],
            handshakes: []
        }
    }

    loadTasks = companyId => {
        const token = isAuthenticated().token;
        list(companyId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ tasks: data });
            }
        });
    };

    loadHandshakes = companyId => {
        const token = isAuthenticated().token;
        listHandshakes(companyId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ handshakes: data });
            }
        });
    };

    componentDidMount() {
        const companyId = this.props.match.params.companyId;
        getBasicCompanyInfo(companyId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ company: data , comments: data.comments });
            }
        });

        this.loadHandshakes(companyId);
        this.loadTasks(companyId);
    }

    updateComments = comments => {
        this.setState({ comments });
    };

    calculateStageStatus = (list, stage) => {
        let stageList = list.filter(l => l.stage === stage);
        let listWithoutCompletion = list.filter(l => !(l.stage === 'COMPLETED'));
        var percent = (stageList.length / listWithoutCompletion.length) * 100;
        return percent.toFixed(2);
    };

    render() {
        const { company, comments, tasks, handshakes } = this.state;
        let notStartedHandshakes = handshakes.filter(handshake => handshake.stage === 'NOT STARTED');
        let taskOptionText = tasks ? `${Math.ceil(this.calculateStageStatus(tasks, "IN PROGRESS"))}% In Progress` : 'No tasks created yet';
        //let handshakeOptionText = tasks ? `${Math.ceil(this.calculateStageStatus(tasks, "IN PROGRESS"))}% In Progress` : 'No tasks created yet';

        const taskOptions = {
            animationEnabled: true,
            title: {
                text: "Tasks Status"
            },
            subtitles: [{
                text: taskOptionText,
                verticalAlign: "center",
                fontSize: 22,
                dockInsidePlotArea: true
            }],
            data: [{
                type: "doughnut",
                showInLegend: true,
                indexLabel: "{name}: {y}",
                yValueFormatString: "#,###'%'",
                dataPoints: [
                    { name: "NOT STARTED", y: this.calculateStageStatus(tasks, "NOT STARTED") },
                    { name: "IN PROGRESS", y: this.calculateStageStatus(tasks, "IN PROGRESS") }
                ]
            }]
        }
        
        const handshakeOptions = {
            animationEnabled: true,
            title: {
                text: "Handshakes Status"
            },
            data: [{
                type: "doughnut",
                showInLegend: true,
                indexLabel: "{name}: {y}",
                yValueFormatString: "#,###'%'",
                dataPoints: [
                    { name: "NOT STARTED", y: this.calculateStageStatus(handshakes, "NOT STARTED") },
                    { name: "ASSIGNMENT", y: this.calculateStageStatus(handshakes, "ASSIGNMENT") },
                    { name: "IN PROGRESS", y: this.calculateStageStatus(handshakes, "IN PROGRESS") },
                    { name: "ON HOLD", y: this.calculateStageStatus(handshakes, "ON HOLD") },
                    { name: "APPROVAL", y: this.calculateStageStatus(handshakes, "APPROVAL") },
                    { name: "POST APPROVAL", y: this.calculateStageStatus(handshakes, "POST APPROVAL") },
                    { name: "WITHDRAWN", y: this.calculateStageStatus(handshakes, "WITHDRAWN") }
                ]
            }]
        }

        // quick stats chart
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
        })

        // donut chart
        var donutData = {
            datasets: [{
                data: [this.calculateStageStatus(handshakes, "NOT STARTED"), this.calculateStageStatus(handshakes, "IN PROGRESS")],
                backgroundColor: ['#EEEEEE', '#5FAEE3']
            }],
            labels: [
                'Not Started Handshakes',
                'Pending Handshakes'
            ]
        };
        var chartOptions = {
            rotation: -Math.PI,
            cutoutPercentage: 30,
            legend: {
              position: 'left'
            },
            animation: {
              animateRotate: false,
              animateScale: true
            }
        };
        var $donutChart = $('#donut-chart');
        var donutChart = new Chart($donutChart, {
            type: 'doughnut',
            data: donutData,
            options: chartOptions
        });

        // view charts
        var $viewsChart = $('#view-chart')
        var viewChart  = new Chart($viewsChart, {
            data   : {
            labels  : ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [{
                type                : 'line',
                data                : [20, 50, 34, 150, 180, 250, 290],
                backgroundColor     : 'transparent',
                borderColor         : '#F2F84F',
                pointBorderColor    : '#F2F84F',
                pointBackgroundColor: '#F2F84F',
                fill                : false
                // pointHoverBackgroundColor: '#007bff',
                // pointHoverBorderColor    : '#007bff'
            },
                {
                type                : 'line',
                data                : [90, 20, 170, 190, 200, 150, 275],
                backgroundColor     : 'tansparent',
                borderColor         : '#F86B4F',
                pointBorderColor    : '#F86B4F',
                pointBackgroundColor: '#F86B4F',
                fill                : false
                // pointHoverBackgroundColor: '#ced4da',
                // pointHoverBorderColor    : '#ced4da'
                },
                {
                type                : 'line',
                data                : [130, 180, 210, 225, 250, 275, 280],
                backgroundColor     : 'tansparent',
                borderColor         : '#716EE5',
                pointBorderColor    : '#716EE5',
                pointBackgroundColor: '#716EE5',
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
            <div className="content-wrapper">
                {company && (
                    <>
                        <div className="content-header">
                            <div className="container-fluid">
                                <div className="row mb-2">
                                    <div className="col-sm-6">
                                        <h1 className="m-0 text-dark">Dashboard</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-lg-8">
                                        <div className="card">
                                            <div className="card-header border-0">
                                                <div className="d-flex justify-content-between card-header">
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
                                    <div className="col-lg-4">
                                        <div className="card card-primary card-outline">
                                            <div className="card-header">
                                                <h3 className="card-title">
                                                    My Handshakes
                                                </h3>
                                            </div>
                                            <div className="card-body">
                                                <canvas id="donut-chart" style={{"height": "300px"}}></canvas>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="card card-primary card-outline">
                                            <div className="card-header">
                                                <h3 className="card-title">
                                                    <i className="fa fa-plus-square"></i> Todo List
                                                </h3>
                                            </div>
                                            <div className="card-body">
                                                <form>
                                                    <div className="form-group">
                                                        <input type="text" className="form-control"/>
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="checkbox"/>
                                                        <label className='ml-2'>Lorem Ipsum</label>
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="checkbox"/>
                                                        <label className='ml-2'>Lorem Ipsum</label>
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="checkbox"/>
                                                        <label className='ml-2'>Lorem Ipsum</label>
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="checkbox"/>
                                                        <label className='ml-2'>Lorem Ipsum</label>
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="checkbox"/>
                                                        <label className='ml-2'>Lorem Ipsum</label>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-lg-8">
                                        <div className="card">
                                            <div className="card-header border-0">
                                                <div className="d-flex justify-content-between card-header">
                                                    <h3 className="card-title">Recent Views</h3>
                                                </div>
                                            </div>
                                            <div className="card-body">

                                                <div className="position-relative mb-4">
                                                    <canvas id="view-chart" height="200"></canvas>
                                                </div>

                                                <div className="d-flex flex-row justify-content-end">
                                                    <span className="mr-2">
                                                        <i className="fa fa-square text-primary"></i> Recent Requests
                                                    </span>

                                                    <span className="mr-2">
                                                        <i className="fa fa-square text-warning"></i> Recent Tasks
                                                    </span>
                                                    <span>
                                                        <i className="fa fa-square text-danger"></i> Recent Tenants
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

export default NewDashboard;