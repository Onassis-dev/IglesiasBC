import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { tsr } from '@/lib/boilerplate';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bibleVerseSchema } from '@iglesiasbc/schemas';
import { Button } from '@/components/ui/button';
import { Airplay, BookOpenIcon, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import bibleInfo from './bible_keys.json';
import { cn } from '@/lib/utils';

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
    trigger?: boolean;
}

const defaultValues: z.infer<typeof bibleVerseSchema> = {
    book: '',
    chapter: 1,
    verse: 1,
};

const BibleForm = ({ open, setOpen, trigger = true }: props) => {
    const bibleForm = useForm<z.infer<typeof bibleVerseSchema>>({
        resolver: zodResolver(bibleVerseSchema),
        defaultValues: defaultValues,
    });

    const [verse, setVerse] = useState<string | null>(null);
    const [open1, setOpen1] = useState(false);

    const bibleKeys = Object.keys(bibleInfo);

    const submit = bibleForm.handleSubmit(async (values: z.infer<typeof bibleVerseSchema>) => {
        const verse = await tsr.presentations.getVerses.query({ query: values });
        if (verse.status === 404) return;

        setVerse(verse.body as string);
        localStorage.setItem('slide', verse.body as string);
        localStorage.setItem('subtitle', `${values.book} ${values.chapter}:${values.verse}`);
        localStorage.setItem(
            'presentation',
            JSON.stringify({
                text: '#ffffff',
                background: '#000000',
            })
        );
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {trigger && (
                <SheetTrigger asChild>
                    <Button variant="outline" className="flex gap-2 px-3">
                        <BookOpenIcon className="size-3.5" />
                        <span className="hidden sm:block">Biblia</span>
                    </Button>
                </SheetTrigger>
            )}
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Biblia (RV1909)</SheetTitle>
                </SheetHeader>
                <SheetBody>
                    <Form {...bibleForm}>
                        <form onSubmit={submit}>
                            <FormField
                                control={bibleForm.control}
                                name="book"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Popover open={open1} onOpenChange={setOpen1}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className={cn('justify-between w-full', !field.value && 'text-muted-foreground')}
                                                    >
                                                        {field.value || 'Elige un libro'}
                                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Elige un libro" />
                                                        <CommandList>
                                                            <CommandGroup>
                                                                {bibleKeys.map((key: any) => (
                                                                    <CommandItem
                                                                        key={key}
                                                                        value={key}
                                                                        keywords={[key.normalize('NFD').replace(/[\u0300-\u036f]/g, '')]}
                                                                        onSelect={(currentValue) => {
                                                                            setOpen1(false);
                                                                            bibleForm.setValue('book', currentValue, {
                                                                                shouldValidate: true,
                                                                            });
                                                                            bibleForm.setValue('chapter', 1);
                                                                            bibleForm.setValue('verse', 1);
                                                                        }}
                                                                    >
                                                                        {key}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-2 ">
                                <FormField
                                    control={bibleForm.control}
                                    name="chapter"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Capítulo"
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        if (!e.target.value || /^[1-9][0-9]*$/.test(e.target.value)) field.onChange(e);
                                                    }}
                                                    onBlur={(e) => {
                                                        const v = e.target.value;
                                                        if (!v) return bibleForm.setValue('chapter', 1);
                                                        const book = bibleForm.getValues('book');
                                                        if (Number(v) > bibleInfo[book as keyof typeof bibleInfo].length)
                                                            bibleForm.setValue('chapter', bibleInfo[book as keyof typeof bibleInfo].length);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <span className="text-lg mt-1">:</span>
                                <FormField
                                    control={bibleForm.control}
                                    name="verse"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Versículo"
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        if (!e.target.value || /^[1-9][0-9]*$/.test(e.target.value)) {
                                                            if (
                                                                !(
                                                                    Number(e.target.value) >
                                                                    bibleInfo[bibleForm.getValues('book') as keyof typeof bibleInfo]?.[
                                                                        Number(bibleForm.getValues('chapter')) - 1
                                                                    ]
                                                                )
                                                            ) {
                                                                field.onChange(e);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">Buscar</Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                        window.open('/projection', 'Presentacion', 'width=1000,height=1000');
                                    }}
                                >
                                    <Airplay className="size-4" />
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <p className="rounded-md border-input border p-2 mt-10">{verse || ''}</p>
                </SheetBody>
            </SheetContent>
        </Sheet>
    );
};

export default BibleForm;
