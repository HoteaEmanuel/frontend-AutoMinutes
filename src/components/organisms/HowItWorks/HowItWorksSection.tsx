import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInView } from '@/hooks/useInView';
import { ArrowRight, ListChecks, Sparkles, UploadCloud } from 'lucide-react';
import { Fragment } from 'react';

const steps = [
  {
    number: '01',
    title: 'Upload or Paste Your Transcript',
    description:
      'Drop in a .txt, .docx or .pdf file, or paste the raw transcript text directly. Everything is parsed right in your browser.',
    icon: UploadCloud,
  },
  {
    number: '02',
    title: 'AI Extracts the Key Details',
    description:
      'One click generates a summary, decisions, detailed notes, follow-ups, action items and attendees from the transcript.',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Review, Edit & Track Progress',
    description:
      "Fine-tune anything AI got wrong, manage action items on a board, and regenerate results anytime without losing your edits.",
    icon: ListChecks,
  },
];

const HowItWorksSection = () => {
  const ref = useInView<HTMLDivElement>();

  return (
    <section id="how-it-works" className="scroll-mt-24 px-4 py-16 md:py-24">
      <div ref={ref} className="reveal mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold">How it works</h2>
        <p className="mt-2 text-muted-foreground">
          No setup required. Start processing your first meeting in minutes.
        </p>

        <div className="mt-12 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {steps.map((step, index) => (
            <Fragment key={step.title}>
              <Card className="text-left">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">{step.number}</span>
                    <step.icon className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">{step.description}</CardContent>
              </Card>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden size-6 self-center text-muted-foreground md:flex" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
