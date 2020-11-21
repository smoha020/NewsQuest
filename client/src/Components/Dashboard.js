import React, { Component }from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { getPosts, createPost, deletePost, likePost, unlikePost } from '../Actions/Posts'
import { signOut, updateUser, getAuthenticated } from '../Actions/Authenticated'
import { connect } from 'react-redux';
import Post from './Post'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Modal2 from 'react-bootstrap/Modal';
import CommentInput from './CommentInput'
import uploads from '../uploads/pic-1605638298190.jpg'


class Dashboard extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            //currentUser: '',
            posts: [],
            post: '',
            comment: '',
            show: false,
            show2: false,
            show3: false,
            show4: false,
            postId: '',
            disabled: '',
            pic: '',
            username: '',
            bio: '',
            location: '',
            website: ''
        }
    }

    handleShow = ()=> {
        this.setState({show: true});
    }

    handleClose = () => {
        this.setState({show: false});
    }
    handleShow2 = (post, note)=> {

        /*Once the notification is clicked, 
        it will display the modal for the post*/
        if(note.read === false) {
            axios.put(`/social/notificationRead/${note._id}`)
            .then(data => {
                //SHOULD WE REFRESH PAGE HERE??
                console.log(data)
            })
            .catch(err => console.log(err))
            
        }
        console.log(post)
        this.setState({show2: true, postId: post._id})
    }

    handleClose2 = () => {
        this.setState({show2: false});
        this.props.getPosts()
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
        this.props.getPosts()
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }
    onChangeFile = (e) => {
        this.setState({ pic: e.target.files[0] })
    }
    
    //MAKE A POST 
    onSubmit = (e) => {
        //this.setState({show: false});
        e.preventDefault()
        

        let newpost = {
            body: this.state.post,
            user: this.props.currentUser.data.credentials.username,
        }

        this.props.createPost(newpost)
        this.setState({ show: false })

    }

    submitComment = (e, post)=> {
    
        e.preventDefault();

    }

    clickLike = (id, e ) => {
        e.preventDefault()
        
        let button = e.target
        button.disabled = true

        setTimeout(function() {
            button.disabled = false;
        }, 2500)

        let like = {
            postId: id,
            user: this.props.currentUser.data.credentials.username
        }
        this.props.likePost(like)
    }

    clickUnlike = (id, e) => {

        let button = e.target
        button.disabled = true

        setTimeout(function() {
            button.disabled = false;
        }, 2500) 

        let like = {
            postId: id,
            user: this.props.currentUser.data.credentials.username
        }
        this.props.unlikePost(like)
    }

    onSubmitProfile = (e) => {
        e.preventDefault()

        let user = {
            _id: this.props.currentUser.data.credentials._id,
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
        .then(() => {
            this.props.getAuthenticated()
            this.setState({ show4: false })
        })
        .catch(err => {
            console.log(err)
        })
    }

    deletePost = (post) => {
        this.props.deletePost(post)
    }
    
    //LOG OUT
    logOut = () => { 
        this.props.signOut()
        //this.props.history.push('/')
    }

    render() {

        const { currentUser, posts, loading, likes } = this.props
        console.log(this.props)

        let display;
        let displayposts
        let displayuser
        let deletedisplay
        let thumbsLogo 
        let notesDisplay
        /*WHEN YOU COME TO THIS PAGE VIA URL OR WHEN YOU REFRESH, 
        THE INITIAL RENDERING TAKES PLACE AND isAuthenticated is '', 
        AFTER THIS IT RE-RENDERS AND isAuthenticated GETS THE data PROPERTY*/
      
        if(loading) {
            return <div>Loading..</div>
        } else {
            if(currentUser && currentUser.data != '') {
         
                console.log(currentUser)
                if(posts != []) {
                    displayposts  = posts.map((post, index) => {
                        if(post.user == currentUser.data.credentials.username) {
                            deletedisplay = <button onClick={this.deletePost.bind(this, post)} style={{color: 'white'}, {background: 'red'}}>
                                        X {currentUser.data.credentials.username} 
                                    </button>
                        } else { deletedisplay = '' }
                        /*WITHTOUT THIS, deletedisplay WILL CONTINUE TO HAVE THE 
                        VALUE ABOVE FOR EVERY ITERATION AFTER THE FIRST TRUE IF STATEMENT.*/
        
                        thumbsLogo = []
                        thumbsLogo = likes.map(like => {
                            if(like.postId === post._id) {
                                return post._id
                            } 
                        })

                        
                        return (
                            <React.Fragment key={index}>
                                <div className='post'>
                                    {deletedisplay}
                                    <Link to={`/User/${post.user}`}>{post.user}</Link>
                                    <p>{post.body}</p>
                                    <p>{post.createdAt}</p>
                                    {( thumbsLogo.includes(post._id) )? (
                                    <Button disabled={this.disabled} onClick={this.clickUnlike.bind(this, post._id)}>thumbs down</Button>
                                    ) : (
                                    <Button disabled={this.disabled} onClick={this.clickLike.bind(this, post._id)}>thumbs up</Button>
                                    )} 
                                    <p>{post.likeCount} likes</p>
                                    <p>Comment count</p>
                                    <p>{post.commentCount} comments</p>
                                </div>
                            {/*<Link to={`Post/${post._id}`} >
                                    <button>
                                        OPEN
                                    </button>
                                </Link> */}
                                <Button variant="primary" onClick={this.handleShow2.bind(this, post)}>
                                    View comments
                                </Button>
                            </React.Fragment>
                        )   
                    })
                }
 
                notesDisplay = currentUser.data.notifications.map((note, index) => {
                    let myPost = posts.find( post => {
                        return (post._id === note.postId) 
                    })
                    console.log(myPost)
                    if(note.notType === 'like') { 

                        return <li key={index}><Button variant="primary" style={{color: 'white'}} onClick={this.handleShow2.bind(this, myPost, note)}>{note.sender} liked your post</Button></li>
                    } else {
                        return <li key={index}><Button variant="primary" style={{color: 'red'}} onClick={this.handleShow2.bind(this, myPost, note)}>{note.sender} commented on your post </Button></li> 
                    }
                })

              
                display = 
                <React.Fragment>
                    <ul>
                        <li className="company"><a style={{color: 'white'}}>NewsQuest</a></li>
                        <li><Button onClick={this.logOut}>Log Out</Button></li>
                        <li>
                            <div>
                                <Button >Notifications</Button>
                                <ul>{notesDisplay}</ul>
                            </div>
                        </li>
                        <Button variant="primary" onClick={this.handleShow}> Add Post </Button>              
                    </ul>

                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <form onSubmit={this.onSubmit}> 
                            <Modal.Header closeButton>
                                <Modal.Title>New Post</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <input type='text'
                                name="post"
                                value={this.state.post}
                                onChange={this.onChange} />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleClose}>
                                    Close
                                </Button>
                                <input type="submit" value="post"/>
                            </Modal.Footer>
                        </form>
                    </Modal>

                    <Modal show={this.state.show2} onHide={this.handleClose2}>
                        <Modal.Header closeButton>
                            <Modal.Title>Post</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Post postId={this.state.postId}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose2}>
                                Close
                           </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.show3} onHide={this.handleClose3}>
                        <form onSubmit={this.onSubmitProfile}> 
                            <Modal.Header closeButton>
                                <Modal.Title>Update My Profile</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <label>
                                    username: 
                                    <input type='text'
                                    name="username"
                                    value={this.state.username}
                                    onChange={this.onChange} />
                                </label>
                                <label>
                                    Bio: 
                                    <input type='text'
                                    name="bio"
                                    value={this.state.bio}
                                    onChange={this.onChange} />
                                </label>
                                <label>
                                    Location: 
                                    <input type='text'
                                    name="location"
                                    value={this.state.location}
                                    onChange={this.onChange} />
                                </label>
                                <label>
                                    website: 
                                    <input type='website'
                                    name="website"
                                    value={this.state.website}
                                    onChange={this.onChange} />
                                </label>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleClose3}>
                                    Close
                                </Button>
                                <input type="submit" value="update"/>
                            </Modal.Footer>
                        </form>
                    </Modal>

                    <Modal show={this.state.show4} onHide={this.handleClose4}>
                        <form onSubmit={this.onSubmitPic}> 
                            <Modal.Header closeButton>
                                <Modal.Title>Update Pic</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <label>
                                    pic: 
                                    <input 
                                    type='file'
                                    onChange={this.onChangePic} />
                                </label>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.handleClose4}>
                                    Close
                                </Button>
                                <input type="submit" value="update"/>
                            </Modal.Footer>
                        </form>
                    </Modal>

                    

                    <div className='display-flex'>
                        <div className='post-container'>
                            {displayposts}
                        </div>        
                        <div className="profile">
                            {(currentUser.data.pic)? (<p><img style={{width: '20%'}} src={`data:image/png;base64,${currentUser.data.pic}`} alt='jpg'/></p>): (null)}
                            <Button variant="primary" onClick={this.handleShow4}>Update My Pic</Button>
                            <p>{currentUser.data.credentials.username}</p>
                            {(currentUser.data.credentials.location)? (<p>{currentUser.data.credentials.location}</p>): (null)}
                            {(currentUser.data.credentials.bio)? (<p>{currentUser.data.credentials.bio}</p>): (null)}
                            {(currentUser.data.credentials.website)? (<p>{currentUser.data.credentials.website}</p>): (null)}
                            <p>Joined: {currentUser.data.credentials.joinDate}</p>
                            <Button variant="primary" onClick={this.handleShow3}>Update Profile</Button>
                        </div>
                    </div>
                
                </ React.Fragment>
                
        
            } else {
                
                this.props.history.push('/LogIn')
            }
        }
    
    /*Because isAthenticated.data doesn't exist when isAuthenticated
    is null, we will have an error*/
    
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)