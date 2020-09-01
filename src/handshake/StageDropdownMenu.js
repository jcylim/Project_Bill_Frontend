import React, { Component } from 'react';


export class StageDropdownMenu extends Component {
    
    render() {
        const { onButtonClick } = this.props;
        const stages = ['NOT STARTED', 'ASSIGNMENT', 'IN PROGRESS', 'ON HOLD', 'APPROVAL', 'POST APPROVAL', 'COMPLETED', 'WITHDRAWN']

        return (
            <div className="btn-group">
                <button type='button' className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Select Handshake Stage
                </button>
                <div className="dropdown-menu">
                    {stages.map((stage, i) => (
                        <a className="dropdown-item" onClick={() => {onButtonClick(stage)}}>{stage}</a>
                    ))}
                </div>
            </div>
        );
    }
}

export default StageDropdownMenu;