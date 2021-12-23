import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BlogList from "Source/components/BlogList";
import BlogView from "Source/components/BlogView";
import blogAction from 'Source/actions/blog';

class BlogPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            blogList: [],
            currentBlog: {},
            selected: null
        };
    }

    componentWillMount() {
        // console.log('[BlogPage] props: ', this.props);
        if (this.props.userId) {
            this.props.getBlogList(this.props.userId);
        }
    }

    handleBlogClick = (blogInfo, index) => {
        if (blogInfo) {
            this.setState({
                currentBlog: blogInfo
            });
        }
    }

    handleDeleteBlog = (blogId) => {
        this.props.deleteBlog(blogId);
    }

    handleCreateBlog = (blogInfo) => {
        this.props.createBlog(blogInfo, this.props.userId);
    }

    handleUpdateBlog = (blogInfo) => {
        this.props.updateBlog(blogInfo);
    }

    render() {
        const { blogList, currentBlog } = this.state;

        return <div className="blog-block">
            <BlogList
                blog={currentBlog}
                blogList={blogList}
                onBlogClick={(blogInfo, index) => { this.handleBlogClick(blogInfo, index); }} />
            <BlogView
                blog={currentBlog}
                onCreateClick={blogInfo => { this.handleCreateBlog(blogInfo); }}
                onEditClick={blogInfo => { this.handleUpdateBlog(blogInfo); }}
                onDeleteClick={blogId => { this.handleDeleteBlog(blogId); }}
            />
        </div>
    }
}

BlogPage.propTypes = {
    userId: PropTypes.number,
    blog: PropTypes.object,
    getBlogList: PropTypes.func
}

const mapStateToProps = (state) => {
    return {
        blog: state.blog
    }
}

// const actionCreators = {
//     getBlogList: blogAction.getBlogList,
//     createBlog: blogAction.createBlog,
//     updateBlog: blogAction.updateBlog,
//     deleteBlog: blogAction.deleteBlog,
//     selectBlog: blogAction.selectBlog
// }
const mapDispatchToProps = (dispatch, getState) => {
    return {
        getBlogList: (userId) => {
            dispatch(blogAction.getBlogList(userId));
        },
        createBlog: (blog, userId) => {
            dispatch(blogAction.createBlog(blog, userId));
        },
        updateBlog: (blog) => {
            dispatch(blogAction.updateBlog(blog));
        },
        deleteBlog: (id) => {
            dispatch(blogAction.deleteBlog(id));
        },
        selectBlog: (id) => {
            dispatch(blogAction.selectBlog(id));
        }
    }
}

// export default connect(mapStateToProps, actionCreators)(BlogPage);
export default connect(mapStateToProps, mapDispatchToProps)(BlogPage);