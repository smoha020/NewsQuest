const initState = {
    posts: [],
    post: '',
    error: '',
    comment: '',
    loadingPost: true
}

const PostReducer = (state = initState, action) => {
    switch(action.type) {
        case 'LOADING_POST':
            return {
                ...state,
                loadingPost: true
            }
        case 'GET_POSTS_SUCCESS': 
            return {
                posts: [...action.payload],
                error: ''
            }
        case 'GET_POSTS_FAILURE': 
            return {
                posts: [],
                error: action.payload
            }
        case 'CREATE_POST_SUCCESS': 
            return {
                posts: [action.payload.data, ...state.posts],
                error: ''
            }
        case 'CREATE_POST_FAILURE': 
            return {
                ...state,
                error: action.payload
            }
        case 'GET_POST_SUCCESS': 
            return {
                ...state,
                loadingPost: false,
                post: action.payload,
                error: ''
            }
        case 'GET_POST_FAILURE': 
            return {
                ...state,
                loadingPost: false,
                post: '',
                error: action.payload
            }
        case 'DELETE_POST_SUCCESS': 
            return {
                ...state,
                posts: state.posts.filter( post => post != action.payload),
                error: ''
            }
        case 'DELETE_POST_FAILURE': 
            return {
                ...state,
                error: action.payload
            }
        case 'ADD_COMMENT_SUCCESS': 
            return {
                ...state,
                loadingPost: false,
                comment: action.payload
            }
        case 'ADD_COMMENT_FAILURE': 
            return {
                ...state,
                loadingPost: false, 
                error: action.payload
            }
        case 'LIKE_POST_SUCCESS': 
        let index = state.posts.findIndex(post => post._id === action.payload.postId)
        let updatedPost = state.posts[index]
        updatedPost.likeCount = updatedPost.likeCount + 1
        state.posts[index] = updatedPost
            return {
                ...state
            }
        case 'UNLIKE_POST_FAILURE': 
            return {
                ...state
            }
        default: return state
    }
}

export default PostReducer