import React, { Component, useState } from 'react';
import { isAuthenticated } from '../auth';
import { getBasicCompanyInfo } from './apiCompany';
import { list } from '../task/apiTask';
import { listHandshakes } from '../handshake/apiHandshake';
import BarChart from '../charts/BarChart';
import DoughnutChart from '../charts/DoughnutChart';


class UserDashboard extends Component {
    constructor() {
        super();
        this.state = {
            handshakes: []
        }
    }

    loadHandshakes = companyId => {
        const token = isAuthenticated().token;
        listHandshakes(companyId, token)
        .then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ handshakes: data })
            }
        });
    };

    componentDidMount() {
        const companyId = this.props.match.params.companyId;

        this.loadHandshakes(companyId);
    }

    render() {
        const userId = isAuthenticated().user._id;
        const handshakes = this.state.handshakes;

        let assignedHandshakes = handshakes.filter(handshake => handshake.assignedTo.some(a => a._id === userId));
        let activeHandshakes = assignedHandshakes.filter(handshake => !(handshake.stage === 'COMPLETED' || handshake.stage === 'WITHDRAWN'));
        let completedHandshakes = assignedHandshakes.filter(handshake => handshake.stage === 'COMPLETED');
        let withdrawnHandshakes = assignedHandshakes.filter(handshake => handshake.stage === 'WITHDRAWN');
        
        return (
            <div className='row'>
                {/* {assignedHandshakes.map(handshake => (
                    <span>{handshake.about}</span>
                ))} */}
                <BarChart />
                <DoughnutChart />
            </div>
        ); 
    }
}

export default UserDashboard;