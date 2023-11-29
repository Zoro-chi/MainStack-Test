import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../Models/userModel";
import Product from "../Models/productModel";

export const home = async (req: Request, res: Response): Promise<void> => {
	try {
		res.status(200).json({ message: "Welcome to the Mainstack Store API" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { name, password } = req.body;

		// Check if a user with the same name already exists
		const existingUser = await User.findOne({ name });

		if (existingUser) {
			res.status(400).json({ error: "User with the same name already exists" });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ name, password: hashedPassword });
		await user.save();
		res.status(201).json(user);
	} catch (error) {
		console.log(error);
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
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
	try {
		const product = new Product(req.body);
		await product.save();
		res.status(201).json(product);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
	try {
		const products = await Product.find();
		res.status(200).json(products);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
	try {
		// Try to get the id from the query parameters
		const id = (req.query.id as string) || (req.params.id as string);

		if (!id) {
			res.status(400).json({ error: "Product ID is missing" });
			return;
		}

		const product = await Product.findById(id);
		if (!product) {
			res.status(404).json({ error: "Product not found" });
			return;
		}
		res.status(200).json(product);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
	try {
		// Extract the product ID from the URL parameters
		const id = (req.query.id as string) || (req.params.id as string);

		// Check if the product ID is provided
		if (!id) {
			res.status(400).json({ error: "Product ID is required" });
			return;
		}

		// Use findByIdAndUpdate to update the product
		const product = await Product.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		// Check if the product is found and updated
		if (!product) {
			res.status(404).json({ error: "Product not found" });
			return;
		}

		res.status(200).json(product);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
	try {
		// Extract the product ID from the URL parameters
		const id = (req.query.id as string) || (req.params.id as string);

		// Check if the product ID is provided
		if (!id) {
			res.status(400).json({ error: "Product ID is required" });
			return;
		}

		const product = await Product.findByIdAndDelete(id);

		if (!product) {
			res.status(404).json({ error: "Product not found" });
			return;
		}

		const products = await Product.find();

		res.status(204).json(products);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const id = (req.query.id as string) || (req.params.id as string);
		await User.deleteOne({ _id: id });

		res.status(204).json({ message: "User deleted successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
