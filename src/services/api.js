const BASE_URL = process.env.REACT_APP_BASE_URL;

// fetch all recipes
export const getRecipes = async () => {
  const response = await fetch(`${BASE_URL}/recipes`);
  console.log("Fetch response:", response);
  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }
  return response.json();
};

// fetch a single recipe by ID
export const getRecipeById = async (id) => {
  const response = await fetch(`${BASE_URL}/recipes/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch recipe by id");
  }
  const recipe = await response.json();

  if (typeof recipe.instructions === "string") {
    recipe.instructions = recipe.instructions.split("\n");
  }
  return recipe;
};

// fetch all meal plans
export const getMealPlans = async () => {
  const response = await fetch(`${BASE_URL}/mealPlans`);
  console.log("Fetch response:", response);
  if (!response.ok) {
    throw new Error("Failed to fetch all meal plans");
  }
  return response.json();
};

// update a specific meal plan using PATCH
export const updateMealPlan = async (id, updatedMeals) => {
  const response = await fetch(`${BASE_URL}/mealPlans/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meals: updatedMeals }), // Remove .meals if unnecessary
  });

  if (!response.ok) {
    throw new Error("Failed to update meal plan.");
  }

  return response.json();
};

// add a new recipe to the database using POST
export const addRecipe = async (recipe) => {
  const response = await fetch(`${BASE_URL}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipe),
  });
  return response.json();
};

// update a recipe using PUT
export const updateRecipe = async (id, updatedRecipe) => {
  const response = await fetch(`${BASE_URL}/recipes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedRecipe),
  });
  return response.json();
};

// DELETE a recipe
export const deleteRecipe = async (id) => {
  await fetch(`${BASE_URL}/recipes/${id}`, {
    method: "DELETE",
  });
};

// fetch comments for a specific recipe
export const getCommentsByRecipeId = async (recipeId) => {
  const response = await fetch(`${BASE_URL}/comments?recipeId=${recipeId}`);
  console.log("Fetch response:", response);
  if (!response.ok) {
    throw new Error("Failed to fetch commens for a specific recipe");
  }
  return response.json();
};

// add a comment to a recipe using POST
export const addComment = async (comment) => {
  const response = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  });
  return response.json();
};

// fetch all saved recipes
export const getFavorites = async () => {
  const response = await fetch(
    `${BASE_URL}/favorites?_sort=favoritedAt&_order=desc`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch favorites");
  }
  return response.json();
};

// add a recipe to favorites using POST
export const addToFavorites = async (favorite) => {
  const response = await fetch(`${BASE_URL}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...favorite,
      favoritedAt: favorite.favoritedAt || new Date().toISOString(), // Ensure correct format
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to add to favorites");
  }
  return response.json();
};

// DELETE a recipe from saved recipes
export const removeFromFavorites = async (id) => {
  const response = await fetch(`${BASE_URL}/favorites/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to remove from favorites");
  }
};

// fetch all grocery items
export const getGroceryItems = async () => {
  const response = await fetch(`${BASE_URL}/groceryItems`);
  console.log("Fetch response:", response);
  if (!response.ok) {
    throw new Error("Failed to fetch all grocery items");
  }
  return response.json();
};

// add an item to the grocery list using POST
export const addGroceryItem = async (item) => {
  const response = await fetch(`${BASE_URL}/groceryItems`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return response.json();
};

// update a grocery item using PATCH
export const updateGroceryItem = async (id, updatedFields) => {
  const response = await fetch(`${BASE_URL}/groceryItems/${id}`, {
    method: "PATCH", // PATCH for partial updates
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedFields),
  });

  if (!response.ok) {
    throw new Error("Failed to update grocery item.");
  }

  return response.json();
};

// DELETE a grocery item
export const deleteGroceryItem = async (id) => {
  await fetch(`${BASE_URL}/groceryItems/${id}`, {
    method: "DELETE",
  });
};

// save a recipe to the saved recipes list
export const saveRecipe = async (recipe) => {
  // fetch current saved to check for duplicates
  const favorites = await getFavorites();

  // check if the recipe already exists in saved
  const isAlreadySaved = favorites.some((fav) => fav.id === recipe.id);
  if (isAlreadySaved) {
    throw new Error("Recipe is already saved.");
  }

  // add the timestamp for when a recipe was saved
  const recipeWithTimestamp = {
    ...recipe,
    favoritedAt: new Date().toISOString(),
  };

  // save the recipe with the timestamp
  const response = await fetch(`${BASE_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeWithTimestamp),
  });

  if (!response.ok) {
    throw new Error("Failed to save recipe");
  }

  return response.json();
};