import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  register: any;
  error?: string;
}

const FormField = ({ label, id, type = 'text', register, error }: FormFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);
return (
  <div className="flex flex-col gap-2">
    <Label htmlFor={id}>{label}</Label>

    <div className="relative">
      <Input
        id={id}
        type={type === 'password' && showPassword ? 'text' : type}
        {...register(id)}
      />
      {type === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>

    {error && <p className="text-xs italic text-left text-destructive">{error}</p>}
  </div>
);
};

export default FormField;