import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { getOneGroup } from '../../store/groups';
import DeleteGroupModal from '../DeleteGroupModal';
import OpenModalButton from '../OpenModalButton';
import './singleGroup.css'




export default function SingleGroup() {
    const dispatch = useDispatch();
    const history = useHistory()
    const { groupId } = useParams();

    // const groupIdInt = parseInt(groupId)

    const sessionUser = useSelector(state => state.session.user);
    // console.log(sessionUser)
    useEffect(() => {
        dispatch(getOneGroup(groupId))
    }, [groupId, dispatch]);


    const groupObj = useSelector(state => state.groups.groups.singleGroup[groupId])
    console.log('----------------------' , groupObj)

    if (!groupObj) {
        // console.log('-------------group obj bad---------', groupObj)
        return null;
    }

    // console.log('***************************', groupObj)

    const handleUpdateClick = () => {
        history.push(`/groups/${groupId}/edit`)
    }


    let userLinks;
    if (!sessionUser) {
        userLinks = (
            <div>
                <button>Join this group</button>
            </div>
        )
    } else if (sessionUser.id === groupObj.organizerId) {
        userLinks = (
            <div>
                <button>Create Event</button>
                <button onClick={handleUpdateClick}>Update</button>
                <button>
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteGroupModal groupId={groupId}/>}
                    />
                </button>
            </div>
        )
    } else {
        userLinks = (
            <div>
                <button>Join this group</button>
            </div>
        )
    }


    const checkForPreviewImage = (groupImages) => {
        if (groupImages.length) {
            for (let image of groupImages) {
                if (image.preview) {
                    return (
                        <img src={image.url} alt='group logo' className='group-image'></img>
                    )
                }
            }

            return (
                <img src={groupImages[0].url} alt='group logo' className='group-image'></img>
            )
        }

        return (
            <div className='group-image'>
                No images for this group yet
            </div>
        )
    }

    const groupStatus = (groupPrivateOrPublic) => {
        if (!groupPrivateOrPublic) {
            return 'Public'
        } else {
            return 'Private'
        }
    }





    return (
        <div className='group-page'>
            <span className='groups-span'>🡠<Link to='/groups' className='groups-back-link'>Groups</Link></span>
            <div className='group-header'>
                <div className='group-header-left'>
                    {checkForPreviewImage(groupObj.GroupImages)}
                </div>
                <div className='group-header-right'>
                    <div>
                        <h1 className='group-name'>{groupObj.name}</h1>
                        <div>{groupObj.city}, {groupObj.state}</div>
                        <div>
                            (# of events) events  •  {groupStatus(groupObj.private)}
                        </div>
                        <div>Organized by {groupObj.Organizer.firstName} {groupObj.Organizer.lastName}</div>
                    </div>
                    <div>
                        <div className='group-interaction'>{userLinks}</div>
                    </div>
                </div>
            </div>
            <div className='group-description'>
                <div>
                    <h2>Organizer</h2>
                    <div>{groupObj.Organizer.firstName} {groupObj.Organizer.lastName}</div>
                </div>
                <div>
                    <h3>What we're about</h3>
                    <p>{groupObj.about}</p>
                </div>
                <div>
                    PLACEHOLDER FOR FUTURE AND PAST EVENTS
                </div>
            </div>
        </div>
    )
}
