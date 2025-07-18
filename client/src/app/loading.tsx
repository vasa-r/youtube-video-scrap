import PageLoader from "@/components/page-loader";
import React from "react";

const loading = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <PageLoader />
    </div>
  );
};

export default loading;
