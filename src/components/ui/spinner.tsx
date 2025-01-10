// components/ui/spinner.tsx
import React from 'react';

export const Spinner = () => {
    return (
        <div className="spinnerContainer">
            <div className="spinner"></div>
            <style>{`
                .spinnerContainer {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .spinner {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border-left-color: #000;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
};