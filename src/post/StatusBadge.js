  
import React, { Component } from 'react';

export class StatusBadge extends Component {
    checkStatusBadge = status => {
        if (status === 'ACTIVE') {
            return <span className="badge badge-pill badge-success">{status}</span>
        } else {
            return <span className="badge badge-pill badge-danger">{status}</span>
        }
    };

    render() {
        const status = this.props.status;

        return (
            this.checkStatusBadge(status)
        );
    }
}

export default StatusBadge;