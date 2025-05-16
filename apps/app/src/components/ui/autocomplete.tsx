import { Command as CommandPrimitive } from 'cmdk';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { Command } from './command';
import { Input } from './input';
import { CommandGroup, CommandItem, CommandList } from './command';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    rows: {
        id: number;
        value: string;
    }[];
    value: string;
    onChange: any;
    placeholder: string;
    identifier: string;
}

const Autocomplete = ({ open, setOpen, rows, value, onChange, placeholder, identifier }: Props) => {
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <Command className="overflow-visible">
                <PopoverAnchor asChild>
                    <CommandPrimitive.Input
                        onKeyDown={(e) => setOpen(e.key !== 'Escape')}
                        onFocus={() => {
                            setOpen(true);
                        }}
                        asChild
                        value={value}
                        onValueChange={onChange}
                        about={identifier}
                    >
                        <Input placeholder={placeholder} value={value} onChange={onChange} />
                    </CommandPrimitive.Input>
                </PopoverAnchor>
                <PopoverContent
                    align="start"
                    className="w-[--radix-popover-trigger-width] p-0"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={(e) => {
                        if (e.target instanceof Element && e.target.hasAttribute('cmdk-input') && e.target.getAttribute('about') === identifier) {
                            e.preventDefault();
                        }
                    }}
                >
                    <CommandList>
                        <CommandGroup>
                            {rows?.map((row: any) => (
                                <CommandItem
                                    key={row.id.toString()}
                                    value={row.value}
                                    onSelect={(currentValue) => {
                                        setOpen(false);
                                        onChange(currentValue);
                                    }}
                                >
                                    {row.value}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </PopoverContent>
            </Command>
        </Popover>
    );
};

export default Autocomplete;
