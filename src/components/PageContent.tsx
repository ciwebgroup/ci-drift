import React from 'react';
import LoadingOverlay from './LoadingOverlay';

const PageContent = () => {
    const isLoading = false; // Replace with actual loading state from store

    return (
        <div className="page-content">
            {isLoading && <LoadingOverlay />}
            <h1>Content</h1>
        </div>
    );
}

export default PageContent;