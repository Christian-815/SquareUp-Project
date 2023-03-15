import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllGroups } from '../../store/groups';
import { NavLink } from 'react-router-dom';
import './groups.css';


export default function Groups() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllGroups())
    }, [dispatch]);

    const groupsObj = useSelector(state=>state.groups.groups.allGroups);
    // console.log(Object.values(groupsObj).length)
    if (!Object.values(groupsObj).length) {
        return null;
    }
    const groups = groupsObj.Groups
    // console.log('===========groups=========', groups)



    const groupStatus = (groupPrivateOrPublic) => {
        if (!groupPrivateOrPublic) {
            return 'Public'
        } else {
            return 'Private'
        }
    }

    return (
        <div className='groups-page'>
            <div>
                <h1>Groups</h1>
                <h1>Events</h1>
            </div>
            <div>Groups in SquareUp</div>
            <div>
                {groups.map((group) => (
                    <div key={group.id} className='individual-groups'>
                        <div>
                            <img src={group.previewImage} alt='group' className='group-image'></img>
                        </div>
                        <div>
                            <NavLink to={`/group/${group.id}`}>
                                {group.name}
                            </NavLink>
                            <div>{group.city}, {group.state}</div>
                            <p>{group.about}</p>
                            <div>
                                (# of events) events  •  {groupStatus(group.private)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
