import  Product  from "../interfaces/Product";
import  PopupElements  from "../interfaces/PopupElements";

const elements: PopupElements = {
  scrapeButton: document.getElementById("scrapeButton") as HTMLButtonElement,
  feedback: document.getElementById("feedback") as HTMLElement,
  output: document.getElementById("output") as HTMLElement,
  downloadButton: document.getElementById("downloadButton") as HTMLButtonElement,
  filenameInput: document.getElementById("filenameInput") as HTMLInputElement,
};

elements.scrapeButton.addEventListener("click", async () => {
  elements.feedback.textContent = "Realizando scraping...";
  elements.output.innerHTML = "";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.runtime.sendMessage({ action: "scrapeProducts", tabId: tab.id }, (response) => {
    const data: Product[] = response?.result || [];
    if (data.length === 0) {
      elements.feedback.textContent = "No se encontraron productos.";
      elements.downloadButton.style.display = "none";
    } else {
      elements.feedback.textContent = "Scraping completado.";
      elements.output.innerHTML = data
        .map(
          (product, i) =>
            `<div class="divcardgeneral">
                <p class="pre">Producto scrapeado n°:${i + 1}</p>
                <h2 class="letrab">${product.name}</h2>
                <p class="for">${product.sellerName}</p>
                <div class="divcardsecundary">
                 <p class="price">${product.salePrice}</p>
                 <div class="descuento">
                 <p class="pricedes">${product.salePriceDes}</p>
                 <p class="pricetag">${product.priceTag}</p>
                 </div>
                </div>
               </div>`
        )
        .join("");
      elements.downloadButton.style.display = "inline";
      elements.downloadButton.onclick = () => downloadJSON(data);
    }
  });
});

// Función para descargar el JSON con el nombre ingresado por el usuario
function downloadJSON(data: Product[]) {
  const filename = elements.filenameInput.value.trim() || "testdarli";
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
