import express from "express"
import { pool } from "../database/Connection.js";

const router=express.Router()



router.get("/categories", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM categories");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/categories/:id", async (req, res) => {
    try {
        const {id}=req.params;
        const result = await pool.query("SELECT * FROM categories WHERE category_id = $1",[id]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Update a category by category_id
router.put("/categories/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name } = req.body;

        await pool.query("UPDATE categories SET category_name = $1 WHERE category_id = $2", [category_name, id]);

        res.send("Category updated successfully");
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Delete a category by category_id
router.delete("/categories/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Set category_id to 'NA' in products table
        await pool.query("UPDATE products SET category_id = null WHERE category_id = $1", [id]);

        // Delete the category
        await pool.query("DELETE FROM categories WHERE category_id = $1", [id]);

        res.send("Category deleted successfully");
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Add a new category
router.post("/categories", async (req, res) => {
    try {
        const { category_name } = req.body;

        const result = await pool.query("INSERT INTO categories (category_name) VALUES ($1) RETURNING category_id", [
            category_name,
        ]);

        res.json({ category_id: result.rows[0].category_id });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).send("Internal Server Error");
    }
});

export const categoriesRouter=router