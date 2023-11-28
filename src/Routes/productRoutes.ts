import express from "express";
import authenticateToken from "../Middleware/authMiddleware";
import * as productController from "../Controllers/productController";

const router = express.Router();

router.post("/register", productController.createUser);
router.post("/login", productController.loginUser);
router.get("/", authenticateToken, productController.getProducts);
router.post("/new", authenticateToken, productController.createProduct);
router.get("/single", authenticateToken, productController.getProductById);
router.put("/", authenticateToken, productController.updateProduct);
router.delete("/", authenticateToken, productController.deleteProduct);

export default router;
