const ErrorDisplay = ({ error }: { error: string }) => {
  return (
    <div className="flex gap-2 items-center">
      {/* <CircleAlert className="text-red-500 size-7" /> */}
      <div className="flex flex-col items-center justify-center">
        <p className="font-bold">{error}</p>
        {/* <p className="text-xs">Try again</p> */}
      </div>
    </div>
  );
};

export default ErrorDisplay;
