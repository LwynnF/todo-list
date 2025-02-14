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

test.describe("API test (only works when connected to DB - ignore this please, remove if you want all the tests to pas", () => {
	test("should create a new task", async ({ request }) => {
		const newTask = await request.post("http://localhost:3001/api/todos", {
			data: {
				task: "New Task",
			},
		});

		expect(newTask.ok()).toBeTruthy();

		const tasks = await request.get("http://localhost:3001/api/todos");

		expect(tasks.ok()).toBeTruthy();
		expect(await tasks.json()).toContainEqual(
			expect.objectContaining({
				task: "New Task",
			})
		);
	});
});

test.describe("Todo item & progress indicator", () => {
	test.beforeEach(async ({ page }) => {
		await page.route("http://localhost:3001/api/todos", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify([]),
			});
		});

		await page.route("http://localhost:3001/api/todos/*", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify({}),
			});
		});

		await page.goto("http://localhost:3000");
	});

	test("should add a todo item", async ({ page }) => {
		await page.route("http://localhost:3001/api/todos", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify({
					id: 1,
					task: "TEST: Buy groceries",
					isCompleted: false,
				}),
			});
		});

		await page.fill(
			'input[placeholder="Add your todo here"]',
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
		await page.route("http://localhost:3001/api/todos", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify([
					{ id: 1, task: "TEST: Buy groceries", isCompleted: false },
				]),
			});
		});

		await page.goto("http://localhost:3000");

		const tasksCompletedText = page.locator(".progress-indicator-text");
		await expect(tasksCompletedText).toBeVisible();
	});

	test("should mark todo item as completed", async ({ page }) => {
		await page.route("http://localhost:3001/api/todos", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify([
					{ id: 1, task: "TEST: Buy groceries", isCompleted: false },
				]),
			});
		});

		await page.goto("http://localhost:3000");

		const groceriesItem = page
			.locator(
				".todo-items-container .todo-item:has-text('TEST: Buy groceries')"
			)
			.first();
		const checkbox = groceriesItem.locator('input[type="checkbox"]');
		await expect(checkbox).toBeVisible();

		await checkbox.evaluate((node) => node.click());

		await expect(checkbox).toBeChecked();
		await page.waitForTimeout(1000);
		await expect(groceriesItem.locator("p")).toHaveClass(/checked/);
	});

	test("should update progress indicator when todo item is completed", async ({
		page,
	}) => {
		await page.route("http://localhost:3001/api/todos", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify([
					{ id: 1, task: "TEST: Buy groceries", isCompleted: false },
				]),
			});
		});

		await page.goto("http://localhost:3000");

		const groceriesItem = page
			.locator(
				".todo-items-container .todo-item:has-text('TEST: Buy groceries')"
			)
			.first();
		const checkbox = groceriesItem.locator('input[type="checkbox"]');
		await checkbox.evaluate((node) => node.click());

		const testTodos = page.locator('.todo-item:has-text("TEST:")');
		const testTodosCount = await testTodos.count();
		const completedTestTodos = await testTodos
			.locator('input[type="checkbox"]:checked')
			.count();

		const tasksCompletedTextP1 = page.locator(
			".progress-indicator-text tspan:nth-of-type(1)"
		);
		const tasksCompletedTextP2 = page.locator(
			".progress-indicator-text tspan:nth-of-type(2)"
		);
		await expect(tasksCompletedTextP1).toHaveText(
			`${completedTestTodos}/${testTodosCount} tasks`
		);
		await expect(tasksCompletedTextP2).toHaveText("completed");
	});

	test("should edit a todo item", async ({ page }) => {
		await page.route("http://localhost:3001/api/todos", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify([
					{ id: 1, task: "TEST: Buy groceries", isCompleted: false },
				]),
			});
		});

		await page.goto("http://localhost:3000");

		const groceriesItem = page
			.locator(
				".todo-items-container .todo-item:has-text('TEST: Buy groceries')"
			)
			.first();
		await groceriesItem.locator('button[aria-label="edit"]').click();
		await page.fill(
			'input[placeholder="Add your todo here"]',
			"TEST: Buy groceries edit"
		);
		await page.press('input[placeholder="Add your todo here"]', "Enter");

		await page.waitForTimeout(5000);
		await expect(groceriesItem).toHaveText("TEST: Buy groceries edit");
	});

	test("should delete a todo item", async ({ page }) => {
		await page.route("http://localhost:3001/api/todos", (route) => {
			route.fulfill({
				status: 200,
				body: JSON.stringify([
					{ id: 1, task: "TEST: Buy groceries", isCompleted: false },
				]),
			});
		});

		await page.goto("http://localhost:3000");

		const groceriesItem = page
			.locator(
				".todo-items-container .todo-item:has-text('TEST: Buy groceries')"
			)
			.first();

		await page.route("http://localhost:3001/api/todos/1", (route) => {
			if (route.request().method() === "DELETE") {
				route.fulfill({
					status: 200,
					body: JSON.stringify({}),
				});
			} else {
				route.continue();
			}
		});

		await groceriesItem.locator('button[aria-label="delete"]').click();
		await expect(groceriesItem).not.toBeVisible();
	});
});
