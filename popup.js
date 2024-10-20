document.addEventListener('DOMContentLoaded', function () {
    const websiteInput = document.getElementById('website');
    const addButton = document.getElementById('add');
    const blockedSitesList = document.getElementById('blockedSites');

    // Load the list of blocked sites
    function loadBlockedSites() {
        chrome.storage.sync.get(['blocked'], function (result) {
            blockedSitesList.innerHTML = '';
            const blockedSites = result.blocked || [];

            blockedSites.forEach(site => {
                const li = document.createElement('li');
                li.textContent = site;

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', function () {
                    removeSite(site);
                });

                li.appendChild(removeButton);
                blockedSitesList.appendChild(li);
            });
        });
    }

    // Add a website to the block list
    function addSite(site) {
        chrome.storage.sync.get(['blocked'], function (result) {
            const blockedSites = result.blocked || [];
            if (!blockedSites.includes(site)) {
                blockedSites.push(site);
                chrome.storage.sync.set({ blocked: blockedSites }, function () {
                    loadBlockedSites();
                });
            }
        });
    }

    // Remove a website from the block list
    function removeSite(site) {
        chrome.storage.sync.get(['blocked'], function (result) {
            const blockedSites = result.blocked || [];
            const updatedSites = blockedSites.filter(s => s !== site);
            chrome.storage.sync.set({ blocked: updatedSites }, function () {
                loadBlockedSites();
            });
        });
    }

    // Event listener for the add button
    addButton.addEventListener('click', function () {
        const site = websiteInput.value.trim();
        if (site) {
            addSite(site);
            websiteInput.value = '';
        }
    });

    // Load blocked sites when the popup is opened
    loadBlockedSites();
});
