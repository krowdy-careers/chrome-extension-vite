chrome.runtime.onConnect.addListener(function (port) {
  console.log(port.name)
  port.onMessage.addListener(function (msg) {
      let { products } = msg
      if (msg.cmd === "scraped") {
          chrome.storage.local.set({ products })
              .then(() => {
                  port.postMessage({ cmd: "scrap-next-page" })
              })
      }
      else if (msg.cmd === "next-page") {
          console.log("next-page")
          chrome.storage.local.get(["products"]).then((result) => {
              console.log(result.products)
              products = [...result.products, ...products]
              chrome.storage.local.set({ products })
                  .then(() => {
                      port.postMessage({ cmd: "scrap-next-page" })
                  })
          });
      }
      if (msg.cmd === "get-products")
          chrome.storage.local.get(["products"]).then((result) => {
              port.postMessage({ cmd: "products", result })
          });
  });
});