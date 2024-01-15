import express from "express"
import { pool } from "../database/Connection.js";

const router=express.Router()


router.get("/products", async (req, res) => {
    try {
        const { page = 1} = req.query;
        const pageSize = 10 
        const offset = (page - 1) * pageSize;

        const result = await pool.query(
            `SELECT p.product_id, p.product_name, p.category_id, c.category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            ORDER BY p.product_id
            OFFSET $1
            LIMIT $2`,
            [offset, pageSize]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT p.product_id, p.product_name, p.category_id, c.category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.product_id = $1`,
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Update a product by product_id
router.put("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, category_id } = req.body;

        await pool.query(
            `UPDATE products
            SET product_name = $1 , category_id = $2
            WHERE product_id = $3`,
            [product_name, category_id, id]
        );

        res.send("Product updated successfully");
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Delete a product by product_id
router.delete("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM products WHERE product_id = $1", [id]);

        res.send("Product deleted successfully");
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Add a new product
router.post("/products", async (req, res) => {
    try {
        const { product_name, category_id } = req.body;

        const result = await pool.query(
            `INSERT INTO products (product_name, category_id)
            VALUES ($1, $2)
            RETURNING product_id`,
            [product_name, category_id]
        );

        res.json({ product_id: result.rows[0].product_id });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).send("Internal Server Error");
    }
});





export const productRouter=router