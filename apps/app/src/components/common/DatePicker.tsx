import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { format } from 'date-fns';
import { showError } from '@/lib/showFunctions';

const DatePicker = ({ field }: any) => {
    const [date, setDate] = useState(field.value ? format(field.value, 'MM/dd/yyy', { locale: es }) : '');

    useEffect(() => {
        setDate(field.value ? format(field.value, 'MM/dd/yyy', { locale: es }) : '');
    }, [field.value]);

    const formatDate = (value: string) => {
        const formattedDate = value.replace(/\D/g, '');
        if (formattedDate.length <= 2) {
            return formattedDate;
        }
        if (formattedDate.length <= 4) {
            return `${formattedDate.slice(0, 2)}/${formattedDate.slice(2, 4)}`;
        }
        return `${formattedDate.slice(0, 2)}/${formattedDate.slice(2, 4)}/${formattedDate.slice(4, 8)}`;
    };

    const updateDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatDate(e.target.value);
        setDate(formatted);
    };

    return (
        <div className="flex">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn('justify-start text-left font-normal rounded-r-none border-r-0 px-3', !field.value && 'text-muted-foreground')}
                    >
                        <CalendarIcon className="size-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent side="top" className="w-auto p-0">
                    <Calendar
                        captionLayout="dropdown"
                        fromYear={1920}
                        toYear={new Date().getFullYear()}
                        mode="single"
                        defaultMonth={field.value}
                        locale={es}
                        selected={field.value}
                        onSelect={field.onChange}
                    />
                </PopoverContent>
            </Popover>
            <Input
                type="text"
                placeholder="mm/dd/yyy"
                value={date}
                onBlur={(e) => {
                    if (!isNaN(new Date(e.target.value).getTime())) {
                        field.onChange(new Date(e.target.value));
                    } else {
                        showError('Fecha inválida');
                        field.onChange(field.value);
                        setDate('');
                    }
                }}
                onChange={updateDate}
                className="rounded-l-none"
            />
        </div>
    );
};

export default DatePicker;
