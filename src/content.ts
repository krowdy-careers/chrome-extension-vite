//'div.Showcase__content' contenedor del producto
//Showcase__name nombre Showcase__SellerName distribuidor Showcase__salePrice precio

const port_background = chrome.runtime.connect({name: "background"});


console.log('Ejecutando content script plaza vea 3.0')

function delay(time:number) {
    return new Promise(resolve => setTimeout(resolve, time));
}
 
chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
        if (request.cmd === "scrap"){
            const products = scrappingProducts()
            port_background.postMessage({cmd: "finish-scrap", products});
            //sendResponse({products});  
        } 
    }
);

function scrappingProducts(){
    let cards = [...document.querySelectorAll('div.showcase-grid>div> .Showcase__content')]
    
    const products = cards.map(el=>{
        const name = el.querySelector('.Showcase__name')?.textContent
        const sellerName = el.querySelector('.Showcase__SellerName')?.textContent
        const salePrice = el.querySelector('.Showcase__salePrice')?.textContent
        return {name,sellerName,salePrice} 
    })
    console.log(products)
    return products
}

