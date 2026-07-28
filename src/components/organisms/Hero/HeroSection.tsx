
import { Button } from '@/components/ui/button';
import { ChevronDown} from 'lucide-react';
import { Link } from 'react-router';

const HeroSection = () => {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(600px_300px_at_80%_-10%,color-mix(in_srgb,var(--primary)_35%,transparent),transparent),radial-gradient(500px_280px_at_10%_110%,color-mix(in_srgb,var(--primary-400)_22%,transparent),transparent),linear-gradient(160deg,var(--primary-800),var(--primary-900)_70%)] px-4 text-center">
    

      <h1 className="mt-6 max-w-4xl text-6xl leading-[1.05] font-bold tracking-tight text-white md:text-7xl">
        Meeting transcripts in.
        <br />
        <span className="bg-(image:--gradient-brand) bg-clip-text text-transparent">
          Action items out.
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-white/70">
        Upload any meeting transcript and let AI turn it into a clear summary, key
        decisions, and trackable action items — no recording required.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Button size="lg" className="px-8 py-5 text-base" render={<Link to="/auth/signup" />}>
          Get started
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white/20 bg-white/5 px-8 py-5 text-base text-white hover:bg-white/10 hover:text-white"
          render={<a href="#how-it-works" />}
        >
          See how it works
        </Button>
      </div>

      <a
        href="#how-it-works"
        aria-label="Scroll to how it works"
        className="absolute bottom-8 text-white/40 transition-colors hover:text-white/70"
      >
        <ChevronDown className="size-6 animate-bounce" />
      </a>
    </div>
  );
};

export default HeroSection;
