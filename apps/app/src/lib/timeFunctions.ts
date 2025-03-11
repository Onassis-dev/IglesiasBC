import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatToTZ(dateStr: string | Date | null): Date | null {
    if (dateStr === null) return null;
    let date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;

    return new Date(new Date(date).getTime() + (new Date().getTimezoneOffset() / 60) * 60 * 60 * 1000);
}

export function formatToUTC(dateStr: string | Date): Date | undefined {
    let date = new Date(dateStr);
    if (isNaN(date.getTime())) return;

    return new Date(new Date(date).getTime() - (new Date().getTimezoneOffset() / 60) * 60 * 60 * 1000);
}

export function displayDate(baseDate: Date | string | null, formatText?: string) {
    if (!baseDate) return '';
    const date = new Date(baseDate);
    return format(formatToTZ(date)!, formatText || 'PPP', { locale: es });
}
