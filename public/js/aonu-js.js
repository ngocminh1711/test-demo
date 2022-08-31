
let original = window.origin;


function addToCart(idProduct) {
    // console.log(document.cookie);
    $.ajax({
        url: original  + "/add-to-cart",
        method: 'POST',
        headers: {
          cookie: document.cookie
        },
        data: {
            idProduct: idProduct
        },
        success: (res) => {
          $('#total-product-cart').html(res)
        }
    })
}