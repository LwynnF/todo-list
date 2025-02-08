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

test.describe("Todo item & progress indicator", () => {
	test.afterEach(async ({ page }) => {
		// Clear all test todos before each test
		await page.goto("http://localhost:3000");
		await page.evaluate(async () => {
			const response = await fetch("http://localhost:4000/api/todos");
			const todos = await response.json();
			for (const todo of todos) {
				if (todo.task.startsWith("TEST: ")) {
					await fetch(`http://localhost:4000/api/todos/${todo.id}`, {
						method: "DELETE",
					});
				}
			}
		});
	});

	test("todo item should appear in todo item container", async ({ page }) => {
		await page.goto("http://localhost:3000");

		// Add first test todo item
		await page.fill(
			'input[placeholder="Add your todo here"]',
			"TEST: Buy groceries"
		);
		await page.getByRole("button", { name: "+" }).click();

		// Add second test todo item
		await page.fill(
			'input[placeholder="Add your todo here"]',
			"TEST: Clean house"
		);
		await page.getByRole("button", { name: "+" }).click();

		// Check if todo items are displayed in the container
		const groceriesItem = page
			.locator(
				".todo-items-container .todo-item:has-text('TEST: Buy groceries')"
			)
			.first();
		const cleanItem = page
			.locator(".todo-items-container .todo-item:has-text('TEST: Clean house')")
			.first();

		await expect(groceriesItem).toHaveText("TEST: Buy groceries");
		await expect(cleanItem).toHaveText("TEST: Clean house");

		// Check if existing todo has triggered text in progress indicator
		const tasksCompletedText = page.locator(".progress-indicator-text");
		await expect(tasksCompletedText).toBeVisible();

		// Check if checkbox is visible after todo added
		const checkbox = groceriesItem.locator('input[type="checkbox"]');
		await expect(checkbox).toBeVisible();

		// Check text is striked through when checkbox is checked
		await checkbox.evaluate((node) => node.click());

		await expect(checkbox).toBeChecked();
		await page.waitForTimeout(1000);
		await expect(groceriesItem.locator("p")).toHaveClass(/checked/);

		// Check progress indicator text is updated accordingly after todo item is checked
		// Only count test todos
		const todosCount = await page.locator(".todo-item").count();

		// Locate completed test todos
		const completedTodos = await page
			.locator(".todo-item")
			.locator('input[type="checkbox"]:checked')
			.count();

		const tasksCompletedTextP1 = page.locator(
			".progress-indicator-text tspan:nth-of-type(1)"
		);
		const tasksCompletedTextP2 = page.locator(
			".progress-indicator-text tspan:nth-of-type(2)"
		);
		await expect(tasksCompletedTextP1).toHaveText(
			`${completedTodos}/${todosCount} tasks`
		);
		await expect(tasksCompletedTextP2).toHaveText("completed");

		// Edit a specific todo item using enter key
		await groceriesItem.locator('button[aria-label="edit"]').click();
		await page.fill(
			'input[placeholder="Add your todo here"]',
			"TEST: Buy groceries edit"
		);
		await page.press('input[placeholder="Add your todo here"]', "Enter");

		// Wait for the state to update after the edit action
		await page.waitForTimeout(5000);
		await expect(groceriesItem).toHaveText("TEST: Buy groceries edit");

		// Delete a todo item
		await groceriesItem.locator('button[aria-label="delete"]').click();
		await expect(groceriesItem).not.toBeVisible();
	});
});
