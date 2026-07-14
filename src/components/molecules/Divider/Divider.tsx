import { Separator } from '@/components/ui/separator';
const Divider = ({ text }: { text: string }) => {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full h-px"/>
      </div>
      <div className="relative flex justify-center z-50">
        <span className="bg-card px-5 text-sm text-muted-foreground">{text}</span>
      </div>
    </div>
  );
};

export default Divider;
