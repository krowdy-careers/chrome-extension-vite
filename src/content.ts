const port = chrome.runtime.connect({ name: "service-worker" });
const body = document.querySelector('body')

let currentPage = 0

chrome.runtime.onMessage.addListener(
    function(message, sender, response) {
        if (message.action === "scrap") {
            currentPage++
            const products = scrapping(currentPage)
            port.postMessage({ cmd: "scraped", products });
            response("asdasd")
        }
    }
    
);


port.onMessage.addListener(

    function (message) {

        setTimeout(() => {

            console.log(currentPage)
            currentPage++
            const products = scrapping(currentPage)
            if (products === "END") {
                return "END"
            }


            

            else if (message.cmd === "scrap-next-page") {
                port.postMessage({ cmd: "next-page", products })

            }



        }, 3000)



    }

);


function scrapping(currentPage: number) {
    if (!document.querySelector('.pagination__nav')) {
        return "END"
    }
    const container = body.querySelector(".showcase-grid")
    const cardsList = Array.from(container.querySelectorAll(".showcase-description"))
    const products = cardsList.map((element) => {
        const productName = element.querySelector(".Showcase__name").innerText
        const brand = element.querySelector(".brand").innerText
        const price = element.querySelector(".price").innerText

        return {
            productName, brand, price
        }

    })
    /* const selectedElement = container.querySelectorAll(".price-container")
    const result = Array.from(selectedElement).map((el) => el.firstChild.innerText)
    console.log(result) */

    document.querySelectorAll('.pagination__item.page-number')[currentPage].click();
    return products
}