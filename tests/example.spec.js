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
	test("todo item should appear in todo item container", async ({ page }) => {
		await page.goto("http://localhost:3000");

		// Add a todo item
		await page.fill('input[placeholder="Add your todo here"]', "Buy groceries");
		await page.click("button");

		// Check if todo item displayed in the container
		const todoItem = page.locator(".todo-items-container .todo-item");
		await expect(todoItem).toHaveText("Buy groceries");

		// Check if existing todo has triggered text in progress indicator
		const tasksCompletedText = page.locator(".progress-indicator-text");

		await expect(tasksCompletedText).toBeVisible();
	});
});
