import request from "supertest";


describe("Verify that the POST, PUT, GET & DELETE API returns correctly", () => {
	it("Verify that the POST API returns correctly", async () => {
		const res = await request("http://localhost:3001")
			.post("/api/todos")
			.send({
				id: 515,
				task: "exercise",
				isCompleted: false,
			})
			.expect(201);

		expect(res.statusCode).toBe(201);
		expect(res.body.id).toEqual(515);
		expect(res.body.task).toEqual("exercise");
		expect(res.body.isCompleted).toEqual(false);
	});

	it("Verify that the PUT API returns correctly", async () => {
		const res = await request("http://localhost:3001")
			.put("/api/todos/515")
			.send({ id: 515, task: "exercise - yoga", isCompleted: true });

		expect(res.body.id).toEqual(515);
		expect(res.body.task).toEqual("exercise - yoga");
		expect(res.body.isCompleted).toEqual(true);
	});

	it("Verify that the GET API returns correctly", async () => {
		const res = await request("http://localhost:3001")
			.get("/api/todos")
			.send()
			.expect(200);

		expect(res.status).toBe(200);

		const task = res.body.find((task) => task.id === 515);
		expect(task).toBeDefined();
		expect(task.task).toEqual("exercise - yoga");
		expect(task.isCompleted).toEqual(true);
	});

	it("Verify that the DELETE API returns correctly", async () => {
		const res = await request("http://localhost:3001")
			.delete(`/api/todos/515`)
			.expect(204);
	});
});
