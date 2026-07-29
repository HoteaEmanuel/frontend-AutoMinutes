import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useGetMeeting } from '@/features/meetings/hooks/useMeetings';
import { useExportMeeting } from '@/features/export/hooks/useExportMeeting';
import MeetingStatusBadge from '@molecules/MeetingStatusBadge/MeetingStatusBadge';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import {
  Download,
  FileCode,
  FileJson,
  FileText,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import OverviewTab from './OverviewTab';
import TranscriptTab from './TranscriptTab';
import AttendeesTab from './AttendeesTab';
import AiResultsTab from './AiResultsTab';
import TodosTab from './TodosTab';
import MeetingDeleteAlert from './MeetingDeleteAlert';
import EditMeetingDialog from './EditMeetingDialog';

type MeetingDialogProps = {
  open: boolean;
  meetingId: string;
  onOpenChange: () => void;
};

const tabTriggerClassName =
  'px-3 data-active:text-primary data-active:after:bg-primary dark:data-active:text-primary';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const MeetingDialog = ({ meetingId, open, onOpenChange }: MeetingDialogProps) => {
  const { data, error, isPending, isError, refetch } = useGetMeeting(meetingId);
  const { exportMeeting, isExporting } = useExportMeeting(meetingId);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {isPending && (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {isError && (
          <div className="p-6">
            <ErrorRefetch errorMessage={error.message} refetch={refetch} />
          </div>
        )}

        {data && (
          <>
            <MeetingDeleteAlert
              meetingId={meetingId}
              meetingTitle={data.title}
              open={deleteAlertOpen}
              onOpenChange={setDeleteAlertOpen}
              onDeleted={onOpenChange}
            />

            <EditMeetingDialog meeting={data} open={editOpen} onOpenChange={setEditOpen} />

            <DialogHeader className="gap-3 border-b border-border/50 p-4 sm:p-6">
              <div className="flex flex-col gap-3 pr-10 sm:flex-row sm:items-center">
                <MeetingStatusBadge status={data.status} />
                <span className="text-sm text-muted-foreground">
                  {dateFormatter.format(new Date(data.scheduledAt))}
                </span>
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger
                      render={<DropdownMenuTrigger />}
                      className="export-btn export-btn--icon-only"
                      aria-label="Export"
                      disabled={isExporting}
                    >
                      {isExporting ? (
                        <Loader2 className="export-btn-icon animate-spin" aria-hidden="true" />
                      ) : (
                        <Download className="export-btn-icon" aria-hidden="true" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>Export</TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="start" className="min-w-44">
                    <DropdownMenuItem onClick={() => exportMeeting('pdf')}>
                      <FileText />
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportMeeting('markdown')}>
                      <FileCode />
                      Export as Markdown
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportMeeting('json')}>
                      <FileJson />
                      Export as JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Tooltip>
                  <TooltipTrigger
                    render={<Button variant="outline" size="icon-sm" onClick={() => setEditOpen(true)} />}
                  >
                    <Pencil />
                  </TooltipTrigger>
                  <TooltipContent>Edit meeting</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => setDeleteAlertOpen(true)}
                      />
                    }
                  >
                    <Trash2 />
                  </TooltipTrigger>
                  <TooltipContent>Delete meeting</TooltipContent>
                </Tooltip>
              </div>

              <DialogTitle className="min-w-0 wrap-break-word text-2xl font-bold leading-snug">
                {data.title}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="overview" className="min-h-0 min-w-0">
              <TabsList
                variant="line"
                className="w-full justify-start overflow-x-auto overflow-y-hidden border-b border-border/50 px-4 sm:px-6"
              >
                <TabsTrigger value="overview" className={tabTriggerClassName}>
                  Overview
                </TabsTrigger>
                <TabsTrigger value="transcript" className={tabTriggerClassName}>
                  Transcript
                </TabsTrigger>
                <TabsTrigger value="ai-results" className={tabTriggerClassName}>
                  AI Results
                </TabsTrigger>
                <TabsTrigger value="attendees" className={tabTriggerClassName}>
                  Attendees
                </TabsTrigger>
                <TabsTrigger value="todos" className={tabTriggerClassName}>
                  Todos
                </TabsTrigger>
              </TabsList>

              <div className="max-h-[55vh] min-w-0 overflow-y-auto p-4 sm:p-6">
                <TabsContent value="overview">
                  <OverviewTab meetingId={meetingId} />
                </TabsContent>

                <TabsContent value="transcript" className="text-sm text-muted-foreground">
                  <TranscriptTab meetingId={meetingId} />
                </TabsContent>

                <TabsContent value="ai-results" className="text-sm text-muted-foreground">
                  <AiResultsTab meetingId={meetingId} />
                </TabsContent>

                <TabsContent value="attendees" className="text-sm text-muted-foreground">
                  <AttendeesTab meetingId={meetingId} />
                </TabsContent>

                <TabsContent value="todos" className="text-sm text-muted-foreground">
                  <TodosTab meetingId={meetingId} meetingTitle={data.title} />
                </TabsContent>
              </div>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MeetingDialog;
