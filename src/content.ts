import { delay } from "./functions/utils";
import Product from "../interfaces/Product";
import Message from "../interfaces/Message";

console.log("Este es un script de contenido");

delay(4000).then(() => {
  console.log("Este es un script de contenido 2 segundos");
});

async function scrapeProducts(): Promise<Product[]> {
  await delay(200);

  const cards = Array.from(
    document.querySelectorAll("div.showcase-grid>div> .Showcase__content")
  );

  const products: Product[] = cards.map((el) => {
    const name =
      el.querySelector(".Showcase__name")?.textContent?.trim() ||
      "Nombre no encontrado";
    const sellerName =
      el.querySelector(".Showcase__SellerName")?.textContent?.trim() ||
      "Vendedor no encontrado";
    const salePrice =
      el.querySelector(".Showcase__salePrice")?.textContent?.trim() ||
      "Precio no encontrado";
    const salePriceDes =
      el.querySelector(".Showcase__ohPrice")?.textContent?.trim() || "";
    const priceTag =
      el
        .querySelector(
          "#undefined-27 > div > div > div > div.showcase-description > div.Showcase__details > div.Showcase__details__text > div.Showcase__priceBox > div > div > div.Showcase__priceTag.Showcase__priceTag--ohPrice > span"
        )
        ?.textContent?.trim() || "-0%";

    return { name, sellerName, salePrice, priceTag, salePriceDes };
  });

  return products;
}

// Escuchar el mensaje de background.js y responder con los datos
chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    if (message.action === "scrapeProducts") {
      scrapeProducts().then((products) => sendResponse({ result: products }));
      return true; 
    }
  }
);
