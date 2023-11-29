import jwt from "jsonwebtoken";
import { Request as ExpressRequest, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

interface CustomRequest extends ExpressRequest {
	user: any; // Adjust the type according to your user object structure
}

const authenticateToken = (
	req: CustomRequest,
	res: Response,
	next: NextFunction
): void => {
	const token = req.header("Authorization");

	if (!token) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	jwt.verify(token, process.env.SECRET_KEY || "mysecretkey", (err, user) => {
		if (err) {
			res.status(403).json({ error: "Forbidden" });
			return;
		}

		req.user = user;
		next();
	});
};

export default authenticateToken;
