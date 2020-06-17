import React from 'react';

const Loading = ({ loading }) => (
    loading ? (
        <div className="jumbotron text-center">
            <h2>Loading...</h2>
        </div>
    ) : (
        ""
    )
);


export default Loading;