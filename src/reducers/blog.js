const initialState = {
    status: 'normal',
    list: [],
    article: null,
    selected: null
};

const blogReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'BLOG_SELECT':
            return Object.assign({}, state, {
                ...state,
                selected: action.selected
            });
        case 'BLOG_LIST':
            let _selected = null;
            if (!state.selected && action.list.length > 0) {
                _selected = action.list[0].id;
            }
            return Object.assign({}, state, {
                ...state,
                status: action.status,
                list: action.list,
                selected: _selected
            });
        case 'BLOG_GET':
            return Object.assign({}, state, {
                ...state,
                status: action.status,
                article: action.article
            });
        case 'BLOG_DELETE':

            let delIndex = state.list.findIndex(it => `${it.id}` === `${action.id}`);
            // console.log('delete index: ', delIndex);
            let next = delIndex + 1;
            if (next >= state.list.length) {
                next = delIndex - 1;
            }

            let newSelected = state.selected;
            if (next < 0) {
                newSelected = null;
            } else {
                newSelected = state.list[next].id;
            }

            let _list = state.list.filter(it => `${it.id}` !== `${action.id}`);
            // console.log('hl delete list: ', _list)

            return Object.assign({}, state, {
                ...state,
                status: action.status,
                list: _list,
                selected: newSelected
            });
        case 'BLOG_CREATE':
            state.list.push({
                id: action.id,
                title: action.title,
                content: action.content,
                updated: action.updated,
                created: action.created
            })

            return Object.assign({}, state, {
                ...state,
                status: action.status,
                selected: action.id
            });
        case 'BLOG_UPDATE':
            console.log('hl reducer update: ', action)
            let upList = state.list.map((it, index) => {
                if (it.id === action.id) {
                    return {
                        id: it.id,
                        title: action.title,
                        content: action.content,
                        updated: action.updated,
                        created: action.created
                    }
                }

                return it;
            })
            return Object.assign({}, state, {
                ...state,
                status: action.status,
                list: upList
            });
        case 'BLOG_CLEAR':
            return Object.assign({}, {
                status: 'normal',
                list: [],
                article: null,
                selected: null
            });
        default:
            return state;
    }
}

export default blogReducer;