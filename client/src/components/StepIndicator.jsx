import React from 'react';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;

          return (
            <React.Fragment key={step}>
              {/* Step Circle & Text */}
              <div className="flex flex-col items-center flex-1 relative">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-display text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'border-primary bg-primary text-white'
                      : isActive
                      ? 'border-primary text-primary bg-white shadow-sm ring-4 ring-primary-light'
                      : 'border-slate-200 text-slate-400 bg-white'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                
                <span
                  className={`mt-2 font-display text-[10px] sm:text-xs font-bold tracking-wide transition-colors duration-300 ${
                    isActive ? 'text-primary' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {step}
                </span>
              </div>

              {/* Progress Line */}
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-slate-100 relative -top-3">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
