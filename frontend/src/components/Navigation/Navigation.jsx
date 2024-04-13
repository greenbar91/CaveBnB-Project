import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import Logo from "../Logo";
import "./Navigation.css";


function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="nav-container">

        <NavLink to="/"  className='logo-link'>
          <Logo />
        </NavLink>

      {sessionUser && <NavLink className='create-spot-link'>Create a New Spot</NavLink>}
      {isLoaded && (
        <>
          <ProfileButton user={sessionUser} />
        </>
      )}
    </ul>
  );
}

export default Navigation;
