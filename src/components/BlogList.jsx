import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import "Source/less/blog.less";

const BlogList = props => {
    const selectedBlogId = useSelector(state => state.blog ? state.blog.selected : null);
    const blogList = useSelector(state => state.blog ? state.blog.list : []);
    const dispatch = useDispatch();

    const handleBlogClick = (blogInfo, index) => {
        dispatch({
            type: 'BLOG_SELECT',
            selected: blogInfo.id
        });
    }

    const renderBlogItems = () => {
        // return blogList.map((it, index) => {
        //     let isSelected = it.id === selectedBlogId;

        //     let itemStyle = cx("blog-item", { 'selected': isSelected });
        //     if (index === blogList.length - 1) {
        //         itemStyle = "blog-last-item";
        //     }

        //     return (<div className={itemStyle} onClick={e => { handleBlogClick(it, index); }}>
        //         <div className={cx("blog-title", { 'selected': isSelected })}>{it.title}</div>
        //         <div className={cx("create-time", { 'selected': isSelected })}>{`於 ${it.created} 建立`}</div>
        //     </div>);
        // });
        return blogList.reduce((acc, cur, index) => {
            let isSelected = cur.id === selectedBlogId;
            let itemStyle = cx("blog-item", { 'selected': isSelected });
            if (index === blogList.length - 1) {
                itemStyle = "blog-last-item";
            }
            let curItem = (<div className={itemStyle} onClick={e => { handleBlogClick(cur, index); }}>
                <div className={cx("blog-title", { 'selected': isSelected })} title={cur.title}>{cur.title}</div>
                <div className={cx("create-time", { 'selected': isSelected })}>{`於 ${cur.created} 建立`}</div>
            </div>);
            return [...acc, curItem];
        }, []);
    }

    return <div class="blog-list">
        <div className="blog-list-title">文章列表</div>
        {renderBlogItems()}
    </div>
}

BlogList.propTypes = {
    blog: PropTypes.object,
    blogList: PropTypes.array,
    onBlogClick: PropTypes.func
}

export default BlogList;