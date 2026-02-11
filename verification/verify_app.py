from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            print("Navigating to app...")
            page.goto("http://localhost:3000")

            # Wait for Mission Select
            print("Waiting for Mission Select...")
            page.wait_for_selector("text=GEO-EXPLORER // MISSION SELECT", timeout=60000)

            # Screenshot Start Screen
            page.screenshot(path="verification/start_screen.png")
            print("Start Screen Screenshot Taken")

            # Click Easy Mode
            print("Clicking Easy Mode...")
            page.click("button:has-text('CLEARANCE LEVEL 1')")

            # Wait for Game Load
            print("Waiting for Game to Load...")
            # Wait for HUD
            page.wait_for_selector("text=G.I.M. - GEO INTEL MODULE", timeout=60000)

            # Wait for loading spinner to go away
            page.wait_for_selector(".loading-overlay", state="hidden", timeout=60000)

            # Check for Mission Log
            print("Checking Mission Log...")
            page.wait_for_selector("text=MISSION LOG", timeout=10000)
            page.wait_for_selector("text=MISSION START. TARGETS IDENTIFIED.", timeout=10000)

            # Test Uplink
            print("Testing Uplink...")
            page.click("button[title*='Satellite Uplink']")
            page.wait_for_selector("text=SATELLITE UPLINK ESTABLISHED", timeout=10000)

            # Test Hint
            print("Testing Hint...")
            page.click("button:has-text('Emergency Hint')")
            page.wait_for_selector("text=EMERGENCY PROTOCOLS ACTIVE", timeout=10000)

            # Wait a bit for decryption animation
            page.wait_for_timeout(2000)

            # Screenshot Game Screen
            page.screenshot(path="verification/game_screen.png")
            print("Game Screen Screenshot Taken")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
