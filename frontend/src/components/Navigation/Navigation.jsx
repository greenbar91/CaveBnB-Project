import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import Logo from '../Logo';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <></>
      <>
        <NavLink to="/" className='home-link'><Logo/></NavLink>
      </>
      {isLoaded && (
        <>
          <ProfileButton user={sessionUser} />
        </>
      )}
    </ul>
  );
}

export default Navigation;
