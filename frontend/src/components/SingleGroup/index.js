import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getOneGroup } from '../../store/groups';




export default function SingleGroup() {
    const dispatch = useDispatch();
    const { groupId } = useParams();

    const sessionUser = useSelector(state => state.session.user);
    console.log(sessionUser)

    useEffect(() => {
        dispatch(getOneGroup(groupId))
    }, [groupId, dispatch]);

    const groupObj = useSelector(state=> state.groups.groups.singleGroup)
    console.log(groupObj)

    let userLinks;
    if (sessionUser.id === groupObj.organizerId) {
        userLinks = (
            <div>
                <button>Create Event</button>
                <button>Update</button>
                <button>Delete</button>
            </div>
        )
    } else {
        userLinks = (
            <div>
                <button>Join this group</button>
            </div>
        )
    }

    if (!Object.values(groupObj).length) {
        return null;
    }

    const checkForPreviewImage = (groupImages) => {
        if (groupImages.length) {
            for (let image of groupImages) {
                if (image.preview) {
                    return image.url
                }
            }

            return groupImages[0].url
        }

        return 'No images for this group yet'
    }





    return (
        <div className='group-page'>
            <div>
                <span>🡠<Link to='/groups'>Groups</Link></span>
                <div>
                    <img src={checkForPreviewImage(groupObj.GroupImages)} alt='group logo' className='group-image'></img>
                </div>
                <div>
                    <h3>{groupObj.name}</h3>
                    <div>{groupObj.city}, {groupObj.state}</div>
                    <div>Organized by {groupObj.Organizer.firstName} {groupObj.Organizer.lastName}</div>
                </div>
                <div>{userLinks}</div>
            </div>
        </div>
    )
}
