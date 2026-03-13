import { Link } from "react-router";
import "../styles/header.css";

function Header() {
  return (
    <div className="header">
      <Link to={"/"}>
        <div className="homeButton">Uninspirebot</div>
      </Link>
      <Link to={"/lockIn"}>
        <div className="lockInButton">Clock IN</div>
      </Link>
    </div>
  );
}

export default Header;
