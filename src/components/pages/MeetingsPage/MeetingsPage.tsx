import MeetingsTable from '@templates/MeetingsTable/MeetingsTable';

const MeetingsPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <h1 className="text-left text-2xl font-bold">Meetings</h1>
      <MeetingsTable />
    </div>
  );
};

export default MeetingsPage;
