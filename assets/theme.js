document.addEventListener("click", async (e) => {

  // quantity buttons
  if(e.target.classList.contains("qty-btn")){

    const key = e.target.dataset.key
    const input = e.target.parentElement.querySelector("input")

    let qty = parseInt(input.value)

    if(e.target.classList.contains("plus")) qty++
    if(e.target.classList.contains("minus")) qty--

    await fetch('/cart/change.js',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        id: key,
        quantity: qty
      })
    })

    location.reload()
  }


  // remove item
  if(e.target.classList.contains("side-cart-item__remove")){

    const key = e.target.dataset.key

    await fetch('/cart/change.js',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        id: key,
        quantity: 0
      })
    })

    location.reload()
  }

})