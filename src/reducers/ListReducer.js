// A lot taken from https://github.com/dat2/redux-list
const Types = {
    APPEND: 'LIST_REDUCER/APPEND',
    INSERT_AT: 'LIST_REDUCER/INSERT_AT',
    REMOVE: 'LIST_REDUCER/REMOVE',
    REMOVE_AT: 'LIST_REDUCER/REMOVE_AT',
    UPDATE: 'LIST_REDUCER/UPDATE',
    UPDATE_AT: 'LIST_REDUCER/UPDATE_AT',
}

const ListActions = {
    append: (...items) => ({
        type: Types.APPEND,
        items
    }),
    insertAt: (item, index) => ({
        type: Types.INSERT_AT,
        item,
        index,
    }),
    remove: (item) => ({
        type: Types.REMOVE,
        item,
    }),
    removeAt: (index) => ({
        type: Types.REMOVE_AT,
        index,
    }),
    update: (item) => ({
        type: Types.UPDATE,
        item,
    }),
    updateAt: (index) => ({
        type: Types.UPDATE_AT,
        index,
    })
}


const createListReducer = function(reducer, initialState=[]) {
    return function(state=[], actionWithMeta) {
        if (!actionWithMeta.meta) {
            return state
        }
        const {meta, ...action} = actionWithMeta
        const {type, index} = meta
        // Handling a multiple items.
        if (meta.items) {
            const items = typeof(meta.items) === 'function' ? meta.items() : meta.items
            const newItems = items.map((item, index) =>
                reducer(item, action, {list: state, index})
            )
            switch (type) {
                case Types.APPEND:
                    return state.concat(newItems)
                    default:
                        throw new Error(
                            `The action contains a 'meta' field which doesn't contain a`
                            + ` correct 'type'. Most likely you forgot to use an`
                            + ` action creator in your action's 'meta' in '${action.type}'`
                            + ` (e.g. 'ListActions.append(item)').`
                        )
            }
        }
        // Handling a single item.
        else {
            let {item} = meta
            // Action is based on index.
            if (index !== undefined && item === undefined) {
                item = state[index]
            }
            if (typeof(item) === 'function') {
                item = item()
            }
            // apply single-item reducer
            const newItem = reducer(item, action, {list: state})
            switch (type) {
                // case Types.APPEND:
                //     return state.concat([newItem])
                case Types.INSERT_AT:
                    return state.slice(0, index).concat([newItem]).concat(state.slice(index))
                case Types.REMOVE:
                    return state.filter(e => e !== item)
                case Types.REMOVE_AT:
                    return state.filter((e, i) => i !== index)
                case Types.UPDATE:
                    return state.map(e => e === item ? newItem : e)
                case Types.UPDATE_AT:
                    return state.map((e, i) => i === index ? newItem : e)
                default:
                    throw new Error(
                        `The action contains a 'meta' field which doesn't contain a`
                        + ` correct 'type'. Most likely you forgot to use an`
                        + ` action creator in your action's 'meta' in '${action.type}'`
                        + ` (e.g. 'ListActions.append(item)').`
                    )
            }
        }
    }
}


export {createListReducer as listReducer, ListActions}
export default createListReducer
