import request from "supertest";

// post, get, put, delete

describe("Verify that the GET, POST, PUT, DELETE API returns correctly", () => {
	it("Verify that the GET API returns correctly", async () => {
		const res = await request("http://localhost:3001")
			.get("/api/todos")
			.send()
			.expect(200);

		expect(res.status).toBe(200);
		expect(res.body[0].id).toEqual(476);
		expect(res.body[0].task).toEqual("feed mona");
	});

	it("Verify that the POST API returns correctly", async () => {
		const res = await request("http://localhost:3001")
			.post("/api/todos")
			.send({
				id: 516,
				task: "exercise",
				isCompleted: false,
			})
			.expect(201);

		console.log(res);
		expect(res.statusCode).toBe(201);
		expect(res.body[3].id).toEqual(515);
		expect(res.body[3].task).toEqual("exercise");
		expect(res.body[3].isCompleted).toEqual(false);
	});

	it("Verify that the PUT API returns correctly", async () => {
		const res = await request("http://localhost:3001");
		const id = 515;
		const updatedTodo = {
			id: 515,
			task: "exercise - run",
			isCompleted: true,
		}
			.put(`/api/todos/${id}`)
			.send({ updatedTodo })
			.expect(200);
		expect(res.body[4].id).toEqual(515);
		expect(res.body[4].task).toEqual("exercise - run");
		expect(res.body[4].isCompleted).toEqual(true);
	});

	it("Verify that the DELETE API returns correctly", async () => {
		const res = await request("http://localhost:3001");
		const id = (516).delete(`api/todos/${id}`).expect(204);
	});
});
