export const toNameCase = (value: string): string => {
    const firstLetter = value.substring(0, 1).toUpperCase();
    const rest = value.substring(1).toLowerCase();
    return `${firstLetter}${rest}`;
};
