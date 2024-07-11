const P1_DISCOUNT_RATIO = 0.1;
const P2_DISCOUNT_RATIO = 0.15;
const P3_DISCOUNT_RATIO = 0.2;
const BULK_DISCOUNT_RATIO = 0.25;

const PRODUCT_DISCOUNT_QUANTITY = 10;
const BULK_DISCOUNT_QUANTITY = 30;

// 상수로
// let products = [
//   { id: 'p1', name: '상품1', price: 10000 },
//   { id: 'p2', name: '상품2', price: 20000 },
//   { id: 'p3', name: '상품3', price: 30000 },
// ];

//함수마다 주석 달았음 좋겠음!

function main() {
  let products = [
    { id: 'p1', name: '상품1', price: 10000 },
    { id: 'p2', name: '상품2', price: 20000 },
    { id: 'p3', name: '상품3', price: 30000 },
  ];

  const addHTMLToParent = (html, parent) => {
    if ((!parent) instanceof Node) throw Error('parent is not Node');

    const childFragment = document.createRange().createContextualFragment(html);
    parent.appendChild(childFragment);
  };

  const $app = document.getElementById('app');
  const rootHTML = `
      <div class="bg-gray-100 p-8">
        <div
          class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"
        >
          <h1 class="text-2xl font-bold mb-4">장바구니</h1>
          <div id="cart-items"></div>
          <div id="cart-total" class="text-xl font-bold my-4"></div>
          <select
            id="product-select"
            class="border rounded p-2 mr-2"
          ></select>
          <button
            id="add-to-cart"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            추가
          </button>
        </div>
      </div>
  `;
  addHTMLToParent(rootHTML, $app);

  const cartSelectElement = document.getElementById('product-select');
  products.forEach((product) => {
    const selectOptionHTML = `
    <option value="${product.id}">${product.name + ' - ' + product.price + '원'}</option>
    `;

    addHTMLToParent(selectOptionHTML, cartSelectElement);
  });

  const getItemQuantity = (element) => {
    return parseInt(element.querySelector('span').textContent.split('x ')[1]);
  };

  function updateCart() {
    let cartNoDiscountPrice = 0;
    let cartTotalPrice = 0;
    let cartTotalQuantity = 0;

    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceElement = document.getElementById('cart-total');
    const cartItemsElements = cartItemsContainer.children;

    for (let m = 0; m < cartItemsElements.length; m++) {
      let product;
      for (let n = 0; n < products.length; n++) {
        if (products[n].id === cartItemsElements[m].id) {
          product = products[n];
          break;
        }
      }

      let productQuantity = getItemQuantity(cartItemsElements[m]);

      let productTotalPrice = product.price * productQuantity;
      let discount = 0;

      cartTotalQuantity += productQuantity;
      cartNoDiscountPrice += productTotalPrice;

      if (productQuantity >= PRODUCT_DISCOUNT_QUANTITY) {
        if (product.id === 'p1') discount = P1_DISCOUNT_RATIO;
        if (product.id === 'p2') discount = P2_DISCOUNT_RATIO;
        if (product.id === 'p3') discount = P3_DISCOUNT_RATIO;
      }
      cartTotalPrice += productTotalPrice * (1 - discount);
    }

    let discountRatio = 0;

    if (cartTotalQuantity >= BULK_DISCOUNT_QUANTITY) {
      let bulkDiscount = cartTotalPrice * BULK_DISCOUNT_RATIO;
      let individualDiscount = cartNoDiscountPrice - cartTotalPrice;

      if (bulkDiscount > individualDiscount) {
        cartTotalPrice = cartNoDiscountPrice * (1 - BULK_DISCOUNT_RATIO);
        discountRatio = BULK_DISCOUNT_RATIO;
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
      const discountHTML = `
          <span class="text-green-500 ml-2'">
          ${'(' + (discountRatio * 100).toFixed(1) + '% 할인 적용)'}
          </span>
      `;

      addHTMLToParent(discountHTML, cartTotalPriceElement);
    }
  }

  const cartAddItemBtn = document.getElementById('add-to-cart');
  cartAddItemBtn.onclick = function () {
    let cartSelectValue = cartSelectElement.value;
    let cartItem;

    for (var k = 0; k < products.length; k++) {
      if (products[k].id === cartSelectValue) {
        cartItem = products[k];
        break;
      }
    }

    if (cartItem) {
      const cartItemElement = document.getElementById(cartItem.id);
      if (cartItemElement) {
        let cartItemQuantity = getItemQuantity(cartItemElement) + 1;

        cartItemElement.querySelector('span').textContent =
          cartItem.name + ' - ' + cartItem.price + '원 x ' + cartItemQuantity;
      } else {
        const cartItemHTML = `
        <div id="${cartItem.id}" class="flex justify-between items-center mb-2">
      <span>${cartItem.name + ' - ' + cartItem.price + '원 x 1'}</span>
      <div>
        <button
          class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id="${cartItem.id}"
          data-change="-1"
        >
          -
        </button>
        <button
          class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id="${cartItem.id}"
          data-change="1"
        >
          +
        </button>
        <button
          class="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id="${cartItem.id}"
        >
          삭제
        </button>
      </div>
    </div>
       `;

        addHTMLToParent(cartItemHTML, cartItemsContainer);
      }
      updateCart();
    }
  };

  const cartItemsContainer = document.getElementById('cart-items');
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
        let quantity = getItemQuantity(cartItemElement) + change;

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
