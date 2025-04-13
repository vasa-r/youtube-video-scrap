import React from "react";

interface SingleJobProp {
  params: { jobId: string };
}

const SingleJob = ({ params }: SingleJobProp) => {
  console.log({ params });
  return <div>SingleJob</div>;
};

export default SingleJob;
