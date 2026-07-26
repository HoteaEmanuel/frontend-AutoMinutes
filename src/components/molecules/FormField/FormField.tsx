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
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="relative">
        {as === 'textarea' ? (
          <Textarea
            id={id}
            placeholder={placeholder}
            aria-invalid={hasError}
            className={`max-w-sm wrap-break-word max-h-[50vh] ${
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
            className={hasError ? 'border-destructive focus-visible:ring-destructive' : undefined}
            hidden={hidden}
            {...register(id)}
          />
        )}

        {type === 'password' && (
          <Button
            type="button"
            variant={'ghost'}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 active:-translate-y-1/2!"
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
