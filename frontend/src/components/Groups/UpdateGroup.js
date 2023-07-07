import './newGroup.css'
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getAllGroups, updateGroup } from '../../store/groups';

export default function UpdateGroup({ groups }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { groupId } = useParams();

    const currentGroup = groups.Groups.filter(group => group.id === parseInt(groupId))[0]


    const [errors, setErrors] = useState({});
    const [name, setName] = useState(currentGroup.name)
    const [about, setAbout] = useState(currentGroup.about)
    const [city, setCity] = useState(currentGroup.city)
    const [state, setState] = useState(currentGroup.state)
    const [type, setType] = useState(currentGroup.type)
    const [groupPrivate, setGroupPrivate] = useState(currentGroup.private)
    //



    useEffect(() => {
        dispatch(getAllGroups())
    }, [dispatch]);

    const sessionUser = useSelector(state => state.session.user);
    if (!sessionUser || sessionUser.id !== currentGroup.organizerId) {
        return history.push('/')
    }

    // const groupObj = useSelector(state => state.groups.groups.allGroups)
    // //
    // if (!Object.values(groupObj).length) {
    //     //
    //     return null;
    // }

    // const group = groupObj.Groups.filter(group => group.id === parseInt(groupId))[0]
    // //

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const payload = {
            name,
            about,
            city,
            state,
            type,
            groupPrivate
        }

        let editedGroup = await dispatch(updateGroup(payload, groupId)).catch(
            async (res) => {
                const data = await res.json();

                if (data && data.error) setErrors(data.error);
            }
        );



        if (editedGroup) {
            history.push(`/groups/${editedGroup.id}`)
        }

    };

    return (
        <div className="new-group-form">
            <div className="new-group-page">
                <div>
                    <h3>BECOME AN ORGANIZER</h3>
                    <h1>We'll walk you through a few steps to build your local gaming community</h1>
                </div>
                <form onSubmit={handleSubmit}>

                    <section>
                        <div>
                            <h2>First, set up your group's location.</h2>
                            <div>
                                SquareUp groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.
                            </div>
                        </div>

                        <div>
                            <input
                                type='text'
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                            <input
                                type='text'
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                        </div>

                        <ul className='popup-error'>
                            {errors.city && (
                                <li key={errors.city}>{errors.city}</li>
                            )}
                            {errors.state && (
                                <li key={errors.state}>{errors.state}</li>
                            )}
                        </ul>

                    </section>

                    <section>
                        <div>
                            <h2>What will your group's name be?</h2>
                            <div>
                                Choose a name that will give people a clear idea of what the group is about.
                                Feel free to get creative! You can edit this later if you change your mind.
                            </div>
                        </div>

                        <div>
                            <input
                                type='text'
                                placeholder="What is your group name?"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <ul className='popup-error'>
                            {errors.name && (
                                <li key={errors.name}>{errors.name}</li>
                            )}
                        </ul>

                    </section>

                    <section>
                        <div>
                            <h2>Now describe what your group will be about</h2>
                            <div>
                                People will see this when we promote your group, but you'll be able to add to it later, too.
                            </div>
                        </div>

                        <ol>
                            <li>What's the purpose of the group?</li>
                            <li>Who should join?</li>
                            <li>What will you do at your events?</li>
                        </ol>

                        <div>
                            <textarea
                                type='textbox'
                                placeholder="Please write at least 50 characters"
                                rows={7}
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                className='new-group-about'
                            />
                        </div>

                        <ul className='popup-error'>
                            {errors.about && (
                                <li key={errors.about}>{errors.about}</li>
                            )}
                        </ul>

                    </section>

                    <section>
                        <div>
                            <h2>Final steps...</h2>
                        </div>

                        <span>Is this an in person or online group?</span>
                        <div>
                            <select onChange={(e) => setType(e.target.value)} value={type}>
                                <option value=''>(select one)</option>
                                <option value='Online'>Online</option>
                                <option value='In person'>In person</option>
                            </select>

                            <ul className='popup-error'>
                                {errors.type && (
                                    <li key={errors.type}>{errors.type}</li>
                                )}
                            </ul>
                        </div>

                        <span>Is this group private or public?</span>
                        <div>
                            <select onChange={(e) => setGroupPrivate(e.target.value)} defaultValue={Boolean(groupPrivate)}>
                                <option value=''>(select one)</option>
                                <option value={Boolean(true)}>Private</option>
                                <option value={Boolean(false)}>Public</option>
                            </select>

                            <ul className='popup-error'>
                                {errors.groupPrivate && (
                                    <li key={errors.groupPrivate}>Visibility Type is required</li>
                                )}
                            </ul>
                        </div>
                    </section>

                    <section>
                        <button type="submit">Update group</button>
                    </section>

                </form>
            </div>
        </div>
    );
};
