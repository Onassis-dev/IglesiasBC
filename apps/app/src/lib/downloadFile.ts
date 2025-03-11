export const downloadFile = (buffer: ArrayBuffer, type: string, name: string) => {
    const blob = new Blob([buffer], { type: type });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();

    window.URL.revokeObjectURL(url);
};
