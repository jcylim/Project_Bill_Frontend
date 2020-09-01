import React, { Component } from 'react';


export class UserDropdownMenu extends Component {
    
    render() {
        const { users, onAssignClick } = this.props;
        
        return (
            <div className="btn-group mr-3">
                <button type='button' className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Assign Handshake To
                </button>
                <div className="dropdown-menu">
                    {users.map((user, i) => (
                        <a className="dropdown-item" onClick={() => {onAssignClick(user)}}>{user.first_name} {user.last_name}</a>
                    ))}
                </div>
            </div>
        );
    }
}

export default UserDropdownMenu;