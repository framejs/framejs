export const camelCase = (string: string): string => {
    return string.toLowerCase().replace(/-(.)/g, (match, letter) => {
        return letter.toUpperCase();
    });
}
