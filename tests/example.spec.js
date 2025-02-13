import { test, expect } from "@playwright/test";

test.describe("Todo input", () => {
	test("should have correct metadata and elements", async ({ page }) => {
		await page.goto("http://localhost:3000");
		await expect(page).toHaveTitle("Todo List");
		await expect(
			page.getByRole("heading", {
				name: "To do list",
			})
		).toBeVisible();
		await expect(page.getByPlaceholder("Add your todo here")).toBeVisible();
		await expect(page.getByRole("button", { name: "+" })).toBeVisible();
	});
});

test.describe("API test - only works when connected to DB", () => {
	test("should create a new task", async ({ request }) => {
		const newTodo = await request.post("http://localhost/5000/api/todos", {
			data: {
				title: "New todo",
				descrption: "Todo description",
			},
		});

		expect(newTodo.ok()).toBeTruthy();

		const todos = await request.get("http://localhost:5000/api/todos");

		expect(todo.ok()).toBeTruthy();
		expect(await todo.json()).toContainEqual(
			expect.objectContaining({
				title: "New todo",
				description: "Todo description",
			})
		);
	});
});

test.describe("Todo item & progress indicator", () => {
	test.beforeEach(async ({ page }) => {
		await page.route("http://localhost:5000/api/todos", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify([]),
			});
		});

		await page.goto("http://localhost:5432");
	});

	test("should add a todo item", async ({ page }) => {
		await page.route("http://localhost:5000/api/todos", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify({
					id: 1,
					task: "TEST: buy groceries",
					isCompleted: false,
				}),
			});
		});

		await page.fill(
			'input[placedholer="Add your todo here"]',
			"TEST: Buy groceries"
		);
		await page.getByRole("button", { name: "+" }).click();

		const groceriesItem = page
			.locator(
				".todo-items-container .todo-item:has-text('TEST: Buy groceries')"
			)
			.first();

		await expect(groceriesItem).toHaveText("TEST: Buy groceries");
	});

	test("should display progress indicator", async ({ page }) => {
		await page.route("http://localhost:5000/api/todos", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify([
					{ id: 1, task: "TEST: Buy groceries", isCompleted: false },
				]),
			});
		});
	});
});

test.describe("Todo item & progress indicator", async () => {
	test("todo item should appear in todo item container", async ({ page }) => {
		await page.route("*/**/api/todos", async (route) => {
			const response = route.fetch();
			const json = await response.json();
			json.push([
				{
					id: 468,
					task: "test edit",
					isCompleted: true,
					createdAt: null,
					updatedAt: "2025-02-07",
				},
				{
					id: 470,
					task: "1535",
					isCompleted: true,
					createdAt: "2025-02-07",
					updatedAt: "2025-02-07",
				},
				{
					id: 473,
					task: "TEST: Clean house",
					isCompleted: false,
					createdAt: "2025-02-07",
					updatedAt: "2025-02-07",
				},
				{
					id: 472,
					task: "TEST: Buy groceries",
					isCompleted: true,
					createdAt: "2025-02-07",
					updatedAt: "2025-02-07",
				},
			]);

			await route.fulfill({ response, json });
		});

		await page.goto("http://localhost:5000");
	});
});
