import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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


class Dashboard extends Component {
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

        return (
            <div>
                {company && (
                    <>  
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h1 className="h2">{company.name}'s Board</h1>
                            <div className="btn-toolbar mb-2 mb-md-0">
                                <Link className="btn btn-raised btn-outline-primary mr-4" to={`/${company.id}/handshake/create`}>
                                    Create Handshake
                                </Link>
                                <Link 
                                    to={`/${company.id}/customer/create`}
                                    className="btn btn-raised btn-outline-primary mr-4"
                                >
                                    Add New Customer
                                </Link>
                                {isAuthenticated().company && (
                                    <Link className="btn btn-raised btn-outline-primary mr-4" to={`/${company.id}/employee/add`}>
                                        Add New Employee
                                    </Link>
                                )}
                                <Link 
                                    to={`/${company.id}/profile`}
                                    className="btn btn-raised btn-outline-info"
                                >
                                    Company Profile
                                </Link>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-md-8'>
                                <CanvasJSChart options={taskOptions}
                                    /* onRef={ref => this.chart = ref} */
                                />
                                <br/>
                                <CanvasJSChart options={handshakeOptions}
                                    /* onRef={ref => this.chart = ref} */
                                />
                                <br/>
                            </div>
                            <div className='col-md-3'>
                                {comments ? (
                                    <Announcements 
                                        companyId={company.id}
                                        comments={comments.reverse()} 
                                        updateComments={this.updateComments}
                                    />
                                ) : (
                                    <h4 className='mb-3'>No announcements yet</h4>
                                )}
                                {notStartedHandshakes ? (
                                    <div className='ml-5'>
                                        <h4 className='mt-5 mb-3'>Handshakes Not Started</h4>
                                        <hr/>
                                        <div style={{'overflow-y': 'auto', 'height': '300px'}}>
                                            {notStartedHandshakes.map((handshake, i) => (
                                                <div key={i}>
                                                    <div>
                                                    <Link 
                                                        className='lead' 
                                                        to={`/${company.id}/handshake/${handshake._id}`}
                                                    >
                                                        {handshake.title} 
                                                    </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <h4 className='mb-3'>No handshakes not started yet</h4>
                                )}
                            </div>
                        </div>

                        <UserHandshakes companyId={company.id} />
                    </>
                )}
            </div>
        );
    }
}

export default Dashboard;