import React, { Component } from 'react';
import { assign, unassign } from './apiHandshake';


export class AssignHandshakeButton extends Component {
    assignClick = () => {
        this.props.onButtonClick(assign)
    };

    unassignClick = () => {
        this.props.onButtonClick(unassign)
    };

    render() {
        return (
            <div className='d-inline-block'>
                {
                    !this.props.assigned ? (
                        <button onClick={this.assignClick} className='btn btn-success btn-raised mr-5'>
                            Assign to me
                        </button>
                    ) : (
                        <button onClick={this.unassignClick} className='btn btn-danger btn-raised'>
                            Unassign
                        </button>
                    )
                }
            </div>
        );
    }
}

export default AssignHandshakeButton;