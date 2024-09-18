import React from 'react';

const ProgressStepBar = ({ currentStep }) => {
  const steps = [
    "Locker Request",
    "Agreement",
    "Maintenance",
    "Payment"
  ];

  return (
    <div className="flex justify-center items-center relative mb-8">
      <div className="relative flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${index + 1 <= currentStep ? 'bg-teal-500' : 'bg-gray-300'
                  }`}
              >
                {index + 1}
              </div>
              <div className="mt-2 text-sm font-medium">
                {step}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-24 h-1 ${index + 1 < currentStep ? 'bg-teal-500' : 'bg-gray-300'
                  }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="absolute top-1/2 transform -translate-y-1/2 w-full">
        <div className="relative flex items-center justify-between">
          {steps.map((_, index) => (
            index < steps.length - 1 && (
              <div
                key={index}
                className={`absolute top-1/2 transform -translate-y-1/2 ${index === 0 ? 'left-10' : `left-${index * 32 + 30}`
                  } w-1 h-2 ${index + 1 < currentStep ? 'bg-teal-500' : 'bg-gray-300'
                  }`}
              ></div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressStepBar;
