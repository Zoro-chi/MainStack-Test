import express from "express";
import authenticateToken from "../Middleware/authMiddleware";
import * as productController from "../Controllers/productController";

const router = express.Router();

// router.post("/register", productController.createUser);
// router.post("/login", productController.loginUser);
// router.get("/products", authenticateToken, productController.getProducts);
// router.get("/products/:id", authenticateToken, productController.getProductById);
// router.put("/products/:id", authenticateToken, productController.updateProduct);
// router.delete("/products/:id", authenticateToken, productController.deleteProduct);

router.post("/register", productController.createUser);
router.post("/login", productController.loginUser);
router.get("/products", authenticateToken, productController.getProducts);
router.get("/products/:id", authenticateToken, productController.getProductById);
router.put("/products/:id", authenticateToken, productController.updateProduct);
router.delete("/products/:id", authenticateToken, productController.deleteProduct);

export default router;
