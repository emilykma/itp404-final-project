import React from "react";
import PropTypes from "prop-types";

export default function RecipeCard({
  name,
  category,
  prepTime,
  skillLevel,
  favoritedAt,
  actionLabel,
  actionClass,
  onAction,
  children,
  onRemove,
  isRemovable,
  showSkillLevel,
}) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        {category && (
          <p className="card-text">
            <strong>Category:</strong> {category}
          </p>
        )}
        {prepTime && (
          <p className="card-text">
            <strong>Prep Time:</strong> {prepTime} minutes
          </p>
        )}
        {showSkillLevel && skillLevel && (
          <p className="card-text">
            <strong>Skill Level:</strong> {skillLevel}
          </p>
        )}
        {favoritedAt && (
          <p className="card-text">
            <strong>Favorited At:</strong> {favoritedAt}
          </p>
        )}
        <div className="d-flex justify-content-between align-items-center">
          {actionLabel && onAction && (
            <button className={`btn ${actionClass}`} onClick={onAction}>
              {actionLabel}
            </button>
          )}
          {children && <div>{children}</div>}
          {isRemovable && (
            <button className="btn btn-danger" onClick={onRemove}>
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// prop validation for RecipeCard
RecipeCard.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.string,
  prepTime: PropTypes.number,
  skillLevel: PropTypes.string,
  favoritedAt: PropTypes.string,
  actionLabel: PropTypes.string,
  actionClass: PropTypes.string,
  onAction: PropTypes.func,
  children: PropTypes.node,
  onRemove: PropTypes.func,
  isRemovable: PropTypes.bool,
  showSkillLevel: PropTypes.bool,
};
