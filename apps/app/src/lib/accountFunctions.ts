export const saveUserData = (userData: any[]) => {
    Object.keys(userData).forEach((key: any) => {
        localStorage.setItem(key, userData[key]);
    });
};
