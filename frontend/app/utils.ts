/**
 * Returns a string with first letter uppercase and remaining lowercase
 * @param str 
 * @returns 
 */
export const upperCaseFirstLetter = (str: string): string => {
    str = str.toLowerCase()

    return str.charAt(0).toUpperCase() + str.slice(1);
}