import React, { useState, useEffect } from "react";
import {
  getGroceryItems,
  addGroceryItem,
  updateGroceryItem,
  deleteGroceryItem,
} from "../services/api";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

/**
 * GroceryList Component
 * This page displays a grocery list based on user input.
 * 
 * Users can:
 * - View all grocery items
 * - Add new grocery items
 * - Mark items as purchased
 * - Remove items from the list
 */

export default function GroceryList() {
  const [groceryItems, setGroceryItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", unit: "" });
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    quantity: "",
    unit: "",
  });

  // fetch grocery items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await getGroceryItems();
        setGroceryItems(items || []);
  
        // set document title
        document.title = "Grocery List";
      } catch (error) {
        console.error("Error fetching grocery items:", error);
        setGroceryItems([]); // ensure it's always an array
        document.title = "Error Loading Grocery List";
      }
    };
  
    fetchItems();
  }, []);  

  // handle adding item form submission
  const handleAddItem = async (e) => {
    e.preventDefault();

    let errors = {
      name: "",
      quantity: "",
      unit: "",
    };

    if (!newItem.name) errors.name = "Item name is required.";
    if (!newItem.quantity || isNaN(newItem.quantity) || newItem.quantity <= 0)
      errors.quantity = "Quantity must be a positive number.";
    if (!newItem.unit) errors.unit = "Unit is required.";

    setFieldErrors(errors);

    if (Object.values(errors).some((error) => error)) return;

    try {
      const addedItem = await addGroceryItem(newItem);
      setGroceryItems([...groceryItems, addedItem]);
      setNewItem({ name: "", quantity: "", unit: "" });
      setFieldErrors({ name: "", quantity: "", unit: "" });
      toast.success("Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item.");
    }
  };

  // mark item as purchased
  const handleTogglePurchased = async (itemId, purchased) => {
    try {
      const updatedItem = await updateGroceryItem(itemId, {
        purchased: !purchased,
      });
      setGroceryItems(
        groceryItems.map((item) =>
          item.id === itemId
            ? { ...item, purchased: updatedItem.purchased }
            : item
        )
      );
      toast.success(
        `Item marked as ${!purchased ? "purchased" : "not purchased"}!`
      );
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item.");
    }
  };

  // remove an item
  const handleDeleteItem = async (itemId) => {
    try {
      await deleteGroceryItem(itemId);
      setGroceryItems(groceryItems.filter((item) => item.id !== itemId));
      toast.success("Item successfully deleted!");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item.");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />{" "}
      {/* Toast Container */}
      <h1 className="text-center mb-4">Grocery List</h1>
      {/* New Item Form */}
      <form onSubmit={handleAddItem} className="mb-4">
        <div className="row">
          {/* Item Name Field */}
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Item Name
              </label>
              <input
                type="text"
                id="name"
                className={`form-control ${
                  fieldErrors.name ? "is-invalid" : ""
                }`}
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />
              {fieldErrors.name && (
                <div className="invalid-feedback">{fieldErrors.name}</div>
              )}
            </div>
          </div>

          {/* Quantity Field */}
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                className={`form-control ${
                  fieldErrors.quantity ? "is-invalid" : ""
                }`}
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: e.target.value })
                }
              />
              {fieldErrors.quantity && (
                <div className="invalid-feedback">{fieldErrors.quantity}</div>
              )}
            </div>
          </div>

          {/* Unit Field */}
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="unit" className="form-label">
                Unit
              </label>
              <input
                type="text"
                id="unit"
                className={`form-control ${
                  fieldErrors.unit ? "is-invalid" : ""
                }`}
                value={newItem.unit}
                onChange={(e) =>
                  setNewItem({ ...newItem, unit: e.target.value })
                }
              />
              {fieldErrors.unit && (
                <div className="invalid-feedback">{fieldErrors.unit}</div>
              )}
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Item
        </button>
      </form>
      
      {/* Grocery Items List */}
      <ul className="list-group">
      {Array.isArray(groceryItems) &&
        groceryItems.map((item) => (
          <li
            key={item.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              item.purchased ? "bg-light text-decoration-line-through" : ""
            }`}
          >
            <div>
              <strong>{item.name}</strong> ({item.quantity} {item.unit})
            </div>
            <div>
              <button
                className="btn btn-success btn-sm me-2"
                onClick={() => handleTogglePurchased(item.id, item.purchased)}
              >
                {item.purchased ? "Unmark" : "Mark as Purchased"}
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteItem(item.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
