import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import StageBadge from '../handshake/StageBadge';

export class RecentHandshakes extends Component {

    render() {
        const { handshakes } = this.props;
        let activeHandshakes = handshakes.filter(handshake => !(handshake.stage === 'COMPLETED'));
        let completedHandshakes = handshakes.filter(handshake => handshake.stage === 'COMPLETED');

        return (
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table m-0">
                        <thead>
                            <tr>
                                <th>Stage</th>
                                <th>Handshake</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeHandshakes.map((handshake, i) => (
                                <tr key={i}>
                                    <td><span><StageBadge stage={handshake.stage} /></span></td>
                                    <td>
                                        <Link to={`/${handshake.company}/handshake/${handshake._id}`}>
                                            <div>
                                                <p>{handshake.title}</p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td>
                                        <div class="sparkbar" data-color="#00a65a" data-height="20">{new Date(handshake.created).toDateString()}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default RecentHandshakes;