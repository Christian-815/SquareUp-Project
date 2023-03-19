import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllGroups } from '../../store/groups';
import { NavLink, Link, useHistory } from 'react-router-dom';
import './groups.css';


export default function Groups() {
    const dispatch = useDispatch();
    const history = useHistory();

    const routeChange = (groupId) => {
        let path = `/groups/${groupId}`;
        history.push(path);
    }

    useEffect(() => {
        dispatch(getAllGroups())
    }, [dispatch]);

    const groupsObj = useSelector(state=>state.groups.groups.allGroups);

    if (!Object.values(groupsObj).length) {
        return null;
    }

    const groups = groupsObj.Groups
    // console.log(groups)


    const groupStatus = (groupPrivateOrPublic) => {
        if (!groupPrivateOrPublic) {
            return 'Public'
        } else {
            return 'Private'
        }
    }

    const hasPreview = (previewImage) => {
        if (!previewImage) {
            return 'No preview image for this group'
        } else {
            return previewImage
        }
    }


    return (
        <div className='groups-page'>
            <div className='show-list'>
                <Link to='/events' className='unactive-list'>
                    <h1>Events</h1>
                </Link>
                <NavLink to='/groups' activeClassName='active-list'>
                    <h1>Groups</h1>
                </NavLink>
            </div>
            <div className='list-description'>Groups in SquareUp</div>
            <div>
                {groups.map((group) => (
                    <div key={group.id} className='individual-groups' onClick={() => routeChange(group.id)}>
                        <div className='group-div-left'>
                            <img src={hasPreview(group.previewImage)} alt='group' className='group-image'></img>
                        </div>
                        <div className='group-div-right'>
                            <h3>
                                {group.name}
                            </h3>
                            <div>{group.city}, {group.state}</div>
                            <div>{group.about}</div>
                            <div>
                                (# of events) events  •  {groupStatus(group.private)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        // <NavLink to={`/group/${group.id}`}>
        //                             {group.name}
        //                         </NavLink>
    )
}
