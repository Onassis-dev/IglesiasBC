import '@/lib/boilerplate';
import { useEffect, useState } from 'react';
import { api, tsr } from '@/lib/boilerplate';
import { usePathStore } from '@/lib/store';
import { AutosizeTextarea } from '@/components/ui/auto-resize-textarea';
import { ChevronRight, ChevronLeft, PlusIcon, Trash, Save, Airplay, GripVertical, Edit } from 'lucide-react';
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
    const [slides, setSlides] = useState<{ id: string; text: string }[]>([]);
    const [selectedId, setSelectedId] = useState<number>(0);
    const [open, setOpen] = useState(false);

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
        if (presentation?.slides) setSlides(presentation.slides.map((slide: any) => ({ id: crypto.randomUUID(), text: slide })));
        localStorage.setItem('presentation', JSON.stringify(presentation));
    }, [presentation, setPath]);

    useEffect(() => {
        localStorage.setItem('slide', slides[selectedId]?.text);
    }, [slides, selectedId]);

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setSlides((items) => {
                const oldIndex = slides.findIndex((slide) => slide.id === active.id);
                const newIndex = slides.findIndex((slide) => slide.id === over.id);

                if (oldIndex < selectedId && newIndex >= selectedId) {
                    setSelectedId(selectedId - 1);
                } else if (oldIndex > selectedId && newIndex <= selectedId) {
                    setSelectedId(selectedId + 1);
                } else if (oldIndex === selectedId) {
                    setSelectedId(newIndex);
                }

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const handleSave = () => {
        showPromise(
            api(tsr.presentations.put, {
                ...presentation,
                slides: slides.map((slide) => slide.text),
            }),
            'Guardado'
        );
    };

    const SortableSlide = ({ slide, index, isSelected, onSelect }: any) => {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
            id: slide.id,
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
            <button
                ref={setNodeRef}
                style={style}
                className={`flex items-center gap-0.5 text-sm bg-background  border rounded-md w-full md:w-72 min-h-[30px] ${isSelected ? 'border-primary' : ''}`}
                onClick={() => onSelect(index)}
            >
                <GripVertical
                    style={{ touchAction: 'none' }}
                    className="size-8 text-muted-foreground p-2 !outline-none"
                    {...attributes}
                    {...listeners}
                />
                <span className="flex-1 overflow-hidden text-ellipsis pr-2 whitespace-nowrap text-left">{slide.text}</span>
            </button>
        );
    };

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-4">
                <Button variant="outline" size="sm" className="  md:w-72 gap-2 items-center justify-start flex" onClick={() => setOpen(true)}>
                    <Edit className="size-3.5" />
                    <span className="flex-1 whitespace-nowrap text-ellipsis overflow-hidden text-left">{presentation?.title}</span>
                </Button>
                <div className="flex gap-4 flex-col">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
                        <SortableContext items={slides.map((slide) => slide.id)} strategy={verticalListSortingStrategy}>
                            {slides?.map((slide: any, index: number) => (
                                <SortableSlide
                                    key={slide.id}
                                    slide={slide}
                                    index={index}
                                    isSelected={index === selectedId}
                                    onSelect={setSelectedId}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-2">
                    <div className="flex justify-between w-full">
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
                                setSlides([...slides, { id: crypto.randomUUID(), text: '' }]);
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
                    id="slide"
                    className="flex items-center justify-center rounded-xl p-4 aspect-video border w-full"
                    style={{
                        backgroundColor: `${presentation?.background}`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: `${presentation?.text}`,
                    }}
                >
                    <AutosizeTextarea
                        minHeight={1}
                        maintainAspectRatio
                        className="text-md sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-center h-fit min-h-0 w-full py-2.5 bg-transparent resize-none outline-none"
                        value={slides[selectedId]?.text}
                        onChange={(e) => {
                            const newSlides = [...slides];
                            if (newSlides[selectedId]) newSlides[selectedId].text = e.target.value;
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
