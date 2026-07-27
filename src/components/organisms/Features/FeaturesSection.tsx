import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInView } from '@/hooks/useInView';
import { ListChecks, RotateCw, Search, Sparkles, UploadCloud, Users } from 'lucide-react';

const features = [
  {
    title: 'Transcript Upload & Parsing',
    description:
      'Paste text directly or upload .txt, .docx and .pdf files — parsed instantly, no audio or recording needed.',
    icon: UploadCloud,
  },
  {
    title: 'AI-Generated Summaries',
    description:
      'Get a concise summary, key decisions, detailed notes and follow-ups generated automatically from any transcript.',
    icon: Sparkles,
  },
  {
    title: 'Smart Action Items',
    description:
      'Action items are extracted automatically, then tracked on a board with status, deadlines and assignees.',
    icon: ListChecks,
  },
  {
    title: 'Automatic Attendee Detection',
    description:
      'Attendees are pulled straight from the transcript, with the option to add, edit or remove them by hand.',
    icon: Users,
  },
  {
    title: 'Regenerate Anytime',
    description:
      'Re-run AI extraction whenever you need to — your manual edits are always preserved.',
    icon: RotateCw,
  },
  {
    title: 'Organized Meeting History',
    description:
      'Search, sort and filter every past meeting by status, date, or whether it has open action items.',
    icon: Search,
  },
];

const FeaturesSection = () => {
  const ref = useInView<HTMLDivElement>();

  return (
    <section className="px-4 py-16 md:py-24">
      <div ref={ref} className="reveal mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold">Everything your meetings need</h2>
        <p className="mt-2 text-muted-foreground">
          A focused meeting intelligence toolkit for turning transcripts into action.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="text-left">
              <CardHeader>
                <feature.icon className="size-6 text-primary" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{feature.description}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
