import mongoose, { Document, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface IUser extends Document {
	name: string;
	password: string;
	generateAuthToken(): string;
}

const userSchema = new Schema<IUser>({
	name: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{ _id: this._id, name: this.name },
		process.env.SECRET_KEY! || "mysecretkey"
	);
	return token;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
