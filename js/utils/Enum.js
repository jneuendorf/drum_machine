export const Enum = function(items) {
    const enumObj = {}
    for (const item of items) {
        enumObj[item] = item
    }
    return Object.freeze(enumObj)
}

export default Enum
