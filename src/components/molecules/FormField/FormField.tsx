import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  register: any;
  error?: string;
}

const FormField = ({ label, id, type = 'text', register, error }: FormFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} {...register(id)} />
      {error && <p className="text-xs italic text-left text-destructive">{error}</p>}
    </div>
  );
};

export default FormField;