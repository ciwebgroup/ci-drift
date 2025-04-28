import React from 'react';
import LoadingOverlay from './LoadingOverlay';

const PageSpeed = () => {
    const isLoading = false; // Replace with actual loading state from store

    return (
        <div className="page-speed">
            {isLoading && <LoadingOverlay />}
            <h1>Speed</h1>
        </div>
    );
}

export default PageSpeed;