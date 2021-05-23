import React, { Component } from 'react';


export class StatusDropdownMenu extends Component {
    
    render() {
        const { onButtonClick } = this.props;
        const statuss = ['ACTIVE', 'SOLD']

        return (
            <div className="btn-group">
                <button type='button' className="btn btn-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Select Post Status
                </button>
                <div className="dropdown-menu">
                    {statuss.map((status, i) => (
                        <a className="dropdown-item" onClick={() => {onButtonClick(status)}}>{status}</a>
                    ))}
                </div>
            </div>
        );
    }
}

export default StatusDropdownMenu;