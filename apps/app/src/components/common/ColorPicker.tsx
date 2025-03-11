import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

function ColorPicker({ color, setColor }: any) {
    const sanitizeHex = (hex: string) => {
        hex = hex.trim();
        if (!hex.startsWith("#")) hex = "#" + hex;
        if (hex.length > 7) hex = hex.slice(0, 7);
        return hex;
    };

    return (
        <div className="w-full flex gap-2">
            <Input value={color} onChange={(e) => setColor(sanitizeHex(e.target.value))} />
            <Popover>
                <PopoverTrigger>
                    <div className="h-8 w-8 rounded-md border border-input" style={{ backgroundColor: color }}></div>
                </PopoverTrigger>
                <PopoverContent className="bg-none p-0 w-fit m-0 border-none" side="top">
                    <HexColorPicker color={color} onChange={setColor} />
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default ColorPicker;
