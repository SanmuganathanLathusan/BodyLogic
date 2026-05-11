import React from 'react';
import clsx from 'clsx';
import { InboxIcon } from 'lucide-react';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <InboxIcon className="empty-state-icon" />,
  title,
  description,
  action,
  className,
  ...props
}) => {
  return (
    <div className={clsx('empty-state', className)} {...props}>
      {icon}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
