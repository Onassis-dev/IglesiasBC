import '@/lib/boilerplate';
import { useEffect, useRef, useState } from 'react';
import { api, tsr } from '@/lib/boilerplate';
import { usePathStore } from '@/lib/store';
import { AutosizeTextarea } from '@/components/ui/auto-resize-textarea';
import { ChevronRight, ChevronLeft, PlusIcon, Trash, Save, Airplay, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showPromise } from '@/lib/showFunctions';
import PresentationsForm from '../Presentations/PresentationsForm';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

export const Slides = () => {
    const [id, setId] = useState('');
    const { setPath } = usePathStore((state) => state);
    const [slides, setSlides] = useState<string[]>([]);
    const [selectedId, setSelectedId] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        setId(queryParams.get('id') || '');
    }, []);

    const { data: { body: presentation } = {} } = tsr.presentations.getOne.useQuery({
        queryKey: ['slides', String(id)],
        enabled: !!id,
        queryData: {
            params: {
                id,
            },
        },
    });

    useEffect(() => {
        if (presentation?.name) setPath(presentation.name);
        if (presentation?.slides) setSlides(presentation.slides);
        localStorage.setItem('presentation', JSON.stringify(presentation));
    }, [presentation]);

    useEffect(() => {
        localStorage.setItem('slide', slides[selectedId]);
    }, [slides, selectedId]);

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setSlides((items) => {
                const oldIndex = slides.findIndex((slide) => slide === active.id);
                const newIndex = slides.findIndex((slide) => slide === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const handleSave = () => {
        showPromise(
            api(tsr.presentations.put, {
                ...presentation,
                slides,
            }),
            'Guardado'
        );
    };

    const SortableSlide = ({ slide, index, isSelected, onSelect }) => {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
            id: slide,
            attributes: {
                role: 'button',
                tabIndex: 0,
            },
        });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`flex items-center gap-0.5 text-sm rounded-md w-full md:w-72 min-h-[30px] ${isSelected ? 'border-primary' : ''}`}
            >
                <div className="p-1 cursor-grab text-muted-foreground hover:text-foreground transition-colors" {...attributes} {...listeners}>
                    <GripVertical className="size-4" />
                </div>
                <button
                    className="cursor-pointer py-0.5 px-2 overflow-hidden text-ellipsis whitespace-nowrap text-left bg-background border rounded-md flex-1 min-h-[30px]"
                    onClick={() => onSelect(index)}
                >
                    {slide}
                </button>
            </div>
        );
    };

    return (
        <div className="grid md:grid-cols-[auto_1fr] gap-4">
            <div className="flex flex-col gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-left whitespace-nowrap overflow-hidden text-ellipsis w-72 block"
                    onClick={() => setOpen(true)}
                >
                    {presentation?.title}
                </Button>
                <div className="flex gap-4 flex-col">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                        <SortableContext items={slides} strategy={verticalListSortingStrategy}>
                            {slides?.map((slide: any, index: number) => (
                                <SortableSlide key={index} slide={slide} index={index} isSelected={index === selectedId} onSelect={setSelectedId} />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex justify-between  w-full">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    if (selectedId > 0) setSelectedId(selectedId - 1);
                                }}
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    if (selectedId < slides.length - 1) setSelectedId(selectedId + 1);
                                }}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                {selectedId + 1} / {slides.length}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                window.open('/projection', 'Presentacion', 'width=1000,height=1000');
                            }}
                        >
                            <Airplay className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                if (slides.length === 1) return;
                                const newSlides = [...slides];
                                newSlides.splice(selectedId, 1);
                                setSlides(newSlides);
                                setSelectedId(selectedId === 0 ? 0 : selectedId - 1);
                            }}
                        >
                            <Trash className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                setSlides([...slides, '']);
                                setSelectedId(slides.length);
                            }}
                        >
                            <PlusIcon className="size-4" />
                        </Button>
                        <Button size="sm" className="gap-1.5" onClick={handleSave}>
                            <Save className="size-4" />
                            Guardar
                        </Button>
                    </div>
                </div>
                <div
                    ref={containerRef}
                    className="flex items-center justify-center rounded-xl p-4 aspect-video border w-full"
                    style={{
                        background: `${presentation?.background}`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: `${presentation?.text}`,
                    }}
                >
                    <AutosizeTextarea
                        minHeight={1}
                        maxHeight={containerRef.current?.clientHeight}
                        className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-center h-fit min-h-0 w-full py-2.5 bg-transparent resize-none outline-none"
                        value={slides[selectedId]}
                        onChange={(e) => {
                            const newSlides = [...slides];
                            newSlides[selectedId] = e.target.value;
                            setSlides(newSlides);
                        }}
                        placeholder="Escribe aqui..."
                    />
                </div>
            </div>
            <PresentationsForm open={open} setOpen={setOpen} id={id} trigger={false} />
        </div>
    );
};

export default Slides;
