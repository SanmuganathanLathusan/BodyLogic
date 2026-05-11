import React from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  title?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      type = 'info',
      title,
      icon,
      dismissible = false,
      onDismiss,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(true);

    const typeClasses = {
      info: 'alert-info',
      success: 'alert-success',
      warning: 'alert-warning',
      error: 'alert-error',
    };

    const defaultIcons = {
      info: <Info className="w-5 h-5" />,
      success: <CheckCircle className="w-5 h-5" />,
      warning: <AlertTriangle className="w-5 h-5" />,
      error: <AlertCircle className="w-5 h-5" />,
    };

    const handleDismiss = () => {
      setVisible(false);
      onDismiss?.();
    };

    if (!visible) return null;

    return (
      <div
        ref={ref}
        className={clsx('alert', typeClasses[type], className)}
        {...props}
      >
        <div className="flex-shrink-0">{icon || defaultIcons[type]}</div>
        <div className="flex-1 min-w-0">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            ✕
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
