export const calculateAge = (birthday: string | Date) => {
    const birthDate = new Date(birthday);
    const today = new Date(new Date().toISOString().split('T')[0]);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export function setCurrentYear(isoString: string) {
    const currentYear = new Date().getFullYear().toString();
    return currentYear + isoString.slice(4);
}
