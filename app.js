// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================
const SUPABASE_URL = 'https://mfhydkxblxikwpulnzam.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1maHlka3hibHhpa3dwdWxuemFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNjk5NjQsImV4cCI6MjEwNTg0NTk2NH0.RH2MCVfW_ZjoJKSi5yViPMQ8WrKgrCE8Y-amyFgqGXs';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Catálogo de 20 Productos
const productosMenu = [
    { id: 1, nombre: 'Café Americano', precio: 35, desc: 'Espresso diluido en agua caliente.', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400' },
    { id: 2, nombre: 'Cappuccino', precio: 45, desc: 'Espresso con leche vaporizada y espuma.', img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
    { id: 3, nombre: 'Croissant', precio: 40, desc: 'Hojaldre recién horneado de mantequilla.', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400' },
    { id: 4, nombre: 'Espresso Doble', precio: 38, desc: 'Doble carga de café concentrado.', img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400' },
    { id: 5, nombre: 'Latte de Vainilla', precio: 52, desc: 'Espresso con leche y jarabe de vainilla.', img: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400' },
    { id: 6, nombre: 'Mocha Caliente', precio: 55, desc: 'Mezcla de café, chocolate y leche.', img: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400' },
    { id: 7, nombre: 'Caramel Macchiato', precio: 58, desc: 'Leche manchada con espresso y caramelo.', img: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400' },
    { id: 8, nombre: 'Frappé de Café', precio: 60, desc: 'Bebida fría batida con hielo y café.', img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400' },
    { id: 9, nombre: 'Frappé Choco-Chip', precio: 65, desc: 'Hielo batido con chocolate y chips.', img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' },
    { id: 10, nombre: 'Té Matcha Latte', precio: 50, desc: 'Té verde matcha concentrado con leche.', img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400' },
    { id: 11, nombre: 'Té Chai Latte', precio: 48, desc: 'Té especiado con leche tibia.', img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400' },
    { id: 12, nombre: 'Cold Brew', precio: 45, desc: 'Café infusionado en frío por 12 horas.', img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400' },
    { id: 13, nombre: 'Muffin de Arándanos', precio: 32, desc: 'Panecillo suave relleno de arándanos.', img: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400' },
    { id: 14, nombre: 'Bagel de Queso Crema', precio: 45, desc: 'Pan bagel tostado con queso crema.', img: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400' },
    { id: 15, nombre: 'Sandwich Jamón y Queso', precio: 65, desc: 'Pan artesanal, jamón de pavo y queso.', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400' },
    { id: 16, nombre: 'Panini Caprese', precio: 70, desc: 'Tomate, pesto y queso mozzarella fresco.', img: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400' },
    { id: 17, nombre: 'Cheesecake de Fresa', precio: 50, desc: 'Rebanada de pastel de queso con fresas.', img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400' },
    { id: 18, nombre: 'Galleta de Chispas', precio: 25, desc: 'Galleta horneada con chispas de chocolate.', img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400' },
    { id: 19, nombre: 'Jugo de Naranja Natural', precio: 30, desc: 'Jugo recién exprimido 100% natural.', img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400' },
    { id: 20, nombre: 'Smoothie de Frutos Rojos', precio: 55, desc: 'Bebida fría de fresa, mora y frambuesa.', img: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400' }
];

// Variables de estado global
let carrito = [];
let historialVentas = [];
let usuarioActual = null;

// Inicialización de la aplicación al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    renderizarMenu();

    // Comprobar si hay una sesión activa en Supabase
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
        await cargarDatosUsuario(session.user);
    }
    actualizarEstadoInterfaz();
});

// Escuchar cambios de autenticación en segundo plano
_supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
        await cargarDatosUsuario(session.user);
    } else {
        usuarioActual = null;
    }
    actualizarEstadoInterfaz();
});

// ==========================================
// RENDERIZADO DEL MENÚ
// ==========================================
function renderizarMenu() {
    const grid = document.getElementById('grid-menu-productos');
    if (!grid) return;

    grid.innerHTML = productosMenu.map(p => `
        <div class="card-menu">
            <img src="${p.img}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p>${p.desc}</p>
            <span class="precio">$${p.precio}.00 MXN</span>
            <button class="btn-agregar" onclick="agregarAlCarrito('${p.nombre}', ${p.precio})">Agregar al Pedido</button>
        </div>
    `).join('');
}

// ==========================================
// MODAL PERSONALIZADO DE NOTIFICACIONES
// ==========================================
function mostrarNotificacion(mensaje) {
    const modal = document.getElementById('modal-notificacion');
    const texto = document.getElementById('modal-mensaje-texto');
    if (modal && texto) {
        texto.textContent = mensaje;
        modal.style.display = 'flex';
    }
}

function cerrarModalNotificacion() {
    const modal = document.getElementById('modal-notificacion');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ==========================================
// AUTENTICACIÓN Y ROLES
// ==========================================

async function cargarDatosUsuario(user) {
    const { data: perfil } = await _supabase
        .from('perfiles')
        .select('*')
        .eq('id', user.id)
        .single();

    usuarioActual = {
        id: user.id,
        email: user.email,
        nombre: perfil ? perfil.nombre_completo : (user.user_metadata.full_name || 'Usuario'),
        rol: perfil ? perfil.rol : (user.user_metadata.user_role || 'cliente')
    };
}

async function procesarRegistro(event) {
    event.preventDefault();

    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const rol = document.getElementById('reg-rol').value;

    const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: nombre,
                user_role: rol
            }
        }
    });

    if (error) {
        mostrarNotificacion('Error al registrar en Supabase: ' + error.message);
        return;
    }

    mostrarNotificacion('¡Registro completado exitosamente! Ahora puedes iniciar sesión.');
    event.target.reset();
    mostrarSeccion('login');
}

async function procesarLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        mostrarNotificacion('Error al iniciar sesión: ' + error.message);
        return;
    }

    await cargarDatosUsuario(data.user);
    mostrarNotificacion(`Has iniciado sesión como ${usuarioActual.nombre}.`);
    event.target.reset();
    actualizarEstadoInterfaz();
    mostrarSeccion('inicio');
}

async function cerrarSesion() {
    await _supabase.auth.signOut();
    usuarioActual = null;
    actualizarEstadoInterfaz();
    mostrarNotificacion('Has cerrado sesión.');
    mostrarSeccion('inicio');
}

function actualizarEstadoInterfaz() {
    const linkVentas = document.getElementById('link-reporte-ventas');
    const contenedorAuth = document.getElementById('contenedor-botones-auth');
    const contenedorUsuario = document.getElementById('contenedor-usuario-logueado');
    const textoSaludo = document.getElementById('texto-usuario-saludo');

    if (usuarioActual) {
        if (contenedorAuth) contenedorAuth.style.display = 'none';
        if (contenedorUsuario) contenedorUsuario.style.display = 'flex';
        if (textoSaludo) textoSaludo.textContent = `Hola, ${usuarioActual.nombre} (${usuarioActual.rol})`;

        if (usuarioActual.rol === 'empleado') {
            if (linkVentas) linkVentas.style.display = 'inline-block';
            cargarVentasGlobales();
        } else {
            if (linkVentas) linkVentas.style.display = 'none';
        }
    } else {
        if (contenedorAuth) contenedorAuth.style.display = 'block';
        if (contenedorUsuario) contenedorUsuario.style.display = 'none';
        if (linkVentas) linkVentas.style.display = 'none';
    }
}

// ==========================================
// NAVEGACIÓN
// ==========================================

function mostrarSeccion(idSeccion) {
    if (idSeccion === 'ventas' && (!usuarioActual || usuarioActual.rol !== 'empleado')) {
        mostrarNotificacion('Acceso restringido: Esta sección requiere una cuenta de Empleado.');
        return;
    }

    const secciones = document.querySelectorAll('.seccion-app');
    secciones.forEach(seccion => seccion.classList.remove('active'));

    const seccionObjetivo = document.getElementById('seccion-' + idSeccion);
    if (seccionObjetivo) {
        seccionObjetivo.classList.add('active');
    }

    const widget = document.getElementById('widget-pedido');
    if (idSeccion === 'menu') {
        widget.style.display = 'block';
    } else {
        widget.style.display = 'none';
    }
}

// ==========================================
// CARRITO DE COMPRAS
// ==========================================

function agregarAlCarrito(nombre, precio) {
    const productoExistente = carrito.find(item => item.nombre.toLowerCase() === nombre.toLowerCase());

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }

    actualizarWidget();
    const widget = document.getElementById('widget-pedido');
    if (widget) widget.style.display = 'block';
}

function cambiarCantidad(nombre, cambio) {
    const producto = carrito.find(item => item.nombre === nombre);

    if (producto) {
        producto.cantidad += cambio;
        if (producto.cantidad <= 0) {
            eliminarProducto(nombre);
            return;
        }
    }

    actualizarWidget();
}

function eliminarProducto(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre);
    actualizarWidget();
}

function actualizarWidget() {
    const lista = document.getElementById('lista-pedido');
    const totalElemento = document.getElementById('total-monto');

    let total = 0;

    if (carrito.length === 0) {
        lista.innerHTML = '<li class="vacio">No has seleccionado productos.</li>';
    } else {
        lista.innerHTML = '';
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            const li = document.createElement('li');
            li.className = 'item-pedido';
            li.innerHTML = `
                <div class="info-item">
                    <span class="nombre-item">${item.nombre}</span>
                    <span class="subtotal-item">$${subtotal}.00 MXN</span>
                </div>
                <div class="controles-item">
                    <button class="btn-cant" onclick="cambiarCantidad('${item.nombre}', -1)">-</button>
                    <span class="cant-texto">${item.cantidad}</span>
                    <button class="btn-cant" onclick="cambiarCantidad('${item.nombre}', 1)">+</button>
                    <button class="btn-eliminar" onclick="eliminarProducto('${item.nombre}')" title="Eliminar">×</button>
                </div>
            `;
            lista.appendChild(li);
        });
    }

    totalElemento.textContent = `$${total}.00 MXN`;
}

// ==========================================
// VENTAS Y CONSULTAS A SUPABASE
// ==========================================

async function realizarCompra() {
    if (!usuarioActual) {
        mostrarNotificacion('Debes iniciar sesión con tu cuenta para hacer un pedido.');
        mostrarSeccion('login');
        return;
    }

    if (carrito.length === 0) {
        mostrarNotificacion('Tu pedido está vacío. Selecciona productos del menú.');
        return;
    }

    const totalCalculado = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    const { data, error } = await _supabase
        .from('ventas')
        .insert([
            {
                usuario_id: usuarioActual.id,
                productos: carrito,
                total: totalCalculado
            }
        ]);

    if (error) {
        mostrarNotificacion('Error al procesar la compra en Supabase: ' + error.message);
        return;
    }

    mostrarNotificacion(`¡Compra registrada correctamente!\nTotal: $${totalCalculado}.00 MXN`);

    carrito = [];
    actualizarWidget();

    if (usuarioActual.rol === 'empleado') {
        cargarVentasGlobales();
    }
}

async function cargarVentasGlobales() {
    const { data, error } = await _supabase
        .from('ventas')
        .select('*')
        .order('fecha', { ascending: false });

    if (error) {
        console.error('Error al cargar ventas:', error.message);
        return;
    }

    historialVentas = data || [];
    actualizarTablaVentas();
}

function actualizarTablaVentas() {
    const tbody = document.getElementById('tabla-ventas-body');
    const totalAcumuladoEl = document.getElementById('total-ventas-acumulado');

    if (!tbody || !totalAcumuladoEl) return;

    if (historialVentas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="vacio">No hay ventas registradas.</td></tr>';
        totalAcumuladoEl.textContent = '$0.00 MXN';
        return;
    }

    tbody.innerHTML = '';
    let sumaTotal = 0;

    historialVentas.forEach(venta => {
        sumaTotal += parseFloat(venta.total);

        let textoProductos = '';
        if (Array.isArray(venta.productos)) {
            textoProductos = venta.productos.map(p => `${p.cantidad}x ${p.nombre}`).join(', ');
        } else {
            textoProductos = JSON.stringify(venta.productos);
        }

        const fechaFormateada = new Date(venta.fecha).toLocaleString();

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${venta.id}</td>
            <td>${fechaFormateada}</td>
            <td>${textoProductos}</td>
            <td>$${parseFloat(venta.total).toFixed(2)} MXN</td>
        `;
        tbody.appendChild(tr);
    });

    totalAcumuladoEl.textContent = `$${sumaTotal.toFixed(2)} MXN`;
}

function generarPDFVentas() {
    if (historialVentas.length === 0) {
        mostrarNotificacion('No hay ventas disponibles para exportar.');
        return;
    }

    document.getElementById('pdf-fecha').textContent = 'Fecha de reporte: ' + new Date().toLocaleString();
    const elemento = document.getElementById('documento-pdf');

    const opciones = {
        margin: 10,
        filename: `Reporte_Ventas_Kaue_${new Date().toISOString().slice(0,10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opciones).from(elemento).save();
}

// ==========================================
// CHATBOT Y BANNER DE CONSULTA DE PEDIDOS
// ==========================================

function toggleChatbot() {
    const chatWin = document.getElementById('chatbot-window');
    if (chatWin) {
        if (chatWin.style.display === 'flex') {
            chatWin.style.display = 'none';
        } else {
            chatWin.style.display = 'flex';
        }
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        enviarMensajeChat();
    }
}

function agregarMensajeChat(texto, emisor) {
    const contenedor = document.getElementById('chatbot-messages');
    if (!contenedor) return;

    const div = document.createElement('div');
    div.className = `chat-message ${emisor}`;
    div.innerHTML = texto;
    contenedor.appendChild(div);
    contenedor.scrollTop = contenedor.scrollHeight;
}

function enviarMensajeChat() {
    const input = document.getElementById('chatbot-input');
    const texto = input.value.trim();
    if (!texto) return;

    agregarMensajeChat(texto, 'user');
    input.value = '';

    setTimeout(() => {
        procesarRespuestaChatbot(texto);
    }, 400);
}

function procesarRespuestaChatbot(mensaje) {
    const msg = mensaje.toLowerCase();

    // Comandos de menú
    if (msg.includes('menu') || msg.includes('menú') || msg.includes('ver') || msg.includes('opciones')) {
        let listaMenu = '<strong>☕ Nuestro Menú Completo:</strong><br><ul style="margin-top: 5px; padding-left: 15px;">';
        productosMenu.forEach(p => {
            listaMenu += `<li><strong>${p.nombre}</strong> - $${p.precio}.00 MXN</li>`;
        });
        listaMenu += '</ul><br>Escribe algo como <em>"quiero 2 cappuccino y 1 muffin"</em> para agregarlos a tu pedido.';
        agregarMensajeChat(listaMenu, 'bot');
        return;
    }

    // Análisis de orden/pedido
    let agregados = [];
    let noEncontrados = [];

    productosMenu.forEach(prod => {
        const nombreProd = prod.nombre.toLowerCase();
        // Buscar coincidencia del nombre del producto o parte principal
        const palabrasClave = nombreProd.split(' ');
        const coincidencia = palabrasClave.some(p => p.length > 3 && msg.includes(p));

        if (coincidencia) {
            // Intentar detectar cantidad anterior a la palabra
            const regex = new RegExp(`(\\d+)\\s*(?:x)?\\s*${palabrasClave[0]}`, 'i');
            const match = msg.match(regex);
            let cantidad = 1;
            if (match && match[1]) {
                cantidad = parseInt(match[1]);
            }

            for (let i = 0; i < cantidad; i++) {
                agregarAlCarrito(prod.nombre, prod.precio);
            }
            agregados.push(`${cantidad}x ${prod.nombre}`);
        }
    });

    if (agregados.length > 0) {
        let resp = `¡Excelente! He añadido a tu pedido:<br>• ${agregados.join('<br>• ')}<br><br>Puedes ver tu pedido acumulado a la derecha y presionar <strong>Comprar</strong> para finalizar.`;
        agregarMensajeChat(resp, 'bot');
    } else {
        let respDefault = 'Disculpa, no logré identificar los productos. Escribe "menú" para conocer nuestras opciones o menciona directamente el producto (ejemplo: <em>"1 café americano"</em>).';
        agregarMensajeChat(respDefault, 'bot');
    }
}