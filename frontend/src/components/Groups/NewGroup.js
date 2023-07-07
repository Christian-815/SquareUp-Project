import './newGroup.css'
import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { createGroup } from '../../store/groups';

export default function GroupForm() {
    const dispatch = useDispatch();
    const history = useHistory()
    const [errors, setErrors] = useState({});
    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [type, setType] = useState('')
    const [groupPrivate, setGroupPrivate] = useState()
    const [groupImage, setGroupImage] = useState(null)
    const [imageError, setImageError] = useState({});



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

        if (!groupImage) {
            return setImageError({ imgError: 'Image must be uploaded.' })
        } else {
            setImageError({})
        }

        const imagePayload = {
            url: groupImage,
            preview: true
        }

        let newGroup = await dispatch(createGroup(payload, imagePayload)).catch(
            async (res) => {
                const data = await res.json();

                if (data && data.error) setErrors(data.error);
            }
        );



        if (newGroup) {
            history.push(`/groups/${newGroup.id}`)
        }

    };

    const updateFile = (e) => {
        const file = e.target.files[0];
        if (file) setGroupImage(file);
    };

    return (
        <div>
            <div className="new-group-page">
                <div className='new-group-header'>
                    <h5 className='become-organizer'>BECOME AN ORGANIZER</h5>
                    <h1>We'll walk you through a few steps to build your local gaming community</h1>
                </div>
                <form onSubmit={handleSubmit} className='new-group-form'>

                    <section className='new-group-section'>
                        <div>
                            <h2>First, set up your group's location.</h2>
                            <div>
                                SquareUp groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.
                            </div>
                        </div>

                        <div className='citystate-input input-box'>
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

                    <section className='new-group-section'>
                        <div>
                            <h2>What will your group's name be?</h2>
                            <div>
                                Choose a name that will give people a clear idea of what the group is about.
                                Feel free to get creative! You can edit this later if you change your mind.
                            </div>
                        </div>

                        <div className='input-box'>
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

                    <section className='new-group-section'>
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

                        <div className='input-box'>
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

                    <section className='new-group-section'>
                        <div>
                            <h2>Final steps...</h2>
                        </div>

                        <span>Is this an in person or online group?</span>
                        <div>
                            <select onChange={(e) => setType(e.target.value)}>
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
                            <select onChange={(e) => setGroupPrivate(e.target.value)}>
                                <option value=''>(select one)</option>
                                <option value='true'>Private</option>
                                <option value={Boolean(false)}>Public</option>
                            </select>

                            <ul className='popup-error'>
                                {errors.groupPrivate && (
                                    <li key={errors.groupPrivate}>Visibility Type is required</li>
                                )}
                            </ul>
                        </div>

                        <span>Please add a image for your group below:</span>
                        <div className='input-box'>
                            <input
                                type='file'
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={updateFile}
                            />
                        </div>

                        <ul className='popup-error'>
                            {imageError.imgError && (
                                <li key={imageError.imgError}>{imageError.imgError}</li>
                            )}
                        </ul>
                    </section>

                    <section>
                        <button type="submit" className='join-squareUp'>Create group</button>
                    </section>

                </form>
            </div>
        </div>
    );
};
