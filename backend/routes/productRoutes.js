import express from "express"
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controllers/productControllers.js";

const router = express.Router()

router.get("/", getAllProducts)
router.get("/:id", getProduct)
router.post("/", createProduct)
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)

export default router;