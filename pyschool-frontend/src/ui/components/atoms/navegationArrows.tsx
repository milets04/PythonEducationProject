"use client";
import React from 'react';

interface NavegationArrowsProps {
  onPrevious: () => void;
  
  onNext: () => void;
  
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
}


export const NavegationArrows: React.FC<NavegationArrowsProps> = ({
  onPrevious,
  onNext,
  isPreviousDisabled = false, 
  isNextDisabled = false,     
}) => {
  return (
    <>
      <div className="arrow-container">
        <button
          className="arrow-button"
          onClick={onPrevious}
          disabled={isPreviousDisabled}
          aria-label="Ir a la página anterior" 
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button
          className="arrow-button"
          onClick={onNext}
          disabled={isNextDisabled}
          aria-label="Ir a la siguiente página" // Buena práctica para accesibilidad
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>


      <style jsx>{`
        .arrow-container {
          display: flex;
          gap: 12px; 
        }

        .arrow-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background-color: #4A5568;
          color: white;
          border: none;
          border-radius: 8px; 
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }

        .arrow-button:hover {
          background-color: #2D3748;
        }

        .arrow-button:disabled {
          background-color: #A0AEC0; 
          color: #E2E8F0;
          cursor: not-allowed;
        }
          
        .arrow-button svg {
          width: 20px;
          height: 20px;
        }
      `}</style>
    </>
  );
};

export default NavegationArrows;