import React, { Component } from 'react';

export class StageBadge extends Component {
    checkStageBadge = stage => {
        if (stage === 'NOT STARTED') {
            return <span className="badge badge-pill badge-secondary">{stage}</span>
        } else if (stage === 'ASSIGNMENT') {
            return <span className="badge badge-pill badge-primary">{stage}</span>
        } else if (stage === 'IN PROGRESS') {
            return <span className="badge badge-pill badge-info">{stage}</span>
        } else if (stage === 'ON HOLD') {
            return <span className="badge badge-pill badge-warning">{stage}</span>
        } else if (stage === 'APPROVAL') {
            return <span className="badge badge-pill badge-info">{stage}</span>
        } else if (stage === 'POST APPROVAL') {
            return <span className="badge badge-pill badge-info">{stage}</span>
        } else if (stage === 'COMPLETED') {
            return <span className="badge badge-pill badge-success">{stage}</span>
        } else {
            return <span className="badge badge-pill badge-danger">{stage}</span>
        }
    };

    render() {
        const stage = this.props.stage;

        return (
            this.checkStageBadge(stage)
        );
    }
}

export default StageBadge;