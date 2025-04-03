import { useEffect } from 'react';
import { AutosizeTextarea } from '@/components/ui/auto-resize-textarea';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Expand } from 'lucide-react';

const Projection = () => {
    const [slide, setSlide] = useState<string>('');
    const [presentation, setPresentation] = useState<any>(null);
    const [fullscreen, setFullscreen] = useState<boolean>(false);
    window.addEventListener('storage', (e) => {
        if (e.key === 'presentation') {
            setPresentation(JSON.parse(e.newValue || '{}'));
        }
        if (e.key === 'slide') {
            setSlide(e.newValue || '');
        }
    });

    useEffect(() => {
        setPresentation(JSON.parse(localStorage.getItem('presentation') || '{}'));
        setSlide(localStorage.getItem('slide') || '');
    }, []);

    useEffect(() => {
        if (fullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, [fullscreen]);

    return (
        <div
            id="slide"
            className="flex items-center justify-center p-4 h-screen w-full transition-all duration-700"
            style={{
                background: `${presentation?.background}`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: `${presentation?.text}`,
            }}
        >
            {!fullscreen && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="fixed top-4 right-4"
                    onClick={() => {
                        setFullscreen(!fullscreen);
                    }}
                >
                    <Expand className="size-7" strokeWidth={1.5} />
                </Button>
            )}
            <AutosizeTextarea
                readOnly
                minHeight={1}
                className="text-center h-fit min-h-0 min-w-full py-2.5 bg-transparent resize-none outline-none text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
                value={slide}
            />
        </div>
    );
};

export default Projection;
