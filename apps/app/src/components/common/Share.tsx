import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Event } from '@/pages/Website/website.types';
import { Share2Icon } from 'lucide-react';
import { useState } from 'react';

interface props {
    event: Event;
}

const Share = ({ event }: props) => {
    const FB_LINK_FORMAT = `https://www.facebook.com/sharer/sharer.php?u=${'https://iglesiasbc.com/Iglesia%20pro%20curada/eventos#Iglesia%20pro%20curada'}&quote=${event.title}`;
    const WA_LINK_FORMAT = `https://wa.me/?text=${event.img}%20${event.title}`;
    const TW_LINK_FORMAT = `https://twitter.com/intent/tweet?url=${event.img}&text=${event.title}`;

    const [canShare, setCanShare] = useState(false);

    async function urlToFile(url: string, filename: string) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');

        const blob = await response.blob();

        const file = new File([blob], filename, { type: blob.type });

        return file;
    }

    const shareEvent = async () => {
        const file = await urlToFile(event.img, 'imagen.jpg');
        const shareData: ShareData = {
            title: event.title,
            text: 'Visítenos en nuestro proximo evento',
            files: [file],
        };

        try {
            await navigator.share(shareData);
            setCanShare(true);
        } catch (error) {
            setCanShare(false);
        }
    };

    return (
        <Popover>
            <PopoverTrigger onClick={shareEvent}>
                <Share2Icon className="h-5 w-5" />
            </PopoverTrigger>

            {!canShare && (
                <PopoverContent>
                    <a target="_blank" href={FB_LINK_FORMAT}>
                        Facebook
                    </a>
                    <a target="_blank" href={WA_LINK_FORMAT}>
                        WhatsApp
                    </a>
                    <a target="_blank" href={TW_LINK_FORMAT}>
                        Twitter
                    </a>
                </PopoverContent>
            )}
        </Popover>
    );
};

export default Share;
