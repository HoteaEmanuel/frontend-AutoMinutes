import { useInView } from '@/hooks/useInView';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';

const steps = [
  {
    number: '01',
    title: 'Upload or Paste Your Transcript',
    description: 'Paste text or upload a .txt, .docx or .pdf file.',
  },
  {
    number: '02',
    title: 'AI Extracts the Key Details',
    description: 'One click extracts a summary, decisions and action items.',
  },
  {
    number: '03',
    title: 'Review, Edit & Track Progress',
    description: 'Edit anything, track progress, and regenerate anytime.',
  },
];

const StepNode = ({ number }: { number: string }) => (
  <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border-2 border-primary/40 bg-primary/10 text-2xl font-bold text-primary">
    {number}
  </div>
);

const HowItWorksSection = () => {
  const ref = useInView<HTMLDivElement>();

  return (
    <section id="how-it-works" className="scroll-mt-24 bg-muted/40 px-4 py-16 text-center md:py-24">
      <div ref={ref} className="reveal mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold">From transcript to action items in 3 steps</h2>
        <p className="mt-2 text-muted-foreground">
          No setup required. Start processing your first meeting in minutes.
        </p>

        {/* Mobile: stacked steps with a vertical connector */}
        <div className="mt-12 flex flex-col items-center gap-8 md:hidden">
          {steps.map((step, index) => (
            <Fragment key={step.number}>
              <div className="flex flex-col items-center gap-4">
                <StepNode number={step.number} />
                <div className="max-w-xs">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && <div className="h-8 w-px bg-border" />}
            </Fragment>
          ))}
        </div>
        <div className="mt-16 hidden items-start justify-center md:flex">
          {steps.map((step, index) => (
            <Fragment key={step.number}>
              <div className="flex flex-1 flex-col items-center">
                <StepNode number={step.number} />
                <div className="mt-6 max-w-55">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex shrink-0 items-center gap-1 px-2 pt-8">
                  <div className="h-px w-8 bg-border lg:w-16" />
                  <ChevronRight className="size-8 shrink-0 text-muted-foreground/50" />
                  <div className="h-px w-8 bg-border lg:w-16" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
