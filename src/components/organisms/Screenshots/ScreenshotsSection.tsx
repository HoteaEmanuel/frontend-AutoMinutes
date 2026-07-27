import { useInView } from '@/hooks/useInView';

const screenshots = [
  {
    src: '/screenshots/meetings.png',
    alt: 'Meetings list with search, filters and status badges',
    title: 'All your meetings, organized',
    description:
      'Search, filter by status or date, and sort through every meeting you’ve processed — all from one place.',
    objectPosition: 'object-top',
  },
  {
    src: '/screenshots/ai-results-tab.png',
    alt: 'AI-generated summary and action items for a meeting',
    title: 'AI-generated summary & action items',
    description:
      'One click generates a clear summary, key decisions and action items straight from the transcript. Not quite right? Regenerate it anytime.',
    objectPosition: 'object-top',
  },
  {
    src: '/screenshots/attendees-tab.png',
    alt: 'Attendees detected automatically for a meeting',
    title: 'Attendees, detected automatically',
    description:
      'AI pulls attendees straight from the transcript, tagged so you always know what was auto-detected versus added by hand.',
    objectPosition: 'object-top',
  },
  {
    src: '/screenshots/todos-tab.png',
    alt: 'Action items list for a single meeting',
    title: 'Action items per meeting',
    description:
      'Every action item lives inside its meeting, assigned to the right person with a status you can update as work progresses.',
    objectPosition: 'object-top',
  },
  {
    src: '/screenshots/todos-page.png',
    alt: 'Todos board across all meetings',
    title: 'Every todo, on one board',
    description:
      'See open, in-progress and done action items across all your meetings on a single board.',
    objectPosition: 'object-left-top',
  },
];

const ScreenshotRow = ({
  shot,
  reverse,
}: {
  shot: (typeof screenshots)[number];
  reverse: boolean;
}) => {
  const ref = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal flex flex-col items-center gap-8 md:gap-16 ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-border shadow-lg md:w-1/2">
        <img
          src={shot.src}
          alt={shot.alt}
          className={`h-full w-full object-cover ${shot.objectPosition}`}
        />
      </div>
      <div className="w-full text-left md:w-1/2">
        <h3 className="text-2xl font-semibold">{shot.title}</h3>
        <p className="mt-3 text-muted-foreground">{shot.description}</p>
      </div>
    </div>
  );
};

const ScreenshotsSection = () => {
  const headingRef = useInView<HTMLDivElement>();

  return (
    <section className="px-4 py-16 md:py-24">
      <div ref={headingRef} className="reveal mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold">See AutoMinutes in action</h2>
        <p className="mt-2 text-muted-foreground">
          A quick look at what you get after uploading a transcript.
        </p>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-16 md:gap-24">
        {screenshots.map((shot, index) => (
          <ScreenshotRow key={shot.src} shot={shot} reverse={index % 2 === 1} />
        ))}
      </div>
    </section>
  );
};

export default ScreenshotsSection;
