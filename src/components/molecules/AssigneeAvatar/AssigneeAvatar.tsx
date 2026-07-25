import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getAvatarColorClass, getInitials } from '@/features/action-items/avatarColor';

type AssigneeAvatarProps = {
  name: string;
  className?: string;
};

const AssigneeAvatar = ({ name, className }: AssigneeAvatarProps) => (
  <Avatar size="sm" className={className}>
    <AvatarFallback className={cn('font-medium text-white', getAvatarColorClass(name))}>
      {getInitials(name)}
    </AvatarFallback>
  </Avatar>
);

export default AssigneeAvatar;
