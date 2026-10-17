// BASE DE DATOS DE PRODUCTOS (20 ÍTEMS CORREGIDOS EN IMÁGENES Y NOMBRES)
const products = [
  { id: 1, name: "Café Americano", category: "calientes", price: 45, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400", desc: "Espresso diluido en agua caliente con un sabor balanceado." },
  { id: 2, name: "Cappuccino Tradicional", category: "calientes", price: 55, img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400", desc: "Espresso, leche vaporizada y abundante espuma de leche." },
  { id: 3, name: "Latte de Vainilla", category: "calientes", price: 60, img: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400", desc: "Espresso suave con leche cremosa y toque de vainilla." },
  { id: 4, name: "Espresso Doble", category: "calientes", price: 40, img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400", desc: "Extracción concentrada de café 100% arábica." },
  { id: 5, name: "Mocha Blanco", category: "calientes", price: 65, img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400", desc: "Espresso con chocolate blanco cremoso y leche al vapor." },
  { id: 6, name: "Cold Brew Artesanal", category: "frias", price: 60, img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400", desc: "Café infusionado en frío durante 18 horas." },
  { id: 7, name: "Iced Caramel Macchiato", category: "frias", price: 68, img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400", desc: "Espresso helado con jarabe de caramelo y leche fría." },
  { id: 8, name: "Frappé de Chocolate", category: "frias", price: 70, img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400", desc: "Bebida batida con hielo, cacao puro y crema batida." },
  { id: 9, name: "Smoothie de Frutos Rojos", category: "frias", price: 65, img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400", desc: "Mezcla natural de fresas, zarzamoras y yogurt." },
  { id: 10, name: "Té Matcha Helado", category: "frias", price: 62, img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400", desc: "Té verde matcha con leche de almendra y hielo." },
  { id: 11, name: "Croissant de Mantequilla", category: "reposteria", price: 38, img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", desc: "Masa hojaldrada dorada y crujiente." },
  { id: 12, name: "Muffin de Arándanos", category: "reposteria", price: 42, img: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400", desc: "Esponjoso panecillo horneado con arándanos frescos." },
  { id: 13, name: "Cheesecake de Frutilla", category: "reposteria", price: 58, img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400", desc: "Pastel de queso cremoso con mermelada artesanal." },
  { id: 14, name: "Brownie de Nuez", category: "reposteria", price: 45, img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400", desc: "Pastel denso de chocolate oscuro y trozos de nuez." },
  { id: 15, name: "Donut Glaseada", category: "reposteria", price: 30, img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400", desc: "Rosquilla horneada glaseada con una fina capa de azúcar." },
  { id: 16, name: "Panini Pavo y Queso", category: "salados", price: 85, img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400", desc: "Pechuga de pavo, queso gouda y aderezo artesanal al grill." },
  { id: 17, name: "Bagel de Salmón", category: "salados", price: 95, img: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400", desc: "Bagel tostado con queso crema, salmón ahumado y alcaparras." },
  { id: 18, name: "Ciabatta Caprese", category: "salados", price: 80, img: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400", desc: "Queso mozzarella fresco, jitomate y pesto de albahaca." },
  { id: 19, name: "Empanada de Jamón y Queso", category: "salados", price: 35, img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400", desc: "Masa crujiente y horneada rellena de fino jamón y queso derretido." },
  { id: 20, name: "Quiche de Espinacas", category: "salados", price: 65, img: "https://images.unsplash.com/photo-1621236378699-8597faf6a176?w=400", desc: "Tarta salada horneada con espinacas y queso ricotta." }
];

// ESTADO GLOBAL DE LA APLICACIÓN Y PERSISTENCIA
let cart = JSON.parse(localStorage.getItem('kaue_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('kaue_user')) || null;
let activeTimerInterval = null;

// ELEMENTOS DEL DOM
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const closeCartModal = document.getElementById('closeCartModal');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

const productModal = document.getElementById('productModal');
const productModalBody = document.getElementById('productModalBody');
const closeProductModal = document.getElementById('closeProductModal');

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const userGreeting = document.getElementById('userGreeting');

// 1. RENDERIZADO DEL MENÚ
function renderProducts(categoryFilter = "todos") {
  productsGrid.innerHTML = "";
  const filtered = categoryFilter === "todos" ? products : products.filter(p => p.category === categoryFilter);

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-price">$${p.price.toFixed(2)} MXN</div>
        <button class="btn-primary full-width" onclick="openProductModal(${p.id})">Ver Detalle</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderProducts(e.target.dataset.category);
  });
});

// 2. MODAL DE PRODUCTO
window.openProductModal = function(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;

  productModalBody.innerHTML = `
    <img src="${p.img}" style="width:100%; height:200px; object-fit:cover; border-radius:8px;">
    <h2 style="margin-top:1rem; color:var(--primary);">${p.name}</h2>
    <p style="color:var(--text-muted); margin:0.5rem 0;">${p.desc}</p>
    <h3 style="color:var(--accent); margin-bottom:1rem;">$${p.price.toFixed(2)} MXN</h3>
    <button class="btn-primary full-width" onclick="addToCart(${p.id})">Agregar al Carrito</button>
  `;
  productModal.classList.remove('hidden');
};

closeProductModal.addEventListener('click', () => productModal.classList.add('hidden'));

// 3. CARRITO CON GUARDADO AUTOMÁTICO (LOCALSTORAGE)
window.addToCart = function(id) {
  const p = products.find(prod => prod.id === id);
  cart.push(p);
  saveCartState();
  updateCartUI();
  productModal.classList.add('hidden');
};

function saveCartState() {
  localStorage.setItem('kaue_cart', JSON.stringify(cart));
}

function updateCartUI() {
  cartCount.textContent = cart.length;
  cartItemsList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const row = document.createElement('div');
    row.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #eee; padding-bottom:4px;";
    row.innerHTML = `
      <span>${item.name} - <strong>$${item.price.toFixed(2)}</strong></span>
      <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; font-size:1.2rem; cursor:pointer;">&times;</button>
    `;
    cartItemsList.appendChild(row);
  });

  cartTotal.textContent = `$${total.toFixed(2)} MXN`;
}

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  saveCartState();
  updateCartUI();
};

cartBtn.addEventListener('click', () => cartModal.classList.remove('hidden'));
closeCartModal.addEventListener('click', () => cartModal.classList.add('hidden'));

// 4. AUTENTICACIÓN Y MANEJO DE SESIÓN
loginBtn.addEventListener('click', () => authModal.classList.remove('hidden'));
closeAuthModal.addEventListener('click', () => authModal.classList.add('hidden'));

tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active'); tabRegister.classList.remove('active');
  loginForm.classList.remove('hidden'); registerForm.classList.add('hidden');
});

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active'); tabLogin.classList.remove('active');
  registerForm.classList.remove('hidden'); loginForm.classList.add('hidden');
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  currentUser = { name: document.getElementById('regName').value, email: document.getElementById('regEmail').value };
  localStorage.setItem('kaue_user', JSON.stringify(currentUser));
  onUserLoggedIn();
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  currentUser = { name: "Cliente Kaué", email: document.getElementById('loginEmail').value };
  localStorage.setItem('kaue_user', JSON.stringify(currentUser));
  onUserLoggedIn();
});

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('kaue_user');
  userGreeting.classList.add('hidden');
  logoutBtn.classList.add('hidden');
  loginBtn.classList.remove('hidden');
});

function checkUserSession() {
  if (currentUser) {
    onUserLoggedIn();
  }
}

function onUserLoggedIn() {
  authModal.classList.add('hidden');
  loginBtn.classList.add('hidden');
  logoutBtn.classList.remove('hidden');
  userGreeting.classList.remove('hidden');
  userGreeting.textContent = `Hola, ${currentUser.name}`;
}

// 5. COMPROBANTE PDF FORMATEADO Y DESCARGA
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }
  if (!currentUser) {
    alert("Por favor inicia sesión para realizar tu pedido.");
    authModal.classList.remove('hidden');
    return;
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.16;
  const total = subtotal;

  document.getElementById('pdfFolio').textContent = "KC-" + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('pdfDate').textContent = new Date().toLocaleString();
  document.getElementById('pdfClientName').textContent = currentUser.name;
  document.getElementById('pdfClientEmail').textContent = currentUser.email;

  const tbody = document.getElementById('pdfTableBody');
  tbody.innerHTML = "";

  cart.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>1</td>
        <td>${item.name}</td>
        <td class="text-right">$${item.price.toFixed(2)}</td>
        <td class="text-right">$${item.price.toFixed(2)}</td>
      </tr>
    `;
  });

  document.getElementById('pdfSubtotal').textContent = `$${(subtotal - tax).toFixed(2)} MXN`;
  document.getElementById('pdfTax').textContent = `$${tax.toFixed(2)} MXN`;
  document.getElementById('pdfTotalAmount').textContent = `$${total.toFixed(2)} MXN`;

  const element = document.getElementById('pdfInvoiceTemplate');
  
  const opt = {
    margin: 10,
    filename: `Ticket_Kaue_Coffee_${Date.now()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    cart = [];
    saveCartState();
    updateCartUI();
    cartModal.classList.add('hidden');
    
    // Guardar inicio de pedido en LocalStorage (15 minutos)
    const orderEndTime = Date.now() + (15 * 60 * 1000);
    localStorage.setItem('kaue_order_endtime', orderEndTime);
    iniciarNotificacionPedido();
  });
});

// 6. CHATBOT FLOTANTE
const chatbotBtn = document.getElementById('chatbotBtn');
const chatbotWindow = document.getElementById('chatbotWindow');
const closeChatbotBtn = document.getElementById('closeChatbotBtn');
const sendChatbotBtn = document.getElementById('sendChatbotBtn');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotMessages = document.getElementById('chatbotMessages');

chatbotBtn.addEventListener('click', () => chatbotWindow.classList.toggle('hidden'));
closeChatbotBtn.addEventListener('click', () => chatbotWindow.classList.add('hidden'));

sendChatbotBtn.addEventListener('click', sendBotMessage);
chatbotInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendBotMessage(); });

function sendBotMessage() {
  const text = chatbotInput.value.trim();
  if (!text) return;

  chatbotMessages.innerHTML += `<div class="message user-message">${text}</div>`;
  chatbotInput.value = "";

  setTimeout(() => {
    let reply = "Lo siento, no entendí bien. ¿Deseas consultar el menú u horarios?";
    const q = text.toLowerCase();
    
    if (q.includes("horario") || q.includes("abren") || q.includes("hora")) {
      reply = "Estamos abiertos de Lunes a Domingo de 7:00 AM a 10:00 PM.";
    } else if (q.includes("menu") || q.includes("producto") || q.includes("cafe")) {
      reply = "Contamos con 20 productos entre cafés calientes, bebidas frías, repostería y bocadillos salados.";
    } else if (q.includes("ubicacion") || q.includes("donde")) {
      reply = "Nos encontramos en la Av. Principal #123, en el Centro Histórico.";
    }

    chatbotMessages.innerHTML += `<div class="message bot-message">${reply}</div>`;
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }, 600);
}

// 7. BURBUJA DE NOTIFICACIÓN DE PEDIDO CON PERSISTENCIA
const notificationBtn = document.getElementById('notificationBtn');
const notificationPanel = document.getElementById('notificationPanel');
const closeNotificationBtn = document.getElementById('closeNotificationBtn');
const notificationBody = document.getElementById('notificationBody');
const notificationBadge = document.getElementById('notificationBadge');

notificationBtn.addEventListener('click', () => notificationPanel.classList.toggle('hidden'));
closeNotificationBtn.addEventListener('click', () => notificationPanel.classList.add('hidden'));

function iniciarNotificacionPedido() {
  const orderEndTime = localStorage.getItem('kaue_order_endtime');
  if (!orderEndTime) {
    notificationBadge.classList.add('hidden');
    notificationBody.innerHTML = `<p class="no-order">No tienes ningún pedido activo en este momento.</p>`;
    return;
  }

  notificationBadge.classList.remove('hidden');

  if (activeTimerInterval) clearInterval(activeTimerInterval);

  function actualizar() {
    const ahora = Date.now();
    const tiempoRestante = Math.floor((orderEndTime - ahora) / 1000);

    if (tiempoRestante > 0) {
      const minutos = Math.floor(tiempoRestante / 60);
      const segundos = tiempoRestante % 60;
      const tiempoFormateado = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;

      notificationBody.innerHTML = `
        <div class="order-status-card">
          <span>☕ <strong>¡Tu pedido está en preparación!</strong></span>
          <div class="timer-box">
            Tiempo estimado: <span>${tiempoFormateado} min</span>
          </div>
          <small style="color:#666;">Te avisaremos cuando tu orden esté lista para recoger en barra.</small>
        </div>
      `;
    } else {
      clearInterval(activeTimerInterval);
      notificationBadge.classList.add('hidden');
      notificationBody.innerHTML = `
        <div class="order-status-card">
          <span style="color: #27ae60;">✅ <strong>¡Tu pedido está listo!</strong></span>
          <p style="margin: 4px 0 0 0;">Puedes pasar a recogerlo en la barra.</p>
        </div>
      `;
    }
  }

  actualizar();
  activeTimerInterval = setInterval(actualizar, 1000);
}

// INICIALIZACIÓN DE LA PÁGINA
renderProducts();
updateCartUI();
checkUserSession();
iniciarNotificacionPedido();