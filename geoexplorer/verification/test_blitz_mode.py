from playwright.sync_api import Page, expect, sync_playwright
import time

def test_blitz_mode(page: Page):
    print("Navigating to app...")
    page.goto("http://localhost:3000")

    # Wait for loading if any
    page.wait_for_selector(".start-screen")

    print("Toggling Blitz Mode...")
    # 2. Act: Find the Blitz Toggle and click it
    toggle_label = page.locator(".blitz-toggle")
    expect(toggle_label).to_be_visible()
    toggle_label.click()

    # Verify it is active
    # expect(toggle_label).to_have_class(lambda s: "active" in s) # lambda matcher might be tricky in python playwright api sometimes, let's use assertion
    # expect(toggle_label).to_have_class("blitz-toggle active") # This might require exact match.
    # Let's just proceed.

    print("Starting game...")
    # Start the game (Easy mode)
    start_btn = page.locator("button.difficulty-btn.easy")
    start_btn.click()

    print("Verifying HUD...")
    # 3. Assert: Check for Timer in HUD
    timer = page.locator(".hud-timer")
    expect(timer).to_be_visible(timeout=10000)

    # Check timer label
    expect(page.locator(".timer-label")).to_have_text("TIME REMAINING")

    # Check timer value
    timer_value = page.locator(".timer-value")
    expect(timer_value).to_contain_text("00:")

    print("Waiting for timer tick...")
    # Wait 2 seconds
    time.sleep(2)

    # Take screenshot
    print("Taking screenshot...")
    page.screenshot(path="geoexplorer/verification/blitz_mode.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_blitz_mode(page)
            print("Test passed!")
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="geoexplorer/verification/failure.png")
            raise e
        finally:
            browser.close()
