import { forwardRef } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type DownloadButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  loading?: boolean;
  iconOnly?: boolean;
};

const DownloadButton = forwardRef<HTMLButtonElement, DownloadButtonProps>(
  ({ label, loading, iconOnly, className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      disabled={disabled || loading}
      className={cn('export-btn', iconOnly && 'export-btn--icon-only', className)}
      {...props}
    >
      {loading ? (
        <Loader2 className="export-btn-icon animate-spin" aria-hidden="true" />
      ) : (
        <Download className="export-btn-icon" aria-hidden="true" />
      )}
      {!iconOnly && <span>{loading ? 'Exporting…' : label}</span>}
    </button>
  ),
);
DownloadButton.displayName = 'DownloadButton';

export default DownloadButton;
