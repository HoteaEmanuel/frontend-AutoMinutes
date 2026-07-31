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
import { useDeleteMeeting, useGetMeeting } from '@/features/meetings/hooks/useMeetings';
import { useExportMeeting } from '@/features/export/hooks/useExportMeeting';
import MeetingStatusBadge from '@molecules/MeetingStatusBadge/MeetingStatusBadge';
import ErrorRefetch from '@molecules/ErrorRefetch/ErrorRefetch';
import ConfirmAlertDialog from '@molecules/ConfirmAlertDialog/ConfirmAlertDialog';
import {
  Download,
  FileCode,
  FileJson,
  FileText,
  LayoutDashboard,
  ListChecks,
  Loader2,
  MoreVertical,
  Pencil,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import OverviewTab from './OverviewTab';
import TranscriptTab from './TranscriptTab';
import AttendeesTab from './AttendeesTab';
import AiResultsTab from './AiResultsTab';
import TodosTab from './TodosTab';
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
  const { mutate: deleteMeeting, isPending: isDeleting } = useDeleteMeeting();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = () => {
    if (!data) return;
    deleteMeeting(data.id, {
      onSuccess: () => {
        setDeleteAlertOpen(false);
        onOpenChange();
      },
    });
  };

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
            <ConfirmAlertDialog
              open={deleteAlertOpen}
              onOpenChange={setDeleteAlertOpen}
              title={
                <>
                  Delete "
                  <span className="inline-block max-w-[70%] truncate align-bottom">
                    {data.title}
                  </span>
                  "?
                </>
              }
              description="This will permanently remove the meeting along with its transcript, AI results, attendees, and action items. This can't be undone."
              confirmLabel="Delete"
              pendingLabel="Deleting..."
              isPending={isDeleting}
              onConfirm={handleDelete}
            />

            <EditMeetingDialog meeting={data} open={editOpen} onOpenChange={setEditOpen} />

            <DialogHeader className="min-w-0 gap-3 border-b border-border/50 p-4 sm:p-6">
              <div className="flex items-center gap-2 pt-8 sm:gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                  <MeetingStatusBadge status={data.status} />
                  <span className="truncate text-xs text-muted-foreground sm:text-sm">
                    {dateFormatter.format(new Date(data.scheduledAt))}
                  </span>
                </div>

                <div className="hidden shrink-0 items-center gap-2 sm:flex">
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger
                        render={<DropdownMenuTrigger />}
                        className="export-btn export-btn--icon-only"
                        aria-label="Export meeting"
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
                    <DropdownMenuContent align="end" className="min-w-44">
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
                      render={
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => setEditOpen(true)}
                        />
                      }
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

                <DropdownMenu>
                  <div className="-mr-2 shrink-0 sm:hidden">
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon-sm" />}
                      aria-label="Meeting actions"
                    >
                      <MoreVertical />
                    </DropdownMenuTrigger>
                  </div>
                  <DropdownMenuContent align="end" className="min-w-44">
                    <DropdownMenuItem onClick={() => exportMeeting('pdf')} disabled={isExporting}>
                      <FileText />
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => exportMeeting('markdown')}
                      disabled={isExporting}
                    >
                      <FileCode />
                      Export as Markdown
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportMeeting('json')} disabled={isExporting}>
                      <FileJson />
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                      <Pencil />
                      Edit meeting
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleteAlertOpen(true)}
                    >
                      <Trash2 />
                      Delete meeting
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <DialogTitle className="min-w-0 wrap-break-word text-2xl font-bold leading-snug">
                {data.title}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="overview" className="min-h-0 min-w-0">
              <TabsList variant="line" className="w-full border-b border-border/50 px-4 sm:px-6">
                <TabsTrigger value="overview" className={tabTriggerClassName} aria-label="Overview">
                  <LayoutDashboard className="size-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="transcript"
                  className={tabTriggerClassName}
                  aria-label="Transcript"
                >
                  <FileText className="size-4" />
                  <span className="hidden sm:inline">Transcript</span>
                </TabsTrigger>
                <TabsTrigger
                  value="ai-results"
                  className={tabTriggerClassName}
                  aria-label="AI Results"
                >
                  <Sparkles className="size-4" />
                  <span className="hidden sm:inline">AI Results</span>
                </TabsTrigger>
                <TabsTrigger
                  value="attendees"
                  className={tabTriggerClassName}
                  aria-label="Attendees"
                >
                  <Users className="size-4" />
                  <span className="hidden sm:inline">Attendees</span>
                </TabsTrigger>
                <TabsTrigger value="todos" className={tabTriggerClassName} aria-label="Todos">
                  <ListChecks className="size-4" />
                  <span className="hidden sm:inline">Todos</span>
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
