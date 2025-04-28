import React from 'react';

const LoadingOverlay = () => (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    }}>
        <svg width="38" height="38" viewBox="0 0 38 38">
            <circle
                stroke="#2563eb"
                strokeWidth="4"
                fill="none"
                cx="19"
                cy="19"
                r="16"
                strokeDasharray="80"
                strokeDashoffset="60"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 19 19"
                    to="360 19 19"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </circle>
        </svg>
    </div>
);

export default LoadingOverlay;
