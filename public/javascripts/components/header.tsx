import * as React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = (props) => {
  const sendLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const response = await fetch("/logout", {
      method: "POST"
    });

    if (response.ok) {
      location.href = "/";
    }
  };

  return (
    <nav className="navbar is-primary">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">TRACTION</Link>
      </div>

      <div className="navbar-menu">
        <div className="navbar-start">
          <Link className="navbar-item" to="/">Stream</Link>
          <Link className="navbar-item" to="/upload">Upload Video</Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <a className="button" onClick={sendLogout}>Logout</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
