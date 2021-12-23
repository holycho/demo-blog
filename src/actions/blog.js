import { protocol, hostname, port } from "Source/utils";

const getBlogList = (userId) => {
    return async (dispatch, getState) => {
        let url = `${protocol}//${hostname}:${port}/api/blogs/${userId}`;
        // console.log('hl getBlogList - url: ', url);

        try {
            let response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            let res = await response.json();
            dispatch({
                type: 'BLOG_LIST',
                status: res.message,
                list: res.data
            });
        } catch (error) {
            console.error('fetch error', error);
            dispatch({
                type: 'BLOG_LIST',
                status: 'error'
            });
        }
    };
}

const createBlog = (blog, userId) => {
    return async (dispatch, getState) => {
        let url = `${protocol}//${hostname}:${port}/api/blog`;
        // console.log('hl createBlog - url: ', url);

        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: blog.title,
                    content: blog.content,
                    user_id: userId
                })
            });

            let res = await response.json();
            dispatch({
                type: 'BLOG_CREATE',
                status: 'success',
                id: res.id,
                title: res.data.title,
                content: res.data.content,
                updated: res.data.updated,
                created: res.data.created
            });
        } catch (error) {
            console.error('fetch error', error);
            dispatch({
                type: 'BLOG_CREATE',
                status: 'error'
            });
        }
    }
}

const updateBlog = (blog) => {
    return async (dispatch, getState) => {
        let url = `${protocol}//${hostname}:${port}/api/blog/${blog.id}`;

        try {
            let response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: blog.title,
                    content: blog.content
                })
            });

            let res = await response.json();
            // console.log('hl receive updated blog: ', res);
            dispatch({
                type: 'BLOG_UPDATE',
                status: 'success',
                id: res.id,
                title: res.data.title,
                content: res.data.content,
                updated: res.data.updated,
                created: res.data.created
            });
        } catch (error) {
            console.error('fetch error', error);
            dispatch({
                type: 'BLOG_UPDATE',
                status: 'error'
            });
        }
    }
}

const getBlog = (id) => {
    return async (dispatch, getState) => {
        let url = `${protocol}//${hostname}:${port}/api/blog/${id}`;

        try {
            let response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            let res = await response.json();
            dispatch({
                type: 'BLOG_GET',
                status: 'success',
                id: res.id,
                title: res.data.title,
                content: res.data.content,
                updated: res.data.updated,
                created: res.data.created
            });
        } catch (error) {
            console.error('fetch error', error);
            dispatch({
                type: 'BLOG_GET',
                status: 'error'
            });
        }
    }
}

const deleteBlog = (id) => {
    return async (dispatch, getState) => {
        let url = `${protocol}//${hostname}:${port}/api/blog/${id}`;

        try {
            let response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            let res = await response.json();
            dispatch({
                type: 'BLOG_DELETE',
                status: 'success',
                id: res.id
            });
        } catch (error) {
            console.error('fetch error', error);
            dispatch({
                type: 'BLOG_DELETE',
                status: 'error'
            });
        }
    }
}

const selectBlog = (blogId) => {
    return {
        type: 'BLOG_SELECT',
        selected: blogId
    };
}

const clearAll = () => {
    return {
        type: 'BLOG_CLEAR'
    };
}

export default {
    getBlogList,
    createBlog,
    updateBlog,
    getBlog,
    deleteBlog,
    selectBlog,
    clearAll
}