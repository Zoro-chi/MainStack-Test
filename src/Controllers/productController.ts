import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/userModel";
import Product from "../Models/productModel";

export const createUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { username, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ username, password: hashedPassword });
		await user.save();
		res.status(201).json(user);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { name, password } = req.body;
		const user = await User.findOne({ name });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			res.status(401).json({ error: "Invalid credentials" });
			return;
		}

		const token = user.generateAuthToken();

		res.status(200).json({ message: "Login successful", user, token });
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
	try {
		const product = new Product(req.body);
		await product.save();
		res.status(201).json(product);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
	try {
		const products = await Product.find();
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			res.status(404).json({ error: "Product not found" });
			return;
		}
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
	try {
		const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!product) {
			res.status(404).json({ error: "Product not found" });
			return;
		}
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		if (!product) {
			res.status(404).json({ error: "Product not found" });
			return;
		}
		res.status(204).json();
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};
