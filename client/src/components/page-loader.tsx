import React from "react";
import { RingLoader } from "react-spinners";

const PageLoader = () => {
  return (
    <div className="h-svh w-full center bg-vio">
      <RingLoader
        color="#00c951"
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default PageLoader;
