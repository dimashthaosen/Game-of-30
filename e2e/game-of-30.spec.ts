import { expect, test } from "@playwright/test";

test("creates players, generates a mocked list, saves scores, and shows history", async ({ page }) => {
  await page.route("**/api/top-30", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        question: "Which countries have the largest populations?",
        title: "Largest Countries by Population",
        rankingBasis: "Ranked by current population estimates.",
        generatedAt: "2026-06-07T00:00:00.000Z",
        items: [
          { rank: 1, name: "India", value: "1.4B", sourceUrls: ["https://example.com/india"] },
          { rank: 2, name: "China", value: "1.4B", sourceUrls: ["https://example.com/china"] },
          { rank: 3, name: "United States", value: "340M", sourceUrls: ["https://example.com/us"] },
        ],
        sources: [{ title: "Example Rankings", url: "https://example.com" }],
        warnings: [],
      }),
    });
  });

  await page.goto("/");
  await page.getByLabel("New player name").fill("Dimash");
  await page.getByLabel("Add player").click();
  await page.getByLabel("New player name").fill("Alex");
  await page.getByLabel("Add player").click();

  await page.getByLabel("Round question").fill("Which countries have the largest populations?");
  await page.getByRole("button", { name: "Generate" }).click();

  await expect(page.getByRole("heading", { name: "Largest Countries by Population" })).toBeVisible();
  await expect(page.getByLabel("Rank 1 name")).toHaveValue("India");

  await page.getByLabel("Name for Dimash").fill("Dimash");
  await page.getByLabel("Name for Alex").fill("Alex");

  await page.locator(".score-inputs label", { hasText: "Dimash" }).getByRole("spinbutton").fill("25");
  await page.locator(".score-inputs label", { hasText: "Alex" }).getByRole("spinbutton").fill("1");
  await page.getByRole("button", { name: "Save round" }).click();

  await expect(page.getByText("Saved rounds")).toBeVisible();
  await expect(page.getByRole("button", { name: /Largest Countries by Population/ })).toBeVisible();
  await expect(page.getByLabel("Name for Dimash").locator("xpath=ancestor::li")).toContainText("25");
  await expect(page.getByLabel("Name for Alex").locator("xpath=ancestor::li")).toContainText("1");
});

test("opens the rules window in a mobile layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Game rules" }).click();

  await expect(page.getByRole("dialog", { name: "Game rules" })).toBeVisible();
  await expect(page.getByText("Rank number equals points")).toBeVisible();

  await page.getByRole("button", { name: "Close rules" }).click();

  await expect(page.getByRole("dialog", { name: "Game rules" })).toBeHidden();
});
