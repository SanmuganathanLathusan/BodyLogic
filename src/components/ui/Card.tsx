import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ interactive = false, hoverEffect = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'card',
          interactive && 'card-interactive',
          hoverEffect && 'card-hover',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
