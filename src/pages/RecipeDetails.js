import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRecipeById,
  updateRecipe,
  getCommentsByRecipeId,
  addComment,
} from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * RecipeDetails component
 * This page displays all details of each recipe and allows users to make edits to the recipe.
 * 
 * Users can
 * - View recipe details (category, PrepTime, ingredients, instructions)
 * - Edit recipe details & add/remove ingredients and instructions
 * - Leave comments on each recipe
 */

export default function RecipeDetails() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [commenterName, setCommenterName] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commentErrors, setCommentErrors] = useState({ name: "", body: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [updatedRecipe, setUpdatedRecipe] = useState({});
  const [recipeErrors, setRecipeErrors] = useState({});
  const [newInstruction, setNewInstruction] = useState("");

  // fetch recipe details and comments
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const recipeData = await getRecipeById(recipeId);
        setRecipe(recipeData);
        setUpdatedRecipe(recipeData);
  
        // fetch and set comments
        const fetchedComments = await getCommentsByRecipeId(recipeId);
        setComments(fetchedComments);
  
        // set document title
        document.title = `${recipeData.name} - Recipe Details`; // ensures every recipe page has a unique title based on the recipe data
      } catch (error) {
        console.error("Error fetching recipe details or comments:", error);
        document.title = "Error Loading Recipe";
      }
    };
  
    fetchRecipeData();
  }, [recipeId]);  

  // handle edits made to recipes
  const handleUpdateRecipe = async () => {
    const errors = {};
    if (!updatedRecipe.name) errors.name = "Recipe name is required.";
    if (!updatedRecipe.category)
      errors.category = "Please select a valid category.";
    if (
      !updatedRecipe.prepTime ||
      isNaN(updatedRecipe.prepTime) ||
      updatedRecipe.prepTime <= 0
    )
      errors.prepTime = "Prep time must be a positive number.";
  
    // Include the new instruction if it's not empty
    if (newInstruction.trim() !== "") {
      setUpdatedRecipe((prev) => ({
        ...prev,
        instructions: [...prev.instructions, newInstruction],
      }));
      setNewInstruction(""); // Reset the input field after adding
    }
  
    setRecipeErrors(errors);
  
    if (Object.keys(errors).length > 0) return;
  
    try {
      await updateRecipe(recipeId, updatedRecipe);
      setRecipe(updatedRecipe);
      setIsEditing(false);
      setRecipeErrors({});
      toast.success("Recipe updated successfully!");
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Failed to update recipe.");
    }
  };  

  // add a new instruction
  const handleAddInstruction = () => {
    if (newInstruction.trim() === "") return;
    setUpdatedRecipe({
      ...updatedRecipe,
      instructions: [...updatedRecipe.instructions, newInstruction],
    });
    setNewInstruction(""); // clear input after adding
  };

  // remove an instruction
  const handleRemoveInstruction = (index) => {
    const updatedInstructions = [...updatedRecipe.instructions];
    updatedInstructions.splice(index, 1);
    setUpdatedRecipe({ ...updatedRecipe, instructions: updatedInstructions });
  };

  // add a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
  
    const errors = {};
    if (!commenterName) errors.name = "Name is required.";
    if (!commentBody) errors.body = "Comment cannot be empty.";
  
    setCommentErrors(errors);
  
    if (Object.keys(errors).length > 0) return;
  
    const newComment = {
      recipeId: Number(recipeId),
      commenterName,
      body: commentBody,
    };
  
    try {
      await addComment(newComment);
  
      // Refetch comments from the server to ensure persistence
      const updatedComments = await getCommentsByRecipeId(recipeId);
      setComments(updatedComments);
  
      setCommenterName("");
      setCommentBody("");
      setCommentErrors({});
  
      // success toast notification
      toast.success("Your comment has been added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment.");
    }
  };  

  // handle edits to the ingredient list
  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...updatedRecipe.ingredients];
    updatedIngredients[index] = value;
    setUpdatedRecipe({ ...updatedRecipe, ingredients: updatedIngredients });
  };

  // add new ingredient field
  const handleAddIngredient = () => {
    setUpdatedRecipe({
      ...updatedRecipe,
      ingredients: [...updatedRecipe.ingredients, ""],
    });
  };

  // remove ingredient field
  const handleRemoveIngredient = (index) => {
    const updatedIngredients = [...updatedRecipe.ingredients];
    updatedIngredients.splice(index, 1);
    setUpdatedRecipe({ ...updatedRecipe, ingredients: updatedIngredients });
  };

  if (!recipe) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading recipe details...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
    <ToastContainer position="top-right" autoClose={3000} />

    {/* back button */}
    <div className="mb-3">
      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
    </div>
      
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {isEditing ? (
        <div>
          <h1>Edit Recipe</h1>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              className={`form-control ${
                recipeErrors.name ? "is-invalid" : ""
              }`}
              value={updatedRecipe.name}
              onChange={(e) =>
                setUpdatedRecipe({ ...updatedRecipe, name: e.target.value })
              }
            />
            {recipeErrors.name && (
              <div className="invalid-feedback">{recipeErrors.name}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              className={`form-select ${
                recipeErrors.category ? "is-invalid" : ""
              }`}
              value={updatedRecipe.category}
              onChange={(e) =>
                setUpdatedRecipe({ ...updatedRecipe, category: e.target.value })
              }
            >
              <option value="">Select a category</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
            {recipeErrors.category && (
              <div className="invalid-feedback">{recipeErrors.category}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="prepTime" className="form-label">
              Prep Time (in minutes)
            </label>
            <input
              type="number"
              id="prepTime"
              className={`form-control ${recipeErrors.prepTime ? "is-invalid" : ""}`}
              value={updatedRecipe.prepTime}
              onChange={(e) =>
                setUpdatedRecipe({ ...updatedRecipe, prepTime: e.target.value })
              }
            />
            {recipeErrors.prepTime && (
              <div className="invalid-feedback">{recipeErrors.prepTime}</div>
            )}
          </div>
          
          {/* Ingredients Field */}
          <div className="mb-3">
            <label htmlFor="ingredients" className="form-label">
              Ingredients
            </label>
            {updatedRecipe.ingredients.map((ingredient, index) => (
              <div key={index} className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  value={ingredient}
                  onChange={(e) =>
                    handleIngredientChange(index, e.target.value)
                  }
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            {recipeErrors.ingredients && (
              <div className="text-danger">{recipeErrors.ingredients}</div>
            )}
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={handleAddIngredient}
            >
              Add Ingredient
            </button>
          </div>

          {/* Instructions Field */}
          <div className="mb-3">
            <label htmlFor="instructions" className="form-label">
              Instructions
            </label>
            {updatedRecipe.instructions.map((instruction, index) => (
              <div key={index} className="d-flex mb-2">
                <textarea
                  className="form-control me-2"
                  value={instruction}
                  rows={2}
                  onChange={(e) => {
                    const updatedInstructions = [...updatedRecipe.instructions];
                    updatedInstructions[index] = e.target.value;
                    setUpdatedRecipe({
                      ...updatedRecipe,
                      instructions: updatedInstructions,
                    });
                  }}
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemoveInstruction(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={() => {
                setUpdatedRecipe({
                  ...updatedRecipe,
                  instructions: [...updatedRecipe.instructions, ""],
                });
              }}
            >
              Add Instruction
            </button>
          </div>

          <button className="btn btn-success me-2" onClick={handleUpdateRecipe}>
            Save Changes
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h1>{recipe.name}</h1>
          <p><strong>Category:</strong> {recipe.category}</p>
          <p><strong>Prep Time:</strong> {recipe.prepTime} minutes</p>

          {/* Display Recipe Image */}
          {recipe.image && (
            <div className="mb-4">
              <img
                src={recipe.image}
                alt={recipe.name}
                style={{
                  width: "100%",
                  height: "350px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}

          <h3>Ingredients</h3>
          <ul className="list-group mb-3">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="list-group-item">
                {ingredient}
              </li>
            ))}
          </ul>
          <h3>Instructions</h3>
          <ul className="list-group mb-3">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="list-group-item">
                {instruction}
              </li>
            ))}
          </ul>
          <button
            className="btn btn-primary mt-3"
            onClick={() => setIsEditing(true)}
          >
            Edit Recipe
          </button>
        </div>
      )}
      <hr />
      <h3>Comments</h3>
      <ul className="list-group mb-3">
        {comments.map((comment) => (
          <li key={comment.id} className="list-group-item">
            <strong>{comment.commenterName}</strong>: {comment.body}
          </li>
        ))}
      </ul>

      {/* Add Comment Form */}
      <h4 className="mt-4">Leave a Comment!</h4>
      <form onSubmit={handleAddComment} className="mt-3">
        <div className="mb-3">
          <label htmlFor="commenterName" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="commenterName"
            className={`form-control ${commentErrors.name ? "is-invalid" : ""}`}
            value={commenterName}
            onChange={(e) => setCommenterName(e.target.value)}
          />
          {commentErrors.name && (
            <div className="invalid-feedback">{commentErrors.name}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="commentBody" className="form-label">
            Comment
          </label>
          <textarea
            id="commentBody"
            className={`form-control ${commentErrors.body ? "is-invalid" : ""}`}
            rows="3"
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
          ></textarea>
          {commentErrors.body && (
            <div className="invalid-feedback">{commentErrors.body}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Add Comment
        </button>
      </form>
    </div>
    </div>
  );
}