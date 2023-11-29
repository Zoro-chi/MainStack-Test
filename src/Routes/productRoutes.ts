import express from "express";
import authenticateToken from "../Middleware/authMiddleware";
import * as productController from "../Controllers/productController";

const router = express.Router();

router.post("/register", productController.createUser);
router.post("/login", productController.loginUser);
router.get("/products", authenticateToken, productController.getProducts);
router.post("/new", authenticateToken, productController.createProduct);
router.get("/single", authenticateToken, productController.getProductById);
router.put("/", authenticateToken, productController.updateProduct);
router.delete("/", authenticateToken, productController.deleteProduct);
router.delete("/users/", authenticateToken, productController.deleteUser);

export default router;
