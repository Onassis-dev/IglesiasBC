import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface ColorPicker2Props {
    value: string;
    onChange: (value: string) => void;
}

function ColorPicker2({ value, onChange }: ColorPicker2Props) {
    const sanitizeHex = (hex: string) => {
        hex = hex.trim();
        if (!hex.startsWith('#')) hex = '#' + hex;
        if (hex.length > 7) hex = hex.slice(0, 7);
        return hex;
    };

    return (
        <div className="w-full flex gap-2">
            <Input value={value} onChange={(e) => onChange(sanitizeHex(e.target.value))} />
            <Popover>
                <PopoverTrigger>
                    <div className="h-8 w-8 rounded-md border border-input" style={{ backgroundColor: value }}></div>
                </PopoverTrigger>
                <PopoverContent className="bg-none p-0 w-fit m-0 border-none" side="top">
                    <HexColorPicker color={value} onChange={onChange} />
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default ColorPicker2;
