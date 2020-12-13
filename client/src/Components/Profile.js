import React from 'react'
import PhotoIcon from '@material-ui/icons/Photo';
import ReactTimeAgo from 'react-time-ago'
import Button from 'react-bootstrap/Button';
import btnStyle from './btnStyle'


function OnShow(props) {
    props.handleShow4()
}

function OnClick(props) {
    props.handleShow3()
}



function Profile(props) {

    const { currentUser, handleClose4, handleShow3 } = props

    console.log(props)
    return (
        <div className="profile">
            <div className='profile-pic'>
                {(currentUser.pic)? (
                    <img src={`data:image/png;base64,${currentUser.pic}`} alt='jpg'/>
                ): (null)}
                <div className='profile-pic-btn' style={{margin: '1%'}}><PhotoIcon style={{ fontSize: 30, color: '#2196f3', cursor: 'pointer'}} onClick={() => {OnShow(props)}}></PhotoIcon></div>
            </div>
            <div className='profile-details'>
                <p style={{ fontWeight: 'bold', fontSize: 'x-large'}}>{currentUser.credentials.username}</p>
                {(currentUser.credentials.location)? (<p>From: {currentUser.credentials.location}</p>): (null)}
                {(currentUser.credentials.bio)? (<p>About: {currentUser.credentials.bio}</p>): (null)}
                {(currentUser.credentials.website)? (<p>{currentUser.credentials.website}</p>): (null)}
                <p>Joined: <ReactTimeAgo date={currentUser.credentials.joinDate} locale="en-US"/></p>
                <Button variant="primary" onClick={() => {handleShow3(props)}}>Update Profile</Button>
            </div>
        </div>
    )   
}

export default Profile