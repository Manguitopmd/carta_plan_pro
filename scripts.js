// Inicializar el carrito desde localStorage o vacío
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function loadSection(section) {
    fetch(`${section}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
            document.querySelectorAll('.animate-slide-up, .animate-bounce-in').forEach((el, index) => {
                el.style.animationDelay = `${index * 0.1}s`;
            });
            updateCart(); // Actualizar carrito al cargar una sección
        })
        .catch(error => console.error('Error cargando la sección:', error));
}

function addToCart(item, quantity, comment, price) {
    quantity = parseInt(quantity) || 1;
    price = parseFloat(price) || 0;
    const existingItem = cart.find(i => i.item === item && i.comment === comment);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ item, quantity, comment: comment || '', price });
    }
    saveCart();
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartItems.innerHTML += `
            <div class="flex justify-between items-center border-b py-2">
                <div>
                    <p class="font-semibold">${item.item} (x${item.quantity})</p>
                    <p class="text-sm text-gray-600">${item.comment || 'Sin comentario'}</p>
                </div>
                <div class="flex items-center gap-2">
                    <p class="font-bold">S/ ${itemTotal.toFixed(2)}</p>
                    <button onclick="removeFromCart(${index})" class="text-red-600"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });

    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0) || 0;
    cartTotal.textContent = `S/ ${total.toFixed(2)}`;
    if (cart.length > 0) document.getElementById('cart').classList.remove('hidden');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

function toggleCart() {
    const cart = document.getElementById('cart');
    cart.classList.toggle('hidden');
}

function sendOrder() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    let message = 'Pedido:\n';
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${item.quantity}x ${item.item} - S/ ${itemTotal.toFixed(2)} (${item.comment || 'Sin comentario'})\n`;
    });
    message += `\nTotal: S/ ${total.toFixed(2)}`;
    const whatsappUrl = `https://wa.me/51930288404?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    // Opcional: Limpiar carrito tras enviar pedido
    cart = [];
    saveCart();
    updateCart();
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Funciones para el modal de Menú del Día
function openMenuDiaModal() {
    document.getElementById('menu-dia-modal').classList.remove('hidden');
}

function closeMenuDiaModal() {
    document.getElementById('menu-dia-modal').classList.add('hidden');
}

function addMenuDiaToCart() {
    const entrada = document.getElementById('menu-dia-entrada').value;
    const segundo = document.getElementById('menu-dia-segundo').value;
    const quantity = document.getElementById('menu-dia-quantity').value;
    const comment = document.getElementById('menu-dia-comment').value;
    const item = `Menú del Día (${entrada} + ${segundo})`;
    addToCart(item, quantity, comment, 12.00);
    closeMenuDiaModal();
}

// Iniciar música automáticamente
const audio = document.getElementById('backgroundMusic');
audio.volume = 0.5;
audio.play();

// Cargar carrito al iniciar
updateCart();