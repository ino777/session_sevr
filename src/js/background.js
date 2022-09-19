import {saveAllTabs} from "./tab.js";

chrome.action.onClicked.addListener(async () => {
    const url = chrome.runtime.getURL("main.html");
    await chrome.tabs.create({url: url});
})

// Set a flag when a tab is created or updated.
chrome.tabs.onCreated.addListener(tabs => {
    chrome.storage.local.set({ "save_required": true });
})

chrome.tabs.onUpdated.addListener(tabs => {
    chrome.storage.local.set({ "save_required": true });
})

// Save the currently open tabs as backup data periodically.
chrome.alarms.create({ delayInMinutes: 1, periodInMinutes: 10 });
chrome.alarms.onAlarm.addListener(e => {
    chrome.storage.local.get(["save_required"], result => {
        if (result["save_required"]) {
            saveAllTabs("tabs_backup")
            chrome.storage.local.set({ "save_required": false });
            chrome.storage.local.set({ "backup_date": Date.now() });
        }
    })
})