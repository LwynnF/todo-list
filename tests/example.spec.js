import { test, expect } from "@playwright/test";

test.describe("Todo input", () => {
	test("should have correct metadata and elements", async ({ page }) => {
		await page.goto("http://localhost:3000");
		await expect(page).toHaveTitle("Todo List");
		// await expect(page).toHaveSelector("h1", { text: "To do list" });
		await expect(
			page.getByRole("heading", {
				name: "To do list",
			})
		).toBeVisible();
    await expect(page.getByPlaceholder("Add your todo here")).toBeVisible();
    await expect(page.getByRole("button", {name: "+"})).toBeVisible();

	});
});

// @ts-check
// const { test, expect } = require('@playwright/test');

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
