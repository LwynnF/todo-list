const request = require("supertest");

test("API GET Request Test", async () => {
	const response = await request(
		"http://localhost:5000/api/todos"
	).get("/posts/1");

	expect(response.status).toBe(200);
	expect(response.body.userId).toBe(1);
});
