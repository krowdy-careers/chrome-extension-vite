chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension instalada");
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "scrapeProducts" && message.tabId) {
      chrome.scripting.executeScript(
        {
          target: { tabId: message.tabId },
          files: ["content.js"], // Ejecuta content.js en la pestaña
        },
        (results) => {
          sendResponse(results?.[0]?.result || []); // Envía el resultado a popup.js
        }
      );
      return true; 
    }
  });
  