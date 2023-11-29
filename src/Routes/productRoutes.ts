import express from "express";
import authenticateToken from "../Middleware/authMiddleware";
import * as productController from "../Controllers/productController";

const router = express.Router();

router.get("/", productController.home);
router.post("/register", productController.createUser);
router.post("/login", productController.loginUser);
router.get("/products", authenticateToken as any, productController.getProducts);
router.post("/new", authenticateToken as any, productController.createProduct);
router.get("/single", authenticateToken as any, productController.getProductById);
router.put("/products", authenticateToken as any, productController.updateProduct);
router.delete("/products", authenticateToken as any, productController.deleteProduct);
router.delete("/users/", authenticateToken as any, productController.deleteUser);

export default router;
