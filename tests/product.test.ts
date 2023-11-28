import request from "supertest";
import app from "../src/app";

describe("Product API", () => {
	let productId: string;
	let authToken: string;

	// Create a test user before all tests
	beforeAll(async () => {
		try {
			const response = await request(app)
				.post("/register")
				.send({ name: "TestUser", password: "testpassword" });

			expect(response.status).toBe(201);
			expect(response.body.name).toBe("TestUser");
		} catch (error) {
			console.error("Error during user creation:", error);
			throw error;
		}
	});

	// Login and obtain auth token before each test
	beforeEach(async () => {
		try {
			const response = await request(app)
				.post("/login")
				.send({ name: "TestUser", password: "testpassword" });

			expect(response.status).toBe(200);
			expect(response.body.token).toBeDefined();
			authToken = response.body.token;
		} catch (error) {
			console.error("Error during login:", error);
			throw error;
		}
	});

	test("should create a new product", async () => {
		try {
			const response = await request(app)
				.post("/products")
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					name: "Test Product",
					price: 19.99,
					description: "A test product",
				});

			expect(response.status).toBe(201);
			expect(response.body.name).toBe("Test Product");
			productId = response.body._id;
		} catch (error) {
			console.error("Error during create product test:", error);
			throw error;
		}
	});

	test("should get all products", async () => {
		try {
			const response = await request(app)
				.get("/products")
				.set("Authorization", `Bearer ${authToken}`);

			expect(response.status).toBe(200);
			expect(response.body.length).toBeGreaterThanOrEqual(1);
		} catch (error) {
			console.error("Error during get all products test:", error);
			throw error;
		}
	});

	// ... Other tests ...

	// Cleanup: Delete the test user and products after all tests
	afterAll(async () => {
		try {
			// Delete the product created during tests
			if (productId) {
				const deleteProductResponse = await request(app)
					.delete(`/products/${productId}`)
					.set("Authorization", `Bearer ${authToken}`);

				expect(deleteProductResponse.status).toBe(204);
			}

			// Delete the test user
			const deleteUserResponse = await request(app)
				.delete("/users/TestUser")
				.set("Authorization", `Bearer ${authToken}`);

			expect(deleteUserResponse.status).toBe(204);
		} catch (error) {
			console.error("Error during cleanup:", error);
		}
	});
});
