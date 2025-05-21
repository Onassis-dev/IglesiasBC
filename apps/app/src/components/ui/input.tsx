import * as React from 'react';

import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = 'Input';

const IconInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, children, ...props }, ref) => {
    return (
        <div className="relative w-full h-full">
            <div className="absolute left-2.5 top-[11px] size-3.5 text-muted-foreground">{children}</div>
            <Input className={cn('pl-8', className)} ref={ref} {...props} />
        </div>
    );
});
IconInput.displayName = 'Input';

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
    return (
        <div className="relative w-full sm:max-w-56 h-full">
            <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input type={'search'} className={cn('pl-8 h-9 w-full shadow-sm', className)} ref={ref} {...props} />
        </div>
    );
});
SearchInput.displayName = 'Input';

export { Input, SearchInput, IconInput };
