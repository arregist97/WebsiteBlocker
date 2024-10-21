// Initialize the list of blocked websites
let blockedSites = [];

// Load blocked sites from storage when the extension is loaded
browser.storage.local.get(["blocked"], function (result) {
    if (result.blocked) {
        blockedSites = result.blocked;
    }
});

// Listen for web requests
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        const url = new URL(details.url);
        const domain = url.hostname;

        // Check if the site is blocked
        if (blockedSites.includes(domain)) {
            return { cancel: true };
        }

        return { cancel: false };
    },
    { urls: ["<all_urls>"] }, // Applies to all URLs
    ["blocking"]
);

// Update the blocked sites list whenever it's changed
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.blocked) {
        blockedSites = changes.blocked.newValue;
    }
});
