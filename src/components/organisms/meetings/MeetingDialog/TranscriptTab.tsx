import { useGetTranscript } from '@/features/meetings/hooks/useTranscript';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import { Loader2 } from 'lucide-react';
import React from 'react';

const TranscriptTab = ({ meetingId }: { meetingId: string }) => {
  const { data, isError, isPending, refetch, error } = useGetTranscript(meetingId);
  if (isPending) return <Loader2 className="animate-spin" />;
  if (isError) return <ErrorRefetch errorMessage={error.message} refetch={refetch} />;
  if (!data || data.content.trim().length === 0)
    return <p className="text-center font-semibold">No transcript available</p>;
  return (
    <div>
      <p>{data.content}</p>
    </div>
  );
};

export default TranscriptTab;
