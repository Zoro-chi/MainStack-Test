import request from "supertest";
import app from "../src/app";

describe("Product API", () => {
	let productId: string;
	let authToken: string;
	let userId: string;

	// Create a test user before all tests
	beforeAll(async () => {
		try {
			const response = await request(app)
				.post("/products/register")
				.send({ name: "TestUser", password: "testpassword" });

			expect(response.status).toBe(201); // 201 Created
			expect(response.body.name).toBe("TestUser");
		} catch (error) {
			console.error("Error during user creation:", error);
			throw error;
		}
	});

	// Test creating a duplicate user
	test("should not create a user with the same name", async () => {
		try {
			const response = await request(app)
				.post("/products/register")
				.send({ name: "TestUser", password: "testpassword" });

			expect(response.status).toBe(400);
			expect(response.body.error).toBe("User with the same name already exists");
		} catch (error) {
			console.error("Error during duplicate user creation test:", error);
			throw error;
		}
	});

	// Login and obtain auth token
	test("should login user", async () => {
		try {
			const response = await request(app)
				.post("/products/login")
				.send({ name: "TestUser", password: "testpassword" });

			expect(response.status).toBe(200);
			expect(response.body.token).toBeDefined();
			authToken = response.body.token;
			userId = response.body.user._id;
		} catch (error) {
			console.error("Error during login:", error);
			throw error;
		}
	});

	// Test creating a new product
	test("should create a new product", async () => {
		try {
			const response = await request(app)
				.post("/products/new")
				.set("Authorization", `${authToken}`)
				.send({
					name: "Test Product",
					price: 1900,
					description: "A test product",
				});

			expect(response.status).toBe(201);
			expect(response.body.name).toBe("Test Product");
			expect(response.body._id).toBeDefined(); //
			productId = response.body._id; //
		} catch (error) {
			console.error("Error during create product test:", error);
			throw error;
		}
	});

	// Test getting all products
	test("should get all products", async () => {
		try {
			const response = await request(app)
				.get("/products/products")
				.set("Authorization", `${authToken}`);

			expect(response.status).toBe(200);
			expect(response.body.length).toBeGreaterThanOrEqual(1);
		} catch (error) {
			console.error("Error during get all products test:", error);
			throw error;
		}
	});

	// Test getting a product by id
	test("should get a product by id", async () => {
		try {
			const response = await request(app)
				.get(`/products/single?id=${productId}`)
				.set("Authorization", `${authToken}`);

			expect(response.status).toBe(200);
			expect(response.body.name).toBe("Test Product");
		} catch (error) {
			console.error("Error during get product by id test:", error);
			throw error;
		}
	});

	// Test updating a product
	test("should update a product", async () => {
		try {
			const response = await request(app)
				.put(`/products?id=${productId}`)
				.set("Authorization", `${authToken}`)
				.send({
					name: "Updated Product",
					price: 2000,
					description: "An updated test product",
				});

			expect(response.status).toBe(200);
			expect(response.body.name).toBe("Updated Product");
		} catch (error) {
			console.error("Error during update product test:", error);
			throw error;
		}
	});

	// Cleanup: Delete the test user and products after all tests
	afterAll(async () => {
		try {
			// Delete the product created during tests
			if (productId) {
				console.log("Deleting test product...");
				const deleteProductResponse = await request(app)
					.delete(`/products?id=${productId}`)
					.set("Authorization", `${authToken}`);

				expect(deleteProductResponse.status).toBe(204);
			}

			// Delete the test user
			const deleteUserResponse = await request(app)
				.delete(`/products/users?id=${userId}`)
				.set("Authorization", `${authToken}`);

			expect(deleteUserResponse.status).toBe(204);
		} catch (error) {
			console.error("Error during cleanup:", error);
		}
	});
});
