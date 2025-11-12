"use client";
import React from 'react';

interface NavegationArrowsProps {
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
}

const ArrowButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  iconPoints: string;
}> = ({ onClick, disabled, ariaLabel, iconPoints }) => (
  <button
    className="arrow-button"
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points={iconPoints} />
    </svg>
  </button>
);

export const NavegationArrows: React.FC<NavegationArrowsProps> = ({
  onPrevious,
  onNext,
  isPreviousDisabled = false,
  isNextDisabled = false,
}) => (
  <>
    <div className="arrow-container">
      <ArrowButton
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        ariaLabel="Ir a la página anterior"
        iconPoints="15 18 9 12 15 6"
      />
      <ArrowButton
        onClick={onNext}
        disabled={isNextDisabled}
        ariaLabel="Ir a la siguiente página"
        iconPoints="9 18 15 12 9 6"
      />
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

export default NavegationArrows;
