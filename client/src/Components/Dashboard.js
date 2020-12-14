import React, { Component }from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { getPosts, createPost, deletePost, likePost, unlikePost } from '../Actions/Posts'
import { signOut, updateUser, getAuthenticated, NoteRead } from '../Actions/Authenticated'
import { connect } from 'react-redux';
import DisplayPosts from './DisplayPosts'
import Nav from './Nav'
import Profile from './Profile'
import ModalNewPost from './ModalNewPost'
import ModalPic from './ModalPic'
import ModalSinglePost from './ModalSinglePost'
import ModalUpdateProfile from './ModalUpdateProfile'
import LoadSpinner from './LoadSpinner'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PostAddIcon from '@material-ui/icons/PostAdd';
import CommentIcon from '@material-ui/icons/Comment';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import PhotoIcon from '@material-ui/icons/Photo';
import Badge from '@material-ui/core/Badge';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactTimeAgo from 'react-time-ago'


class Dashboard extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            posts: [],
            post: '',
            comment: '',
            show: false,
            show2: false,
            show3: false,
            show4: false,
            postId: '',
            disabled: false,
            pic: '',
            username: '',
            bio: '',
            location: '',
            website: '',
            notes: 'notes',
            visible: false,
            notesColor: 'white'
        };
    }

    handleShow = ()=> {
        this.setState({show: true});
    }

    handleClose = () => {
        this.setState({show: false});
    }
    handleShow2 = (post, note)=> {
        console.log(post)
        /*Once the notification is clicked, 
        it will display the modal for the post*/
        this.setState({
            show2: true, 
            postId: post._id
        })

        if(note && note.read === false) {
            this.props.NoteRead(note)
        }
        
    }

    handleClose2 = () => {

        //If modal was opened for notifications
        if(this.state.visible == true) {
            this.setState({show2: false});
            console.log('refresh?')
            //this.props.history.push('/Dashboard')
            //window.location.reload()
        } else {
            this.setState({show2: false});
            console.log('inside handleClose2')
            //this.props.getPosts()
        }
    }

    handleShow3 = ()=> {
        this.setState({show3: true});
    }

    handleClose3 = () => {
        this.setState({show3: false});
    }
    handleShow4 = ()=> {
        this.setState({show4: true});
    }

    handleClose4 = () => {
        this.setState({show4: false});
    }

    componentDidMount() {
        if(this.props.posts.length === 0) {
            console.log('componentDidMount: ' + this.props.posts.length)
            this.props.getPosts()
        }
    }
 
    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }
    //MAKE A POST 
    onSubmit = (e) => {
        //this.setState({show: false});
        e.preventDefault()
        
        if(this.state.post) {
            let newpost = {
                body: this.state.post,
                user: this.props.currentUser.credentials.username,
            }

            this.props.createPost(newpost)
            this.setState({ show: false })
        }
    }

    clickLike = ( id ) => {
        
        this.setState({ disabled: true })
        
        setTimeout(() => { 
            this.setState({ disabled: false })
        }, 2500) 
        
        console.log(id)
        let like = {
            postId: id,
            user: this.props.currentUser.credentials.username
        }
        this.props.likePost(like)
    }

    clickUnlike = ( id ) => {

        this.setState({ disabled: true })
        
        setTimeout(() => {
            this.setState({ disabled: false })
        }, 2500) 
        
        let like = {
            postId: id,
            user: this.props.currentUser.credentials.username
        }
        this.props.unlikePost(like)
    }

    onSubmitProfile = (e) => {
        e.preventDefault()

        if( this.state.bio || this.state.location || this.state.website ) {
            let user = {
                _id: this.props.currentUser.credentials._id,
                bio: this.state.bio,
                location: this.state.location,
                website: this.state.website
            }
            axios.post(`/users/update/${user._id}`, user)
            .then(res => {
                this.props.getAuthenticated()
                this.setState({ show3: false })
            })
            .catch((err) => {
                const error = err;  
            })
        }
    }

    onChangePic = (e) => {
        this.setState({
            pic: e.target.files[0]
        })
    }

    onSubmitPic = (e) => {
        e.preventDefault()
        const fd = new FormData();
        fd.append('pic', this.state.pic, this.state.pic.name)
        axios.post('/users/uploadImage', fd)
        .then( data => {
            window.location.reload()
            /*console.log(data)
            this.props.getAuthenticated()
            console.log('inside uploadImage submit')
            this.props.getPosts()
            this.setState({ show4: false })*/
        })
        .catch(err => {
            console.log(err)
        })
    }

    deletePost = (post) => {
        this.props.deletePost(post)
    }
    
    logOut = () => { 
        this.props.signOut()
    }

    changeNotes = () => {

        if(this.state.visible) {
            this.setState({ 
                visible: false, 
                notesColor: 'white'
            })
        } else {
            this.setState({ 
                visible: true,
                notesColor: '#0d47a1'
            })
        }
        
    }

    render() {

        const { currentUser, posts, loading, likes } = this.props
        console.log(this.props)
    

        let display;
        let displayposts
    
        /*WHEN YOU COME TO THIS PAGE VIA URL OR WHEN YOU REFRESH, 
        THE INITIAL RENDERING TAKES PLACE AND isAuthenticated is '', 
        AFTER THIS IT RE-RENDERS AND isAuthenticated GETS THE data PROPERTY*/
        if(loading) {
            console.log('dash loading')
            return (
                <LoadSpinner />
            )
        } else {
            if(currentUser && currentUser.credentials != '') {
         
                displayposts = 
                <DisplayPosts posts={posts} currentUser={currentUser} deletePost={this.deletePost} 
                likes={likes} disabled={this.state.disabled} clickLike={this.clickLike} 
                clickUnlike={this.clickUnlike} handleShow2={this.handleShow2} />

                if(posts.length != 0) {
                    display = 
                    <React.Fragment>
                        <Nav currentUser={currentUser} allPosts={posts} notesColor={this.state.notesColor} 
                        visible={this.state.visible} handleShow={this.handleShow}
                        handleShow2={this.handleShow2} logOut={this.logOut} changeNotes={this.changeNotes} />
                   
                        <ModalNewPost show={this.state.show} handleClose={this.handleClose}
                        onSubmit={this.onSubmit} post={this.state.post} onChange={this.onChange} />

                        <ModalSinglePost show2={this.state.show2} handleClose2={this.handleClose2}
                        postId={this.state.postId} />

                        <ModalUpdateProfile show3={this.state.show3} handleClose3={this.handleClose3}
                        onSubmitProfile={this.onSubmitProfile} onChange={this.onChange}
                        username={this.state.username} bio={this.state.bio} location={this.state.location}
                        website={this.state.website} />
                        
                        <ModalPic show4={this.state.show4} handleClose4={this.handleClose4}
                        onSubmitPic={this.onSubmitPic} onChangePic={this.onChangePic} />

                        <div className='display-flex'>
                            <Profile currentUser={currentUser} handleShow4={this.handleShow4}
                            handleShow3={this.handleShow3} />
                            <div className='post-container'>
                                {displayposts}
                            </div>
                        </div>
                    </ React.Fragment>
                } else {
                    display = 
                    <LoadSpinner />
                }
            } else {
                this.props.history.push('/LogIn')
            }
        }
    
        return (
            <div>{display}</div>
        )
    }
} 

const mapStateToProps = state => {
    return {
        currentUser: state.Authenticate.currentUser,
        likes: state.Authenticate.likes,
        posts: state.Data.posts,
        loading: state.Authenticate.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getPosts: () => dispatch(getPosts()),
        createPost: (post) => dispatch(createPost(post)),
        signOut: () => dispatch(signOut()),
        deletePost: (post) => dispatch(deletePost(post)),
        likePost: (like) => dispatch(likePost(like)),
        unlikePost: (like) => dispatch(unlikePost(like)),
        updateUser: (user) => dispatch(updateUser(user)),
        getAuthenticated: () => dispatch(getAuthenticated()),
        NoteRead: (note) => dispatch(NoteRead(note))
    }
}

const btnStyle = {
    background: '#2196f3', 
    color: 'white', 
    border: 'none', 
    cursor: 'pointer', 
    padding: '3%'
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)