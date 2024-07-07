function main() {
  // var p = [
  //   {id: 'p1', n: '상품1', p: 10000 },
  //   {id: 'p2', n: '상품2', p: 20000 },
  //   {id: 'p3', n: '상품3', p: 30000 }
  // ];

  let products = [
    { id: 'p1', name: '상품1', price: 10000 },
    { id: 'p2', name: '상품2', price: 20000 },
    { id: 'p3', name: '상품3', price: 30000 },
  ];

  // var a = document.getElementById('app'); // rootContainer
  // var w = document.createElement('div'); // cartWrapper
  // var b = document.createElement('div'); // cartContainer
  // var h = document.createElement('h1'); // cartTitleElement
  // var ct = document.createElement('div'); // cartItemsContainer
  // var tt = document.createElement('div'); // cartTotalPriceElement
  // var s = document.createElement('select'); // cartSelectElement
  // var ab = document.createElement('button'); // cartAddItemBtn

  const rootContainer = document.getElementById('app');
  const cartWrapper = document.createElement('div');
  cartWrapper.className = 'bg-gray-100 p-8';

  const cartContainer = document.createElement('div');
  cartContainer.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  const cartTitleElement = document.createElement('h1');
  cartTitleElement.className = 'text-2xl font-bold mb-4';
  cartTitleElement.textContent = '장바구니';

  const cartItemsContainer = document.createElement('div');
  cartItemsContainer.id = 'cart-items';

  const cartTotalPriceElement = document.createElement('div');
  cartTotalPriceElement.id = 'cart-total';
  cartTotalPriceElement.className = 'text-xl font-bold my-4';

  const cartSelectElement = document.createElement('select');
  cartSelectElement.id = 'product-select';
  cartSelectElement.className = 'border rounded p-2 mr-2';
  for (let j = 0; j < products.length; j++) {
    // const o = document.createElement('option'); //option
    const option = document.createElement('option');
    option.value = products[j].id;
    option.textContent = products[j].name + ' - ' + products[j].price + '원';
    cartSelectElement.appendChild(option);
  }

  const cartAddItemBtn = document.createElement('button');
  cartAddItemBtn.id = 'add-to-cart';
  cartAddItemBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  cartAddItemBtn.textContent = '추가';

  cartContainer.appendChild(cartTitleElement);
  cartContainer.appendChild(cartItemsContainer);
  cartContainer.appendChild(cartTotalPriceElement);
  cartContainer.appendChild(cartSelectElement);
  cartContainer.appendChild(cartAddItemBtn);

  cartWrapper.appendChild(cartContainer);
  rootContainer.appendChild(cartWrapper);

  // uc
  function updateCart() {
    // var tb = 0; // cartNoDiscountPrice
    // var t = 0; // cartTotalPrice
    // var tq = 0; // cartTotalQuantity
    // var items = cartItemsContainer.children; // cartItemsElements

    let cartNoDiscountPrice = 0;
    let cartTotalPrice = 0;
    let cartTotalQuantity = 0;

    const cartItemsElements = cartItemsContainer.children;

    for (let m = 0; m < cartItemsElements.length; m++) {
      // var item; //product
      let product;
      for (let n = 0; n < products.length; n++) {
        if (products[n].id === cartItemsElements[m].id) {
          product = products[n];
          break;
        }
      }

      // var quantity // productQuantity
      let productQuantity = parseInt(
        cartItemsElements[m].querySelector('span').textContent.split('x ')[1]
      );

      // var itemTotal // productTotalPrice
      let productTotalPrice = product.price * productQuantity;
      let discount = 0;

      cartTotalQuantity += productQuantity;
      cartNoDiscountPrice += productTotalPrice;

      if (productQuantity >= 10) {
        if (product.id === 'p1') discount = 0.1;
        else if (product.id === 'p2') discount = 0.15;
        else if (product.id === 'p3') discount = 0.2;
      }
      cartTotalPrice += productTotalPrice * (1 - discount);
    }

    // var dr // discountRatio
    let discountRatio = 0;
    if (cartTotalQuantity >= 30) {
      let bulkDiscount = cartTotalPrice * 0.25;
      let individualDiscount = cartNoDiscountPrice - cartTotalPrice;

      if (bulkDiscount > individualDiscount) {
        cartTotalPrice = cartNoDiscountPrice * 0.75;
        discountRatio = 0.25;
      } else {
        discountRatio =
          (cartNoDiscountPrice - cartTotalPrice) / cartNoDiscountPrice;
      }
    } else {
      discountRatio =
        (cartNoDiscountPrice - cartTotalPrice) / cartNoDiscountPrice;
    }

    cartTotalPriceElement.textContent =
      '총액: ' + Math.round(cartTotalPrice) + '원';
    if (discountRatio > 0) {
      const discountElement = document.createElement('span');
      discountElement.className = 'text-green-500 ml-2';
      discountElement.textContent =
        '(' + (discountRatio * 100).toFixed(1) + '% 할인 적용)';
      cartTotalPriceElement.appendChild(discountElement);
    }
  }

  cartAddItemBtn.onclick = function () {
    // var v = cartSelectElement.value; // cartSelectValue
    let cartSelectValue = cartSelectElement.value;
    // var i; // cartItem
    let cartItem;
    for (var k = 0; k < products.length; k++) {
      if (products[k].id === cartSelectValue) {
        cartItem = products[k];
        break;
      }
    }
    if (cartItem) {
      // var e = document.getElementById(product.id); // cartItemElement
      const cartItemElement = document.getElementById(cartItem.id);
      if (cartItemElement) {
        // var q =parseInt(cartItemElement.querySelector('span').textContent.split('x ')[1]) + 1; // productQuantity
        let cartItemQuantity =
          parseInt(
            cartItemElement.querySelector('span').textContent.split('x ')[1]
          ) + 1;

        cartItemElement.querySelector('span').textContent =
          cartItem.name + ' - ' + cartItem.price + '원 x ' + cartItemQuantity;
      } else {
        // var d = document.createElement('div'); // cartItemElement
        // var sp = document.createElement('span'); // cartItemSpan
        // var bd = document.createElement('div'); // cartItemBtns
        // var mb = document.createElement('button'); //cartItemMinusBtn
        // var pb = document.createElement('button'); // cartItemPlusBtn
        // var rb = document.createElement('button'); // cartItemRemoveBtn

        const cartItemElement = document.createElement('div');
        cartItemElement.id = cartItem.id;
        cartItemElement.className = 'flex justify-between items-center mb-2';

        const cartItemSpan = document.createElement('span');
        cartItemSpan.textContent =
          cartItem.name + ' - ' + cartItem.price + '원 x 1';

        const cartItemBtns = document.createElement('div');

        const cartItemMinusBtn = document.createElement('button');
        cartItemMinusBtn.className =
          'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        cartItemMinusBtn.textContent = '-';
        cartItemMinusBtn.dataset.productId = cartItem.id;
        cartItemMinusBtn.dataset.change = '-1';

        const cartItemPlusBtn = document.createElement('button');
        cartItemPlusBtn.className =
          'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        cartItemPlusBtn.textContent = '+';
        cartItemPlusBtn.dataset.productId = cartItem.id;
        cartItemPlusBtn.dataset.change = '1';

        const cartItemRemoveBtn = document.createElement('button');
        cartItemRemoveBtn.className =
          'remove-item bg-red-500 text-white px-2 py-1 rounded';
        cartItemRemoveBtn.textContent = '삭제';
        cartItemRemoveBtn.dataset.productId = cartItem.id;

        cartItemBtns.appendChild(cartItemMinusBtn);
        cartItemBtns.appendChild(cartItemPlusBtn);
        cartItemBtns.appendChild(cartItemRemoveBtn);

        cartItemElement.appendChild(cartItemSpan);
        cartItemElement.appendChild(cartItemBtns);

        cartItemsContainer.appendChild(cartItemElement);
      }
      updateCart();
    }
  };

  cartItemsContainer.onclick = function (event) {
    let target = event.target;
    if (
      target.classList.contains('quantity-change') ||
      target.classList.contains('remove-item')
    ) {
      let productId = target.dataset.productId;
      const cartItemElement = document.getElementById(productId);
      if (target.classList.contains('quantity-change')) {
        let change = parseInt(target.dataset.change);
        let quantity =
          parseInt(
            cartItemElement.querySelector('span').textContent.split('x ')[1]
          ) + change;
        if (quantity > 0) {
          cartItemElement.querySelector('span').textContent =
            cartItemElement.querySelector('span').textContent.split('x ')[0] +
            'x ' +
            quantity;
        } else {
          cartItemElement.remove();
        }
      } else if (target.classList.contains('remove-item')) {
        cartItemElement.remove();
      }
      updateCart();
    }
  };
}

main();
