from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Listen to console logs
        page.on("console", lambda msg: print(f"BROWSER LOG: {msg.text}"))

        print("Navigating to app...")
        page.goto("http://localhost:3000")

        # Wait for Start Screen
        page.wait_for_selector("text=GEO-EXPLORER // MISSION SELECT", timeout=60000)

        # Start Game (Easy)
        print("Starting game...")
        page.click("button:has-text('CLEARANCE LEVEL 1')")

        # Wait for Game Interface
        page.wait_for_selector("text=Make Guess", timeout=30000)

        # Place a guess on the map
        print("Placing guess...")
        map_loc = page.locator(".map-container.guessing")
        map_loc.wait_for(state="visible")

        box = map_loc.bounding_box()
        if box:
            print(f"Map found at {box}")
            # Click multiple times
            page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
            time.sleep(0.5)
            page.mouse.click(box["x"] + 20, box["y"] + 20)
        else:
            print("Map container bounding box not found!")

        # Wait a bit
        time.sleep(2)

        # Check if button is enabled
        button = page.locator("text=Make Guess")
        if button.is_disabled():
            print("Button is disabled! Taking screenshot of map area...")
            page.screenshot(path="verification/map_area.png")
            return

        # Click Make Guess
        print("Clicking Make Guess...")
        button.click()

        # Verify Triangulating Message
        try:
            page.wait_for_selector("text=TRIANGULATING TARGET POSITION...", timeout=5000)
            print("Triangulating message found!")
            page.screenshot(path="verification/triangulating.png")
        except Exception as e:
            print(f"Triangulating message not found: {e}")

        # Wait for Round Summary
        try:
            page.wait_for_selector("text=MISSION DEBRIEF:", timeout=10000)
            print("Taking Round Summary screenshot...")
            page.screenshot(path="verification/round_summary.png")
        except Exception as e:
            print(f"Round Summary not found: {e}")

        browser.close()

if __name__ == "__main__":
    run()
