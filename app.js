// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================
const SUPABASE_URL = 'https://mfhydkxblxikwpulnzam.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1maHlka3hibHhpa3dwdWxuemFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNjk5NjQsImV4cCI6MjEwNTg0NTk2NH0.RH2MCVfW_ZjoJKSi5yViPMQ8WrKgrCE8Y-amyFgqGXs';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Variables de estado global
let carrito = [];
let historialVentas = [];
let usuarioActual = null;

// Inicialización de la aplicación al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
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
// AUTENTICACIÓN Y ROLES
// ==========================================

async function cargarDatosUsuario(user) {
    // Buscar datos extendidos (nombre y rol) en la tabla 'perfiles'
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

    // Se registra el usuario en Auth.
    // El Trigger handle_new_user() de Postgres creará la fila en 'perfiles' de forma automática.
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
        alert('Error al registrar en Supabase: ' + error.message);
        return;
    }

    alert('¡Registro completado exitosamente! Ahora puedes iniciar sesión.');
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
        alert('Error al iniciar sesión: ' + error.message);
        return;
    }

    await cargarDatosUsuario(data.user);
    alert(`¡Bienvenido de nuevo, ${usuarioActual.nombre}!`);
    event.target.reset();
    actualizarEstadoInterfaz();
    mostrarSeccion('inicio');
}

async function cerrarSesion() {
    await _supabase.auth.signOut();
    usuarioActual = null;
    actualizarEstadoInterfaz();
    alert('Has cerrado sesión.');
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
        alert('Acceso restringido: Esta sección requiere una cuenta de Empleado.');
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
    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }

    actualizarWidget();
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
        alert('Debes iniciar sesión con tu cuenta para hacer un pedido.');
        mostrarSeccion('login');
        return;
    }

    if (carrito.length === 0) {
        alert('Tu pedido está vacío. Selecciona productos del menú.');
        return;
    }

    const totalCalculado = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    // Insertar la venta en la tabla 'ventas' de Supabase
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
        alert('Error al procesar la compra en Supabase: ' + error.message);
        return;
    }

    alert(`¡Compra registrada correctamente en Supabase!\nTotal: $${totalCalculado}.00 MXN`);

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
        alert('No hay ventas disponibles para exportar.');
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