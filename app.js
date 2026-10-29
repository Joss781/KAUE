// ============ PRODUCTOS ============
// Cada producto lleva su foto en "img". Si una foto no carga, se muestra un icono de taza.
// Para usar tus propias fotos: sube las imágenes a una carpeta img/ y escribe img: "img/latte.jpg".
const U = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&h=420&q=80`;
const products = [
  { id: 1, name: "Café Americano", category: "calientes", price: 45, img: U("photo-1514432324607-a09d9b4aefdd"), desc: "Espresso largo con agua caliente, de sabor limpio y balanceado." },
  { id: 2, name: "Cappuccino Tradicional", category: "calientes", price: 55, img: U("photo-1572442388796-11668a67e53d"), desc: "Espresso, leche vaporizada y una capa generosa de espuma." },
  { id: 3, name: "Latte de Vainilla", category: "calientes", price: 60, img: U("photo-1561882468-9110e03e0f78"), desc: "Espresso suave con leche cremosa y un toque de vainilla." },
  { id: 4, name: "Espresso Doble", category: "calientes", price: 40, img: U("photo-1510591509098-f4fdc6d0ff04"), desc: "Dos tiros de café mexicano de especialidad, intenso y aromático." },
  { id: 5, name: "Mocha Blanco", category: "calientes", price: 65, img: U("photo-1541167760496-1628856ab772"), desc: "Espresso con chocolate blanco cremoso y leche al vapor." },
  { id: 6, name: "Cold Brew Artesanal", category: "frias", price: 60, img: U("photo-1517701604599-bb29b565090c"), desc: "Café infusionado en frío durante 18 horas, suave y sin amargor." },
  { id: 7, name: "Iced Caramel Macchiato", category: "frias", price: 68, img: U("photo-1461023058943-07fcbe16d735"), desc: "Espresso helado con jarabe de caramelo y leche fría." },
  { id: 8, name: "Frappé de Chocolate", category: "frias", price: 70, img: U("photo-1572490122747-3968b75cc699"), desc: "Bebida batida con hielo, cacao y crema batida." },
  { id: 9, name: "Smoothie de Frutos Rojos", category: "frias", price: 65, img: U("photo-1553530666-ba11a7da3888"), desc: "Mezcla natural de fresa, zarzamora y yogurt." },
  { id: 10, name: "Té Matcha Helado", category: "frias", price: 62, img: U("photo-1536256263959-770b48d82b0a"), desc: "Té verde matcha con leche de almendra y hielo." },
  { id: 11, name: "Croissant de Mantequilla", category: "reposteria", price: 38, img: U("photo-1555507036-ab1f4038808a"), desc: "Masa hojaldrada dorada y crujiente, horneada cada mañana." },
  { id: 12, name: "Muffin de Arándanos", category: "reposteria", price: 42, img: U("photo-1607958996333-41aef7caefaa"), desc: "Esponjoso panecillo horneado con arándanos." },
  { id: 13, name: "Cheesecake de Fresa", category: "reposteria", price: 58, img: U("photo-1533134242443-d4fd215305ad"), desc: "Pastel de queso cremoso con mermelada artesanal de fresa." },
  { id: 14, name: "Brownie de Nuez", category: "reposteria", price: 45, img: U("photo-1606313564200-e75d5e30476c"), desc: "Pastel denso de chocolate oscuro con trozos de nuez." },
  { id: 15, name: "Dona Glaseada", category: "reposteria", price: 30, img: U("photo-1551024709-8f23befc6f87"), desc: "Dona suave cubierta con una fina capa de glaseado." },
  { id: 16, name: "Panini de Pavo y Queso", category: "salados", price: 85, img: U("photo-1528735602780-2552fd46c7af"), desc: "Pechuga de pavo, queso gouda y aderezo artesanal, al grill." },
  { id: 17, name: "Bagel de Salmón", category: "salados", price: 95, img: U("photo-1510693206972-df098062cb71"), desc: "Bagel tostado con queso crema, salmón ahumado y alcaparras." },
  { id: 18, name: "Sándwich Caprese", category: "salados", price: 80, img: U("photo-1509722747041-616f39b57569"), desc: "Pan ciabatta con mozzarella fresca, jitomate y pesto de albahaca." }
];

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
window.imgFail = img => { img.parentNode.classList.add('no-img'); img.remove(); };

// ============ 1. TARJETAS Y MENÚ ============
function cardHTML(p) {
  const img = p.img ? `<img src="${p.img}" alt="${esc(p.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="imgFail(this)">` : '';
  return `
    <div class="card-media cat-${p.category}">${img}</div>
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
let pedidosTimer = null;
function route() {
  let hash = location.hash.replace('#', '') || 'inicio';
  if (hash === 'pedidos' && !(currentUser && currentUser.role === 'empleado')) hash = 'inicio';
  $('homeView').classList.toggle('hidden', hash === 'menu' || hash === 'pedidos');
  $('menuView').classList.toggle('hidden', hash !== 'menu');
  $('pedidosView').classList.toggle('hidden', hash !== 'pedidos');
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === hash));
  clearInterval(pedidosTimer);
  if (hash === 'pedidos') { cargarPedidos(); pedidosTimer = setInterval(cargarPedidos, 20000); }
  if (hash === 'nosotros') $('nosotros').scrollIntoView(); else window.scrollTo({ top: 0 });
}
window.addEventListener('hashchange', route);

// ============ 3. MODAL DE PRODUCTO ============
window.openProductModal = function (id) {
  const p = byId(id);
  if (!p) return;
  const img = p.img ? `<img src="${p.img}" alt="${esc(p.name)}" onerror="imgFail(this)">` : '';
  $('productModalBody').innerHTML = `
    <div class="modal-img cat-${p.category}">${img}</div>
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

// ============ 5. SESIÓN (Supabase, o modo local si no hay claves) ============
// Pega aquí los datos de tu proyecto: Supabase > Project Settings > API
const SUPABASE_URL = "";       // ejemplo: "https://abcdxyz.supabase.co"
const SUPABASE_ANON_KEY = "";  // clave "anon public" (NO la service_role)
const sb = (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

function authMsg(text, ok = false) {
  const m = $('authMsg');
  m.textContent = text || '';
  m.classList.toggle('hidden', !text);
  m.classList.toggle('ok', ok);
}

$('loginBtn').addEventListener('click', () => { authMsg(''); $('authModal').classList.remove('hidden'); });
$('closeAuthModal').addEventListener('click', () => $('authModal').classList.add('hidden'));
$('tabLogin').addEventListener('click', () => {
  authMsg(''); $('tabLogin').classList.add('active'); $('tabRegister').classList.remove('active');
  $('loginForm').classList.remove('hidden'); $('registerForm').classList.add('hidden');
});
$('tabRegister').addEventListener('click', () => {
  authMsg(''); $('tabRegister').classList.add('active'); $('tabLogin').classList.remove('active');
  $('registerForm').classList.remove('hidden'); $('loginForm').classList.add('hidden');
});

// Carga el rol (cliente / empleado) desde la tabla perfiles
async function cargarSesion(user) {
  const { data } = await sb.from('perfiles').select('nombre_completo, rol').eq('id', user.id).maybeSingle();
  currentUser = {
    id: user.id, email: user.email,
    name: (data && data.nombre_completo) || (user.user_metadata && user.user_metadata.full_name) || 'Cliente',
    role: (data && data.rol) || 'cliente'
  };
  onUserLoggedIn();
}

$('registerForm').addEventListener('submit', async e => {
  e.preventDefault(); authMsg('');
  const name = $('regName').value.trim(), email = $('regEmail').value.trim(), pass = $('regPassword').value;
  if (sb) {
    const { data, error } = await sb.auth.signUp({ email, password: pass, options: { data: { full_name: name } } });
    if (error) return authMsg(error.message);
    if (!data.session) return authMsg('Cuenta creada. Revisa tu correo para confirmarla y después inicia sesión.', true);
    await cargarSesion(data.user);
  } else {
    currentUser = { name, email, role: 'cliente' };
    localStorage.setItem('kaue_user', JSON.stringify(currentUser));
    onUserLoggedIn();
  }
});

$('loginForm').addEventListener('submit', async e => {
  e.preventDefault(); authMsg('');
  const email = $('loginEmail').value.trim(), pass = $('loginPassword').value;
  if (sb) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
    if (error) return authMsg(/invalid login/i.test(error.message) ? 'Correo o contraseña incorrectos.' : error.message);
    await cargarSesion(data.user);
  } else {
    currentUser = { name: "Cliente Kaué", email, role: 'cliente' };
    localStorage.setItem('kaue_user', JSON.stringify(currentUser));
    onUserLoggedIn();
  }
});

$('logoutBtn').addEventListener('click', async () => {
  if (sb) await sb.auth.signOut();
  currentUser = null;
  localStorage.removeItem('kaue_user');
  $('userGreeting').classList.add('hidden');
  $('logoutBtn').classList.add('hidden');
  $('loginBtn').classList.remove('hidden');
  $('navPedidos').classList.add('hidden');
  if (location.hash === '#pedidos') location.hash = '#inicio'; else route();
});

function onUserLoggedIn() {
  $('authModal').classList.add('hidden');
  $('loginBtn').classList.add('hidden');
  $('logoutBtn').classList.remove('hidden');
  const g = $('userGreeting');
  g.classList.remove('hidden');
  g.innerHTML = `Hola, ${esc(currentUser.name)}` + (currentUser.role === 'empleado' ? '<span class="role-tag">Empleado</span>' : '');
  $('navPedidos').classList.toggle('hidden', currentUser.role !== 'empleado');
  if (location.hash === '#pedidos') route();
}

async function initAuth() {
  if (!sb) { if (currentUser) { currentUser.role = currentUser.role || 'cliente'; onUserLoggedIn(); } return; }
  currentUser = null; localStorage.removeItem('kaue_user');
  const { data } = await sb.auth.getSession();
  if (data.session) await cargarSesion(data.session.user);
}

// ============ PANEL DE PEDIDOS (solo empleados) ============
const ESTADOS = [['pendiente', 'Pendiente'], ['preparando', 'En preparación'], ['listo', 'Listo'], ['entregado', 'Entregado']];

async function cargarPedidos() {
  const list = $('pedidosList');
  if (!sb || !currentUser || currentUser.role !== 'empleado') return;
  let q = sb.from('ventas').select('id, usuario_id, productos, total, fecha, estado').order('fecha', { ascending: false }).limit(100);
  const filtro = $('pedidosFiltro').value;
  if (filtro !== 'todos') q = q.eq('estado', filtro);
  const { data, error } = await q;
  if (error) { list.innerHTML = `<p class="pedidos-empty">No se pudieron cargar los pedidos: ${esc(error.message)}</p>`; return; }
  if (!data.length) { list.innerHTML = `<p class="pedidos-empty">No hay pedidos en este estado.</p>`; return; }

  const ids = [...new Set(data.map(v => v.usuario_id).filter(Boolean))];
  const nombres = {};
  if (ids.length) {
    const { data: ps } = await sb.from('perfiles').select('id, nombre_completo').in('id', ids);
    (ps || []).forEach(p => { nombres[p.id] = p.nombre_completo; });
  }
  list.innerHTML = data.map(v => {
    const items = (Array.isArray(v.productos) ? v.productos : []).map(i => `<li><span>${Number(i.cantidad) || 1} × ${esc(i.nombre || '')}</span><span>${money((Number(i.precio) || 0) * (Number(i.cantidad) || 1))}</span></li>`).join('');
    const opts = ESTADOS.map(([val, txt]) => `<option value="${val}"${val === v.estado ? ' selected' : ''}>${txt}</option>`).join('');
    return `
      <div class="pedido-card st-${esc(v.estado)}">
        <div class="pedido-head"><strong>KC-${String(v.id).padStart(6, '0')}</strong><span class="pedido-meta">${new Date(v.fecha).toLocaleString('es-MX')}</span></div>
        <div class="pedido-meta"><i class="fa-solid fa-user"></i> ${esc(nombres[v.usuario_id] || 'Cliente')}</div>
        <ul class="pedido-items">${items}</ul>
        <div class="pedido-foot"><strong>${money(Number(v.total))}</strong>
          <select onchange="cambiarEstado(${v.id}, this.value)" aria-label="Estado del pedido">${opts}</select></div>
      </div>`;
  }).join('');
}

window.cambiarEstado = async (id, estado) => {
  const { error } = await sb.from('ventas').update({ estado }).eq('id', id);
  if (error) alert("No se pudo actualizar el pedido: " + error.message);
  cargarPedidos();
};
$('pedidosFiltro').addEventListener('change', cargarPedidos);
$('pedidosRefresh').addEventListener('click', cargarPedidos);

// ============ 6. PEDIDO Y TICKET PDF ============
$('checkoutBtn').addEventListener('click', async () => {
  if (cart.length === 0) { alert("El carrito está vacío"); return; }
  if (!currentUser) {
    alert("Por favor inicia sesión para realizar tu pedido.");
    $('cartModal').classList.add('hidden');
    $('authModal').classList.remove('hidden');
    return;
  }
  const btn = $('checkoutBtn');
  btn.disabled = true;

  const { total } = cartTotals();
  const tax = total - total / 1.16; // los precios ya incluyen IVA
  let folio = "KC-" + Math.floor(100000 + Math.random() * 900000);

  // Guardar el pedido en Supabase (tabla ventas)
  if (sb && currentUser.id) {
    const productos = cart.map(l => { const p = byId(l.id); return { id: p.id, nombre: p.name, cantidad: l.qty, precio: p.price }; });
    const { data, error } = await sb.from('ventas').insert({ usuario_id: currentUser.id, productos, total }).select('id').single();
    if (error) { btn.disabled = false; alert("No se pudo registrar tu pedido: " + error.message); return; }
    folio = "KC-" + String(data.id).padStart(6, '0');
  }

  $('pdfFolio').textContent = folio;
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
    filename: `Ticket_Kaue_Coffee_${folio}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }
  };

  // El ticket se dibuja en blanco si está fuera de pantalla: se usa una copia visible mientras se genera.
  const stage = document.createElement('div');
  stage.className = 'pdf-stage';
  const clone = $('pdfInvoiceTemplate').cloneNode(true);
  clone.removeAttribute('id');
  stage.appendChild(clone);
  document.body.appendChild(stage);

  const limpiar = () => { stage.remove(); btn.disabled = false; };
  setTimeout(() => {
    html2pdf().set(opt).from(clone).save().then(() => {
      limpiar();
      cart = [];
      saveCartState();
      updateCartUI();
      $('cartModal').classList.add('hidden');
      localStorage.setItem('kaue_order_endtime', Date.now() + 15 * 60 * 1000);
      iniciarNotificacionPedido();
    }).catch(err => {
      limpiar();
      console.error(err);
      alert("Tu pedido se guardó, pero no se pudo generar el ticket. Intenta de nuevo.");
    });
  }, 250);
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
    return `Te recomiendo ${p.name}: ${p.desc} (${money(p.price)})`;
  }
  if (has(q, ['menu', 'producto', 'carta', 'que tienen', 'venden'])) return "Tenemos " + products.length + " productos: " + Object.values(CAT_NAMES).join(", ") + ". Entra a la sección Menú para verlos todos.";
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
updateCartUI();
initAuth();
iniciarNotificacionPedido();
route();

// ============ ANIMACIÓN DE ENTRADA (una vez por sesión) ============
(function () {
  const s = $('splash');
  if (!s) return;
  if (sessionStorage.getItem('kaue_splash') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { s.remove(); return; }
  sessionStorage.setItem('kaue_splash', '1');
  document.body.classList.add('no-scroll');
  const fin = () => { s.classList.add('hide'); document.body.classList.remove('no-scroll'); setTimeout(() => s.remove(), 800); };
  const t = setTimeout(fin, 4800);
  $('splashSkip').addEventListener('click', () => { clearTimeout(t); fin(); });
})();