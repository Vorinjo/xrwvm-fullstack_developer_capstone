import React from "react";

import "../assets/bootstrap.min.css";
import "../assets/style.css";


const Header = () => {
  const currentUser = sessionStorage.getItem("username");

  const logout = async (event) => {
    event.preventDefault();
    const response = await fetch(
      window.location.origin + "/djangoapp/logout",
      { method: "GET" }
    );
    if (response.ok) {
      sessionStorage.clear();
      window.location.href = "/";
      return;
    }
    alert("The user could not be logged out.");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{ backgroundColor: "darkturquoise", minHeight: "1in" }}
    >
      <div className="container-fluid">
        <h2 style={{ paddingRight: "5%" }}>Best Cars</h2>
        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about/">About Us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contact/">Contact Us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/dealers/">Dealers</a>
            </li>
          </ul>
          <div className="navbar-text">
            {currentUser ? (
              <div className="input_panel">
                <strong className="username">{currentUser}</strong>
                <a className="nav_item" href="/" onClick={logout}>Logout</a>
              </div>
            ) : (
              <div className="input_panel">
                <a className="nav_item" href="/login/">Login</a>
                <a className="nav_item" href="/register/">Register</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
