import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import Logo from "../Logo";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul>
      <>
        <NavLink to="/" >
          <Logo />
        </NavLink>
      </>
      <h1 className="app-header">CaveBnB</h1>
      {isLoaded && (
        <>
          <ProfileButton user={sessionUser} />
        </>
      )}
    </ul>
  );
}

export default Navigation;
