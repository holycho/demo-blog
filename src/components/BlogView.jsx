import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';

// Material UI - input
import TextField from '@material-ui/core/TextField';

// Material UI - Dialog
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// Material UI - Icons
import AddCircleOutlineRoundedIcon from '@material-ui/icons/AddCircleOutlineRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';

import "Source/less/blog.less";

import { makeStyles } from '@material-ui/core/styles';
const iconStyles = makeStyles({
    root: {
        fontSize: (props) => props.fontSize,
        margin: (props) => props.margin,
        color: (props) => props.color
    }
});
const modalStyles = makeStyles({
    root: {
        backgroundColor: (props) => props.backgroundColor,
        color: (props) => props.color
    }
});
const titleStyles = makeStyles({
    root: {
        margin: '0px 0px 15px 0px'
    }
});

const BlogView = props => {
    // state
    const [editBlog, setEditBlog] = useState(null);
    const [openMessageDialog, setOpenMessageDialog] = useState(false);
    const [openInputDialog, setOpenInputDialog] = useState(false);
    const [editMode, setEditMode] = useState('new');
    
    // redux
    const selectedId = useSelector(state => state.blog ? state.blog.selected : null);
    const blogList = useSelector(state => state.blog ? state.blog.list : []);

    const selectedBlog = blogList.find(it => it.id === selectedId);
    console.log("[BlogView] current blog: ", selectedBlog);

    // style
    const icon = iconStyles({ fontSize: 24, margin: '3px 3px', color: '#1B8EF2' });
    const modal = modalStyles({ backgroundColor: '#38D0F2', color: 'white' });
    const titleText = titleStyles();

    const handleMessageDialogClose = () => {
        setOpenMessageDialog(false);
    }

    const handleDeleteClick = () => {
        setOpenMessageDialog(true);
    }

    const handleDeleteCancel = () => {
        setOpenMessageDialog(false);
    }

    const handleDeleteOk = () => {
        setOpenMessageDialog(false);

        if (props.onDeleteClick) {
            props.onDeleteClick(selectedBlog.id);
        }
    }

    let messageDialog = <Dialog
        open={openMessageDialog}
        onClose={handleMessageDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
    >
        <DialogTitle className={modal.root} id="alert-dialog-title">{"訊息提示"}</DialogTitle>
        <DialogContent dividers>
            <DialogContentText id="alert-dialog-description">
                {`${selectedBlog ? '是否要刪除此文章 [' + selectedBlog.title + ']' : ''} ?`}
            </DialogContentText>
        </DialogContent>

        <DialogActions>
            <Button className={modal.root} onClick={handleDeleteCancel}>
                取消
            </Button>
            <Button className={modal.root} onClick={handleDeleteOk}>
                確定
            </Button>
        </DialogActions>
    </Dialog>;

    const handleInputDialogClose = () => {
        setOpenInputDialog(false);
    }

    const handleEditClick = (editMode) => {
        setOpenInputDialog(true);
        setEditMode(editMode);
        if (editMode === 'new') {
            setEditBlog({
                title: '',
                content: ''
            });
        } else {
            setEditBlog({
                // title: props.blog.title,
                // content: props.blog.content
                title: selectedBlog.title,
                content: selectedBlog.content
            });
        }
    }

    const handleEditCancel = () => {
        setOpenInputDialog(false);
    }

    const handleEditOk = () => {
        setOpenInputDialog(false);

        if (editMode === 'new') {
            props.onCreateClick(editBlog);
        } else {
            props.onEditClick({
                // id: props.blog.id,
                id: selectedBlog.id,
                title: editBlog.title,
                content: editBlog.content
            });
        }
    }

    const handleTitleChange = (e) => {
        const _content = editBlog.content

        setEditBlog({
            title: e.target.value,
            content: _content
        });
    }

    const handleContentChange = (e) => {
        const _title = editBlog.title

        setEditBlog({
            title: _title,
            content: e.target.value
        });
    }

    let inputDialog = <Dialog
        open={openInputDialog}
        onClose={handleInputDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
    >
        <DialogTitle id="alert-dialog-title" className={modal.root}>{editMode === 'new' ? "新增一篇文章" : "編輯此文章"}</DialogTitle>
        <DialogContent dividers>
            <TextField
                autoFocus
                margin="dense"
                id="standard-basic"
                label="文章標題"
                fullWidth
                className={titleText.root}
                onChange={handleTitleChange}
                value={editBlog ? editBlog.title : ''}
            />
            <TextField
                id="outlined-multiline-static"
                label="內文"
                multiline
                rows={15}
                variant="outlined"
                fullWidth
                onChange={handleContentChange}
                value={editBlog ? editBlog.content : ''}
            />
        </DialogContent>

        <DialogActions>
            <Button className={modal.root} onClick={handleEditCancel}>
                取消
            </Button>
            <Button className={modal.root} onClick={handleEditOk}>
                確定
            </Button>
        </DialogActions>
    </Dialog>;

    const renderToolBar = () => {
        return (<div className="blog-toolbar">
            <div className="tool-button" title="新增一篇文章">
                <AddCircleOutlineRoundedIcon className={icon.root} onClick={e => { handleEditClick('new'); }} />
            </div>
            <div className="tool-button" title="編輯此文章">
                <EditRoundedIcon className={icon.root} onClick={e => { handleEditClick('edit'); }} />
            </div>
            <div className="tool-button" title="刪除此文章">
                <DeleteOutlineRoundedIcon className={icon.root} onClick={e => { handleDeleteClick(); }} />
            </div>
        </div>);
    }

    const getSection = (text) => {
        let section = []
        if (text.length > 0) {
            section.push(<span>{text.slice(0, 1)}</span>);
            section.push(text.slice(1));
        } else {
            section.push(text);
        }

        return (<div className="article-section">{section}</div>);
    };

    const renderArticle = (content) => {
        let sections = [];
        if (content) {
            // _content = content.replace(/\n/g,"<br />");
            sections = content.split(/[\n]/);
        }

        let article = sections.reduce((acc, cur, index) => {
            if (index === sections.length - 1) {
                return [...acc, getSection(cur)];
            }
            return [...acc, getSection(cur), <br />];
        }, []);

        return (<div className="article-content">
            <div className="article-time">{`最後更新時間: ${selectedBlog.updated ? selectedBlog.updated : selectedBlog.created}`}</div>
            {article}
        </div>);
    }

    return <div className="blog-view">
        <div className="article-title">
            <div className="blog-name" title={selectedBlog ? selectedBlog.title : ''}>
                {selectedBlog ? selectedBlog.title : ''}
            </div>
            {renderToolBar()}
        </div>
        <div className="article-container">
            {selectedBlog ? renderArticle(selectedBlog.content) : null}
        </div>
        {messageDialog}
        {inputDialog}
    </div>
}

BlogView.propTypes = {
    blog: PropTypes.object,
    onDeleteClick: PropTypes.func,
    onCreateClick: PropTypes.func,
    onEditClick: PropTypes.func
}

export default BlogView;