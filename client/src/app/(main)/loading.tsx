import PageLoader from "@/components/page-loader";
import React from "react";

const MainLoading = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <PageLoader />
    </div>
  );
};

export default MainLoading;
