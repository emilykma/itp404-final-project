import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Home
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
                to="/search-recipes"
              >
                Search Recipes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
                to="/grocery-list"
              >
                Grocery List
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
                to="/meal-plan"
              >
                Meal Plan
              </NavLink>
            </li>

            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link"
                id="navbarDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </button>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "dropdown-item active-link" : "dropdown-item"
                    }
                    to="/recipes/category/Breakfast"
                  >
                    Breakfast
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "dropdown-item active-link" : "dropdown-item"
                    }
                    to="/recipes/category/Lunch"
                  >
                    Lunch
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "dropdown-item active-link" : "dropdown-item"
                    }
                    to="/recipes/category/Dinner"
                  >
                    Dinner
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active-link" : "nav-link"
                }
                to="/saved-recipes"
              >
                Saved Recipes
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
