import AllJobs from "@/components/history/all-jobs";

const History = () => {
  return (
    <div className="p-5 h-full space-y-2 flex flex-col">
      <h1 className="text-xl sm:text-4xl font-bold">Your Video History</h1>
      <p className="text-muted-foreground mt-2 text-base max-w-2xl">
        Here’s where you’ll find all your submitted YouTube videos — from those
        still processing to the ones fully done. Sit back and check back
        anytime!
      </p>
      <div className="flex-1">
        <AllJobs />
      </div>
    </div>
  );
};

export default History;
