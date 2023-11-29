import express, { Request } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./Routes/productRoutes";

const app = express();
dotenv.config();

// Middleware
app.use(cors<Request>());
// app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use("/", productRoutes);

// Database Connection
const connectToDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI!, {} as ConnectOptions);
		console.log("Connected to Store API Database - Initial Connection");
	} catch (err) {
		console.log(`Initial Store API Database connection error occurred -`, err);
	}
};

connectToDatabase();

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

export default app;
