export function formatDate(dateStr: string | Date | null): string {
    if (dateStr === null) return "";
    let date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";

    const parts = date.toISOString().split("T")[0].split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

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
