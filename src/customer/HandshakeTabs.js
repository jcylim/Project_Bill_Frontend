import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import StageBadge from '../handshake/StageBadge';

export class HandshakeTabs extends Component {

    render() {
        const { handshakes } = this.props;
        let activeHandshakes = handshakes.filter(handshake => !(handshake.stage === 'COMPLETED'));
        let completedHandshakes = handshakes.filter(handshake => handshake.stage === 'COMPLETED');

        return (
            <div>
                <div className='container'>
                    <div>
                        <div>
                            <h4 className='text-primary'>Active Handshakes ({activeHandshakes.length})</h4>
                            <hr/>
                            {activeHandshakes.map((handshake, i) => (
                                <div key={i}>
                                    <div className='row'>
                                        <p className='ml-3 mr-3'><StageBadge stage={handshake.stage} /></p>
                                        <Link to={`/${handshake.company}/handshake/${handshake._id}`}>
                                            <div>
                                                <p className='lead'>{handshake.title}</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <br/>
                        <div>
                            <h4 className='text-primary'>Completed Handshakes ({completedHandshakes.length})</h4>
                            <hr/>
                            {completedHandshakes.map((handshake, i) => (
                                <div key={i}>
                                    <div>
                                        <Link to={`/${handshake.company}/task/${handshake._id}`}>
                                            <div>
                                                <p className='lead'>{handshake.title}</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HandshakeTabs;