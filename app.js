// ============ PRODUCTOS ============
// "img" es opcional: si está vacío o la imagen falla, se muestra el emoji del producto.
// Para poner tu propia foto: img: "https://tu-enlace/foto.jpg" (o "img/empanada.jpg" si la subes a tu proyecto).
const U = id => `https://images.unsplash.com/${id}?w=600`;
const products = [
  { id: 1, name: "Café Americano", category: "calientes", price: 45, emoji: "☕", img: U("photo-1514432324607-a09d9b4aefdd"), desc: "Espresso diluido en agua caliente con un sabor balanceado." },
  { id: 2, name: "Cappuccino Tradicional", category: "calientes", price: 55, emoji: "☕", img: U("photo-1572442388796-11668a67e53d"), desc: "Espresso, leche vaporizada y abundante espuma de leche." },
  { id: 3, name: "Latte de Vainilla", category: "calientes", price: 60, emoji: "🥛", img: U("photo-1561882468-9110e03e0f78"), desc: "Espresso suave con leche cremosa y toque de vainilla." },
  { id: 4, name: "Espresso Doble", category: "calientes", price: 40, emoji: "☕", img: U("photo-1510591509098-f4fdc6d0ff04"), desc: "Extracción concentrada de café 100% arábica." },
  { id: 5, name: "Mocha Blanco", category: "calientes", price: 65, emoji: "🍫", img: "", desc: "Espresso con chocolate blanco cremoso y leche al vapor." },
  { id: 6, name: "Cold Brew Artesanal", category: "frias", price: 60, emoji: "🧊", img: "", desc: "Café infusionado en frío durante 18 horas." },
  { id: 7, name: "Iced Caramel Macchiato", category: "frias", price: 68, emoji: "🥤", img: "", desc: "Espresso helado con jarabe de caramelo y leche fría." },
  { id: 8, name: "Frappé de Chocolate", category: "frias", price: 70, emoji: "🍨", img: "", desc: "Bebida batida con hielo, cacao puro y crema batida." },
  { id: 9, name: "Smoothie de Frutos Rojos", category: "frias", price: 65, emoji: "🍓", img: "", desc: "Mezcla natural de fresas, zarzamoras y yogurt." },
  { id: 10, name: "Té Matcha Helado", category: "frias", price: 62, emoji: "🍵", img: "", desc: "Té verde matcha con leche de almendra y hielo." },
  { id: 11, name: "Croissant de Mantequilla", category: "reposteria", price: 38, emoji: "🥐", img: "", desc: "Masa hojaldrada dorada y crujiente." },
  { id: 12, name: "Muffin de Arándanos", category: "reposteria", price: 42, emoji: "🧁", img: "", desc: "Esponjoso panecillo horneado con arándanos frescos." },
  { id: 13, name: "Cheesecake de Frutilla", category: "reposteria", price: 58, emoji: "🍰", img: "", desc: "Pastel de queso cremoso con mermelada artesanal." },
  { id: 14, name: "Brownie de Nuez", category: "reposteria", price: 45, emoji: "🍫", img: "", desc: "Pastel denso de chocolate oscuro y trozos de nuez." },
  { id: 15, name: "Donut Glaseada", category: "reposteria", price: 30, emoji: "🍩", img: "", desc: "Rosquilla horneada glaseada con una fina capa de azúcar." },
  { id: 16, name: "Panini Pavo y Queso", category: "salados", price: 85, emoji: "🥪", img: "", desc: "Pechuga de pavo, queso gouda y aderezo artesanal al grill." },
  { id: 17, name: "Bagel de Salmón", category: "salados", price: 95, emoji: "🥯", img: "", desc: "Bagel tostado con queso crema, salmón ahumado y alcaparras." },
  { id: 18, name: "Ciabatta Caprese", category: "salados", price: 80, emoji: "🍅", img: "", desc: "Queso mozzarella fresco, jitomate y pesto de albahaca." },
  { id: 19, name: "Empanada de Jamón y Queso", category: "salados", price: 35, emoji: "🥟", img: "", desc: "Masa crujiente y horneada rellena de fino jamón y queso derretido." },
  { id: 20, name: "Quiche de Espinacas", category: "salados", price: 65, emoji: "🥧", img: "", desc: "Tarta salada horneada con espinacas y queso ricotta." }
];
const FEATURED_IDS = [2, 7, 11, 17];

// ============ ESTADO ============
// El carrito ahora agrupa por cantidad: [{id, qty}]
let cart = [];
try { cart = JSON.parse(localStorage.getItem('kaue_cart_v2')) || []; } catch (e) { cart = []; }
let currentUser = null;
try { currentUser = JSON.parse(localStorage.getItem('kaue_user')); } catch (e) { currentUser = null; }
let activeTimerInterval = null;

const $ = id => document.getElementById(id);
const money = n => `$${n.toFixed(2)} MXN`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const byId = id => products.find(p => p.id === id);

// ============ 1. TARJETAS Y MENÚ ============
function cardHTML(p) {
  const img = p.img ? `<img src="${p.img}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">` : '';
  return `
    <div class="card-media cat-${p.category}"><span>${p.emoji}</span>${img}</div>
    <div class="product-info">
      <h3>${esc(p.name)}</h3>
      <div class="product-price">${money(p.price)}</div>
      <button class="btn-primary full-width" onclick="openProductModal(${p.id})">Ver detalle</button>
    </div>`;
}

function renderGrid(container, list) {
  container.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = "product-card";
    card.innerHTML = cardHTML(p);
    container.appendChild(card);
  });
}

function renderProducts(cat = "todos") {
  renderGrid($('productsGrid'), cat === "todos" ? products : products.filter(p => p.category === cat));
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    renderProducts(e.currentTarget.dataset.category);
  });
});

// ============ 2. NAVEGACIÓN ENTRE INICIO Y MENÚ ============
function route() {
  const hash = location.hash.replace('#', '') || 'inicio';
  const isMenu = hash === 'menu';
  $('homeView').classList.toggle('hidden', isMenu);
  $('menuView').classList.toggle('hidden', !isMenu);
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === hash));
  if (isMenu) window.scrollTo({ top: 0 });
  else if (hash === 'nosotros') $('nosotros').scrollIntoView();
  else window.scrollTo({ top: 0 });
}
window.addEventListener('hashchange', route);

// ============ 3. MODAL DE PRODUCTO ============
window.openProductModal = function (id) {
  const p = byId(id);
  if (!p) return;
  const img = p.img ? `<img src="${p.img}" alt="${esc(p.name)}" onerror="this.remove()">` : '';
  $('productModalBody').innerHTML = `
    <div class="modal-img cat-${p.category}"><span>${p.emoji}</span>${img}</div>
    <h2>${esc(p.name)}</h2>
    <p>${esc(p.desc)}</p>
    <h3>${money(p.price)}</h3>
    <button class="btn-primary full-width" onclick="addToCart(${p.id})">Agregar al carrito</button>`;
  $('productModal').classList.remove('hidden');
};
$('closeProductModal').addEventListener('click', () => $('productModal').classList.add('hidden'));

// Cerrar modales al hacer clic fuera
document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) m.classList.add('hidden'); }));

// ============ 4. CARRITO ============
window.addToCart = function (id) {
  const line = cart.find(l => l.id === id);
  if (line) line.qty++; else cart.push({ id, qty: 1 });
  saveCartState();
  updateCartUI();
  $('productModal').classList.add('hidden');
};

window.changeQty = function (id, delta) {
  const line = cart.find(l => l.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) cart = cart.filter(l => l.id !== id);
  saveCartState();
  updateCartUI();
};

function saveCartState() { localStorage.setItem('kaue_cart_v2', JSON.stringify(cart)); }

function cartTotals() {
  return cart.reduce((acc, l) => { const p = byId(l.id); if (p) { acc.count += l.qty; acc.total += p.price * l.qty; } return acc; }, { count: 0, total: 0 });
}

function updateCartUI() {
  cart = cart.filter(l => byId(l.id));
  const { count, total } = cartTotals();
  $('cartCount').textContent = count;
  const list = $('cartItemsList');
  list.innerHTML = cart.length ? "" : `<p class="cart-empty">Tu carrito está vacío. Agrega algo del menú ☕</p>`;
  cart.forEach(l => {
    const p = byId(l.id);
    const row = document.createElement('div');
    row.className = "cart-row";
    row.innerHTML = `
      <div class="name">${esc(p.name)}<small>${money(p.price)} c/u</small></div>
      <div class="qty">
        <button onclick="changeQty(${p.id}, -1)" aria-label="Quitar uno">−</button>
        <span>${l.qty}</span>
        <button onclick="changeQty(${p.id}, 1)" aria-label="Agregar uno">+</button>
      </div>
      <strong>${money(p.price * l.qty)}</strong>`;
    list.appendChild(row);
  });
  $('cartTotal').textContent = money(total);
}

$('cartBtn').addEventListener('click', () => $('cartModal').classList.remove('hidden'));
$('closeCartModal').addEventListener('click', () => $('cartModal').classList.add('hidden'));

// ============ 5. SESIÓN ============
$('loginBtn').addEventListener('click', () => $('authModal').classList.remove('hidden'));
$('closeAuthModal').addEventListener('click', () => $('authModal').classList.add('hidden'));

$('tabLogin').addEventListener('click', () => {
  $('tabLogin').classList.add('active'); $('tabRegister').classList.remove('active');
  $('loginForm').classList.remove('hidden'); $('registerForm').classList.add('hidden');
});
$('tabRegister').addEventListener('click', () => {
  $('tabRegister').classList.add('active'); $('tabLogin').classList.remove('active');
  $('registerForm').classList.remove('hidden'); $('loginForm').classList.add('hidden');
});

$('registerForm').addEventListener('submit', e => {
  e.preventDefault();
  currentUser = { name: $('regName').value.trim(), email: $('regEmail').value.trim() };
  localStorage.setItem('kaue_user', JSON.stringify(currentUser));
  onUserLoggedIn();
});
$('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  currentUser = { name: "Cliente Kaué", email: $('loginEmail').value.trim() };
  localStorage.setItem('kaue_user', JSON.stringify(currentUser));
  onUserLoggedIn();
});
$('logoutBtn').addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('kaue_user');
  $('userGreeting').classList.add('hidden');
  $('logoutBtn').classList.add('hidden');
  $('loginBtn').classList.remove('hidden');
});

function onUserLoggedIn() {
  $('authModal').classList.add('hidden');
  $('loginBtn').classList.add('hidden');
  $('logoutBtn').classList.remove('hidden');
  $('userGreeting').classList.remove('hidden');
  $('userGreeting').textContent = `Hola, ${currentUser.name}`;
}

// ============ 6. TICKET PDF ============
$('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) { alert("El carrito está vacío"); return; }
  if (!currentUser) {
    alert("Por favor inicia sesión para realizar tu pedido.");
    $('authModal').classList.remove('hidden');
    return;
  }

  // Los precios del menú ya incluyen IVA: se desglosa del total.
  const { total } = cartTotals();
  const tax = total - total / 1.16;

  $('pdfFolio').textContent = "KC-" + Math.floor(100000 + Math.random() * 900000);
  $('pdfDate').textContent = new Date().toLocaleString('es-MX');
  $('pdfClientName').textContent = currentUser.name;
  $('pdfClientEmail').textContent = currentUser.email;

  $('pdfTableBody').innerHTML = cart.map(l => {
    const p = byId(l.id);
    return `<tr><td>${l.qty}</td><td>${esc(p.name)}</td><td class="text-right">$${p.price.toFixed(2)}</td><td class="text-right">$${(p.price * l.qty).toFixed(2)}</td></tr>`;
  }).join("");

  $('pdfSubtotal').textContent = money(total - tax);
  $('pdfTax').textContent = money(tax);
  $('pdfTotalAmount').textContent = money(total);

  const opt = {
    margin: 10,
    filename: `Ticket_Kaue_Coffee_${Date.now()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }
  };

  html2pdf().set(opt).from($('pdfInvoiceTemplate')).save().then(() => {
    cart = [];
    saveCartState();
    updateCartUI();
    $('cartModal').classList.add('hidden');
    localStorage.setItem('kaue_order_endtime', Date.now() + 15 * 60 * 1000);
    iniciarNotificacionPedido();
  });
});

// ============ 7. CHATBOT ============
$('chatbotBtn').addEventListener('click', () => $('chatbotWindow').classList.toggle('hidden'));
$('closeChatbotBtn').addEventListener('click', () => $('chatbotWindow').classList.add('hidden'));
$('sendChatbotBtn').addEventListener('click', () => sendBotMessage($('chatbotInput').value));
$('chatbotInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendBotMessage($('chatbotInput').value); });
$('chatbotChips').addEventListener('click', e => { if (e.target.dataset.q) sendBotMessage(e.target.dataset.q); });

const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const has = (q, words) => words.some(w => q.includes(w));
const pick = list => list[Math.floor(Math.random() * list.length)];
const CAT_NAMES = { calientes: "cafés calientes", frias: "bebidas frías", reposteria: "repostería", salados: "bocadillos salados" };

function botReply(text) {
  const q = norm(text);

  // Buscar un producto por nombre
  const found = products.find(p => norm(p.name).split(' ').filter(w => w.length > 4).some(w => q.includes(w)));
  if (found && !has(q, ['recomien', 'sugier'])) return `${found.name}: ${found.desc} Cuesta ${money(found.price)}. Puedes agregarlo desde el menú.`;

  if (has(q, ['hola', 'buenas', 'buenos dias', 'buenas tardes'])) return "¡Hola! ☕ ¿Quieres ver horarios, el menú o que te recomiende algo?";
  if (has(q, ['horario', 'abren', 'abierto', 'cierran', 'hora']) ) return "Abrimos de lunes a domingo, de 7:00 a 22:00.";
  if (has(q, ['ubicacion', 'donde', 'direccion', 'llegar'])) return "Estamos en Av. Principal #123, Centro Histórico.";
  if (has(q, ['telefono', 'llamar', 'contacto', 'numero'])) return "Puedes llamarnos al (222) 123-4567.";
  if (has(q, ['pago', 'pagar', 'tarjeta', 'efectivo'])) return "Tu pedido se confirma en línea y el pago se realiza en barra al recoger, con el ticket PDF.";
  if (has(q, ['como pido', 'como pedir', 'pedido', 'ordenar', 'comprar', 'carrito'])) return "1) Entra al Menú y agrega productos.\n2) Inicia sesión y confirma tu pedido en el carrito.\n3) Se descarga tu ticket y la campana 🔔 te muestra el tiempo restante.";
  if (has(q, ['tiempo', 'tarda', 'cuanto demora', 'listo'])) return "Un pedido tarda unos 15 minutos. Puedes ver el cronómetro en la campana 🔔.";
  if (has(q, ['barato', 'economico', 'precio bajo'])) {
    const cheap = [...products].sort((a, b) => a.price - b.price).slice(0, 3);
    return "Lo más económico: " + cheap.map(p => `${p.name} (${money(p.price)})`).join(", ") + ".";
  }
  if (has(q, ['recomien', 'sugier', 'antoj', 'que me'])) {
    let cat = null;
    if (has(q, ['frio', 'frias', 'helado'])) cat = 'frias';
    else if (has(q, ['postre', 'dulce', 'pan', 'reposteria'])) cat = 'reposteria';
    else if (has(q, ['salado', 'comer', 'hambre', 'sandwich'])) cat = 'salados';
    else if (has(q, ['caliente', 'cafe'])) cat = 'calientes';
    const p = pick(cat ? products.filter(x => x.category === cat) : products);
    return `Te recomiendo ${p.name} ${p.emoji}: ${p.desc} (${money(p.price)})`;
  }
  if (has(q, ['menu', 'producto', 'carta', 'que tienen', 'venden'])) return "Tenemos 20 productos: " + Object.values(CAT_NAMES).join(", ") + ". Entra a la sección Menú para verlos todos.";
  if (has(q, ['gracias'])) return "¡De nada! Aquí estoy si necesitas algo más ☕";
  return "No estoy seguro de haber entendido 😅. Prueba con: horarios, menú, ubicación, cómo pedir o \"recomiéndame algo\".";
}

function sendBotMessage(raw) {
  const text = raw.trim();
  if (!text) return;
  const box = $('chatbotMessages');
  box.insertAdjacentHTML('beforeend', `<div class="message user-message">${esc(text)}</div>`);
  $('chatbotInput').value = "";
  box.scrollTop = box.scrollHeight;
  setTimeout(() => {
    box.insertAdjacentHTML('beforeend', `<div class="message bot-message">${esc(botReply(text))}</div>`);
    box.scrollTop = box.scrollHeight;
  }, 450);
}

// ============ 8. NOTIFICACIÓN DE PEDIDO ============
$('notificationBtn').addEventListener('click', () => $('notificationPanel').classList.toggle('hidden'));
$('closeNotificationBtn').addEventListener('click', () => $('notificationPanel').classList.add('hidden'));

function iniciarNotificacionPedido() {
  const orderEndTime = Number(localStorage.getItem('kaue_order_endtime'));
  if (activeTimerInterval) clearInterval(activeTimerInterval);
  if (!orderEndTime) {
    $('notificationBadge').classList.add('hidden');
    $('notificationBody').innerHTML = `<p class="no-order">No tienes ningún pedido activo en este momento.</p>`;
    return;
  }
  $('notificationBadge').classList.remove('hidden');

  function actualizar() {
    const restante = Math.floor((orderEndTime - Date.now()) / 1000);
    if (restante > 0) {
      const m = Math.floor(restante / 60), s = restante % 60;
      $('notificationBody').innerHTML = `
        <div class="order-status-card">
          <span>☕ <strong>¡Tu pedido está en preparación!</strong></span>
          <div class="timer-box">Tiempo estimado: <span>${m}:${s < 10 ? '0' : ''}${s} min</span></div>
          <small style="color:#666;">Te avisaremos cuando tu orden esté lista para recoger en barra.</small>
        </div>`;
    } else {
      clearInterval(activeTimerInterval);
      $('notificationBadge').classList.add('hidden');
      $('notificationBody').innerHTML = `
        <div class="order-status-card">
          <span style="color:#27ae60;">✅ <strong>¡Tu pedido está listo!</strong></span>
          <p>Puedes pasar a recogerlo en la barra.</p>
        </div>`;
    }
  }
  actualizar();
  activeTimerInterval = setInterval(actualizar, 1000);
}

// ============ INICIO ============
renderProducts();
renderGrid($('featuredGrid'), FEATURED_IDS.map(byId));
updateCartUI();
if (currentUser) onUserLoggedIn();
iniciarNotificacionPedido();
route();