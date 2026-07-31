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
import { dateFormatter } from '@/features/meetings/columns';
import MeetingStatusBadge from '@molecules/MeetingStatusBadge/MeetingStatusBadge';
import ConfirmAlertDialog from '@molecules/ConfirmAlertDialog/ConfirmAlertDialog';
import MeetingNotFound from '@pages/NotFound/MeetingNotFound/MeetingNotFound';
import OverviewTab from '@organisms/meetings/MeetingDialog/OverviewTab';
import TranscriptTab from '@organisms/meetings/MeetingDialog/TranscriptTab';
import AttendeesTab from '@organisms/meetings/MeetingDialog/AttendeesTab';
import AiResultsTab from '@organisms/meetings/MeetingDialog/AiResultsTab';
import TodosTab from '@organisms/meetings/MeetingDialog/TodosTab';
import EditMeetingDialog from '@organisms/meetings/MeetingDialog/EditMeetingDialog';
import MeetingDetailSkeleton from './MeetingDetailSkeleton';
import {
  ArrowLeft,
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
import { Link, useNavigate, useSearchParams } from 'react-router';

const tabTriggerClassName =
  'px-3 data-active:text-primary data-active:after:bg-primary dark:data-active:text-primary';

const TAB_VALUES = ['overview', 'transcript', 'ai-results', 'attendees', 'todos'] as const;

const MeetingDetailTemplate = ({ meetingId }: { meetingId: string }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data, isPending, isError } = useGetMeeting(meetingId);
  const { exportMeeting, isExporting } = useExportMeeting(meetingId);
  const { mutate: deleteMeeting, isPending: isDeleting } = useDeleteMeeting();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = () => {
    if (!data) return;
    deleteMeeting(data.id, {
      onSuccess: () => {
        setDeleteAlertOpen(false);
        navigate('/meetings');
      },
    });
  };

  const requestedTab = searchParams.get('tab');
  const initialTab = TAB_VALUES.includes(requestedTab as (typeof TAB_VALUES)[number])
    ? requestedTab!
    : 'overview';

  if (isError) return <MeetingNotFound />;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 py-6">
      <Link
        to="/meetings"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to meetings
      </Link>

      {isPending && <MeetingDetailSkeleton />}

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

          <header className="flex min-w-0 flex-col gap-3 border-b border-border/50 pb-4">
            <div className="flex items-center gap-2 sm:gap-3">
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
                      <Button variant="outline" size="icon-sm" onClick={() => setEditOpen(true)} />
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
                  <DropdownMenuItem onClick={() => exportMeeting('markdown')} disabled={isExporting}>
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
                  <DropdownMenuItem variant="destructive" onClick={() => setDeleteAlertOpen(true)}>
                    <Trash2 />
                    Delete meeting
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <h1 className="min-w-0 wrap-break-word text-2xl font-bold leading-snug sm:text-3xl">
              {data.title}
            </h1>
          </header>

          <Tabs defaultValue={initialTab} className="min-w-0">
            <TabsList variant="line" className="w-full border-b border-border/50">
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
              <TabsTrigger value="attendees" className={tabTriggerClassName} aria-label="Attendees">
                <Users className="size-4" />
                <span className="hidden sm:inline">Attendees</span>
              </TabsTrigger>
              <TabsTrigger value="todos" className={tabTriggerClassName} aria-label="Todos">
                <ListChecks className="size-4" />
                <span className="hidden sm:inline">Todos</span>
              </TabsTrigger>
            </TabsList>

            <div className="min-w-0 px-1 py-8 sm:px-2">
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
    </div>
  );
};

export default MeetingDetailTemplate;
