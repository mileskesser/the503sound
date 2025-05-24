// Flipbook logic
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pages = document.querySelectorAll('.flipbook .page');

// Cart logic using localStorage, unified key name
const STORAGE_KEY = 'magazineCart';

function getCart() {
    const cart = localStorage.getItem(STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

// Make this global so inline onclick can access it
window.addToCart = function(issue) {
    let cart = getCart();
    if (!cart.includes(issue)) {
        cart.push(issue);
        saveCart(cart);
        alert(issue + ' added to cart!');
    } else {
        alert(issue + ' is already in your cart.');
    }
}

// Cart page rendering
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    const cart = getCart();
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<li>No items in cart.</li>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => '<li>' + item + ' Issue Magazine</li>').join('');
    }
}

function clearCart() {
    localStorage.removeItem(STORAGE_KEY);
    renderCart();
}

document.getElementById('clear-cart')?.addEventListener('click', () => {
    if(confirm('Are you sure you want to clear the cart?')) {
        clearCart();
    }
});

renderCart();

// Flipbook magazine logic for each magazine container
document.querySelectorAll('.magazine').forEach(magazine => {
  const pages = [...magazine.querySelectorAll('.page')];
  let open = false;
  let currentPairIndex = 1;
  const offset = +magazine.dataset.offset;

  const getPage = (index) => pages.find(p => +p.dataset.index === index);
  const showPages = (visibleIndices) => {
    pages.forEach(p => {
      if (visibleIndices.includes(+p.dataset.index)) {
        p.classList.add('visible');
        p.style.visibility = 'visible';
      } else {
        p.classList.remove('visible');
        p.style.visibility = 'hidden';
      }
    });
  };

  const openMagazine = () => {
    if (open) return;
    open = true;
    const cover = getPage(offset);
    cover.classList.add('flipped');
    cover.classList.remove('visible');
    showPages([offset + 2, offset + 3]);
  };

  const closeMagazine = () => {
    if (!open) return;
    open = false;
    const cover = getPage(offset);
    cover.classList.remove('flipped');
    showPages([offset]);
    currentPairIndex = 1;
  };

  const turnPage = (next = true) => {
    if (!open) return;
    const maxPair = (pages.length - 1) / 2;
    if (next) {
      if (currentPairIndex < maxPair) {
        currentPairIndex++;
        showPages([
          offset + 2 * currentPairIndex,
          offset + 2 * currentPairIndex + 1
        ]);
      }
    } else {
      if (currentPairIndex > 1) {
        currentPairIndex--;
        showPages([
          offset + 2 * currentPairIndex,
          offset + 2 * currentPairIndex + 1
        ]);
      } else {
        closeMagazine();
      }
    }
  };

  pages.forEach(page => {
    page.addEventListener('click', () => {
      const index = +page.dataset.index;
      if (!open && index === offset) {
        openMagazine();
      } else if (open) {
        if (index % 2 === 0) turnPage(false);
        else turnPage(true);
      }
    });

    page.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        page.click();
      }
    });
  });

  showPages([offset]);
});
