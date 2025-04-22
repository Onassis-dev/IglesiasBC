import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { X } from 'lucide-react';
import { Button } from './button';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetBody = ({ className, children }: { className?: string; children?: any }) => (
    <div className={cn('overflow-y-auto pt-6 px-8 pb-0', className)}>{children}</div>
);

const SheetOverlay = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>>(
    ({ className, ...props }, ref) => (
        <SheetPrimitive.Overlay
            className={cn(
                'fixed inset-0 z-50 bg-black/60  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                className
            )}
            {...props}
            ref={ref}
        />
    )
);
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetClass =
    'fixed z-50 bg-background flex flex-col shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 right-0 h-full w-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-lg';

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
    className?: string;
    submit?: () => void;
}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
    ({ className, children, ...props }, ref) => (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content onOpenAutoFocus={(e) => e.preventDefault()} ref={ref} className={cn(sheetClass, className)} {...props}>
                {children}

                <SheetPrimitive.Close className="absolute left-8 sm:left-auto right-auto sm:right-8 top-[1.125rem] sm:top-5 rounded-sm ring-offset-background transition-opacity focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="size-4 hidden sm:flex" />
                    <ChevronLeft className="size-5 sm:hidden" />
                    <span className="sr-only">Close</span>
                </SheetPrimitive.Close>

                <SheetFooter>
                    <Button asChild variant="outline" className="hidden sm:flex h-8" size="sm">
                        <SheetPrimitive.Close>Cerrar</SheetPrimitive.Close>
                    </Button>
                    {props.submit && (
                        <Button className="w-full sm:w-auto h-8" size="sm" onClick={props.submit}>
                            Guardar
                        </Button>
                    )}
                </SheetFooter>
            </SheetPrimitive.Content>
        </SheetPortal>
    )
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex sm:text-left p-0 border-b min-h-14 px-8 items-center justify-center sm:justify-start', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex border-t justify-end items-center h-20 min-h-20 sm:min-h-14 sm:h-14 pb-4 sm:pb-0 rounded-b-xl px-8 mt-auto left-0 right-0 bg-background flex-row space-x-2 ',
            className
        )}
        {...props}
    />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Title>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>>(
    ({ className, ...props }, ref) => (
        <SheetPrimitive.Title ref={ref} className={cn('text-md font-medium sm:font-semibold text-foreground', className)} {...props} />
    )
);
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => <SheetPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />);
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
    Sheet,
    SheetBody,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
};
