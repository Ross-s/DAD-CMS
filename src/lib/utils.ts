export function isEmptyOrSpaces(str?: string | null){
    return str === null || str === undefined || str.match(/^ *$/) !== null;
}