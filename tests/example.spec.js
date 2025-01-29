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

		// Add first todo item
		await page.fill('input[placeholder="Add your todo here"]', "Buy groceries");
		await page.getByRole("button", { name: "+" }).click();

		// Add second todo item
		await page.fill('input[placeholder="Add your todo here"]', "Clean house");
		await page.getByRole("button", { name: "+" }).click();

		// Check if todo items are displayed in the container
		const groceriesItem = page.locator(
			".todo-items-container .todo-item:has-text('Buy groceries')"
		);
		const cleanItem = page.locator(
			".todo-items-container .todo-item:has-text('Clean house')"
		);

		await expect(groceriesItem).toHaveText("Buy groceries");
		await expect(cleanItem).toHaveText("Clean house");

		// Check if existing todo has triggered text in progress indicator
		const tasksCompletedText = page.locator(".progress-indicator-text");
		await expect(tasksCompletedText).toBeVisible();

		// Check if checkbox is visible after todo added
		const checkbox = groceriesItem.locator('input[type="checkbox"]');
		await expect(checkbox).toBeVisible();

		// Check text is striked through when checkbox is checked
		await checkbox.check();
		await expect(checkbox).toBeChecked();
		await expect(groceriesItem.locator("p")).toHaveCSS(
			"text-decoration",
			/line-through/
		);

		// Check progress indicator text is updated accordingly ater todo item is checked
		const tasksCompletedTextP1 = page.locator(
			".progress-indicator-text tspan:nth-of-type(1)"
		);
		const tasksCompletedTextP2 = page.locator(
			".progress-indicator-text tspan:nth-of-type(2)"
		);
		await expect(tasksCompletedTextP1).toHaveText("1/2 tasks");
		await expect(tasksCompletedTextP2).toHaveText("completed");

		// Edit a specific todo item using enter key
		await groceriesItem.locator('button[aria-label="edit"]').click();
		await page.fill(
			'input[placeholder="Add your todo here"]',
			"Buy groceries edit"
		);
		await page.press('input[placeholder="Add your todo here"]', "Enter");

		await expect(groceriesItem).toHaveText("Buy groceries edit");

		// Delete a todo item
		await groceriesItem.locator('button[aria-label="delete"]').click();
		await expect(groceriesItem).not.toBeVisible();
	});
});

