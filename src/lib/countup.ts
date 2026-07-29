import * as CountUpModule from 'react-countup';

// Vite's dev-mode CJS interop double-wraps this package's default export; unwrap defensively.
export const CountUp = ((CountUpModule as any).default?.default ??
  (CountUpModule as any).default ??
  CountUpModule) as typeof CountUpModule.default;
