
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
        <Button
          size="lg"
          className="px-8 py-5 text-base"
          render={<Link to="/auth/signup" />}
          nativeButton={false}
        >
          Get started
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="group relative overflow-hidden border-(--primary-500)/60 bg-white/5 px-8 py-5 text-base text-white transition-all duration-500 hover:scale-105 hover:border-(--primary-300) hover:bg-white/10 hover:text-(--primary-200) before:absolute before:top-2 before:right-2 before:z-10 before:h-10 before:w-10 before:rounded-full before:bg-(--primary-300)/70 before:blur-lg before:transition-all before:duration-500 before:content-[''] after:absolute after:top-4 after:right-6 after:z-10 after:h-16 after:w-16 after:rounded-full after:bg-(--primary-500)/50 after:blur-lg after:transition-all after:duration-500 after:content-[''] hover:before:right-10 hover:before:-bottom-4 hover:before:blur hover:after:-right-6 hover:after:scale-110"
          render={<a href="#how-it-works" />}
          nativeButton={false}
        >
          <span className="relative z-20">See how it works</span>
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
