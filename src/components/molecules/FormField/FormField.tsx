import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  as?: 'input' | 'textarea';
  register: any;
  error?: string;
  hasError: boolean;
  placeholder?: string;
  hidden?: boolean;
  maxLength?: number;
  value?: string;
}

const FormField = ({
  label,
  id,
  type = 'text',
  as = 'input',
  register,
  error,
  hasError,
  placeholder = '',
  hidden,
  maxLength,
  value,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const charCount = value?.length ?? 0;
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {maxLength !== undefined && (
          <span
            className={`text-xs tabular-nums ${
              charCount >= maxLength ? 'text-destructive' : 'text-muted-foreground'
            }`}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative min-w-0">
        {as === 'textarea' ? (
          <Textarea
            id={id}
            placeholder={placeholder}
            aria-invalid={hasError}
            maxLength={maxLength}
            className={`min-w-0 w-full max-w-full wrap-break-word max-h-[40vh] resize-none overflow-y-auto scrollbar-subtle ${
              hasError ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            hidden={hidden}
            {...register(id)}
          />
        ) : type === 'file' ? (
          <input
            id={id}
            type="file"
            className={hidden ? 'sr-only' : undefined}
            {...register(id)}
          />
        ) : (
          <Input
            id={id}
            type={type === 'password' && showPassword ? 'text' : type}
            placeholder={placeholder}
            aria-invalid={hasError}
            maxLength={maxLength}
            className={`${type === 'password' ? 'pr-8' : ''} ${
              hasError ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            hidden={hidden}
            {...register(id)}
          />
        )}

        {type === 'password' && (
          <Button
            type="button"
            variant={'ghost'}
            size={'icon-xs'}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1 top-1/2 -translate-y-1/2 active:-translate-y-1/2!"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        )}
      </div>

      {error && <p className="text-xs italic text-left text-destructive">{error}</p>}
    </div>
  );
};

export default FormField;
