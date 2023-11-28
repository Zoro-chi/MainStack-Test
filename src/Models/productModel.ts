import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
	name: string;
	price: number;
	description: string;
}

const productSchema: Schema = new Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	description: { type: String, required: true },
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
