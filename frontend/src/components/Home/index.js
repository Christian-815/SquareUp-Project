import './homepage.css'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';
// import OpenModalButton from '../OpenModalButton';
// import GroupFormModal from '../Groups/NewGroupModal';




export default function HomePage() {
    const sessionUser = useSelector(state => state.session.user);

    let userLoggedIn;
    if (!sessionUser) {
        userLoggedIn = (
            <div>
                <div>Start a new group</div>
            </div>
        )
    } else {
        userLoggedIn = (
            <Link to='/groups/new' className='active'>
                Start a new Group
            </Link>
        )
    }

    let joinSquareUp;
    if (!sessionUser) {
        joinSquareUp = (
            <div>
                <button className='join-squareUp'>
                    <div className='login-signup'>
                        <OpenModalButton
                            buttonText="Join SquareUp"
                            modalComponent={<SignupFormModal />}
                        />
                    </div>
                </button>
            </div>
        )
    }




    return (
        <div>
            <div className='home-intro'>
                <div className='intro-message'>
                    <h1 className='intro-text'>The fighting game platform—Where trading fist turns into long lasting friendships</h1>
                    <p>Whatever your interest, from Street Fighter and King of Fighters to Super Smash Bros and Dragon Ball Fighter Z, there are thousands of people who share it on SquareUp. Events are happening every day—log in to join the fun.</p>
                </div>
                <div>
                    <img className='intro-img' src='https://images.nintendolife.com/22f95a5e554ba/best-fighters.large.jpg' alt='home page logo'></img>
                </div>
            </div>

            <div className='how-works'>
                <h2>How SquareUp works</h2>
                <p className='explanation'>Meet new people who share your interests through online and in-person events. It’s free to create an account.</p>
            </div>

            <div className='redirects-images'>
                <div className='homepage-images'>
                    <img className='intro-img' src='https://png.pngitem.com/pimgs/s/361-3612991_fighters-gaming-logo-fighters-logo-hd-png-download.png' alt='see groups logo'></img>
                </div>
                <div className='homepage-images'>
                    <img className='intro-img' src='https://t4.ftcdn.net/jpg/03/61/03/95/360_F_361039511_WEAbESzXvHFnoILX9GFLerq0sFqYbHMy.jpg' alt='see events logo'></img>
                </div>
                <div className='homepage-images'>
                    <img className='intro-img' src='https://img0-placeit-net.s3-accelerate.amazonaws.com/uploads/stage/stage_image/38809/optimized_large_thumb_stage.jpg' alt='create group logo'></img>
                </div>
            </div>

            <div className='redirects-links'>
                <div>
                    <Link to='/groups' className='active'>See all groups</Link>
                </div>
                <div>
                    <Link to='/events' className='active'>Find an event</Link>
                </div>
                <div>
                    <div>{userLoggedIn}</div>
                </div>
            </div>

            <div className='redirects-links'>
                {joinSquareUp}
            </div>
        </div>

    )
}
