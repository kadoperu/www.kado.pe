/**
 * KADO Telecomunicaciones - JavaScript Principal
 * Funcionalidades para navegación, formularios e interactividad
 */

// ===== VARIABLES GLOBALES =====
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeContactForm();
    initializeAnimations();
    
    // Initialize plan tabs on page load
    // Ensure residential plans are shown by default
    const residencialPlans = document.getElementById('residencial-plans');
    const pymesPlans = document.getElementById('pymes-plans');
    const corporativoPlans = document.getElementById('corporativo-plans');
    
    if (residencialPlans && pymesPlans && corporativoPlans) {
        // Hide all plan contents first
        residencialPlans.classList.remove('active');
        pymesPlans.classList.remove('active');
        corporativoPlans.classList.remove('active');
        
        // Show residential plans by default
        residencialPlans.classList.add('active');
    }
    
    // Ensure first tab button is active
    const allTabButtons = document.querySelectorAll('.tab-button');
    allTabButtons.forEach(button => button.classList.remove('active'));
    
    const firstTabButton = document.querySelector('.tab-button');
    if (firstTabButton) {
        firstTabButton.classList.add('active');
    }
});

// ===== NAVEGACIÓN MÓVIL =====
function initializeNavigation() {
    // Toggle del menú hamburguesa
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Cerrar menú al hacer click fuera de él
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Navegación suave (smooth scroll)
    initializeSmoothScroll();
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// ===== NAVEGACIÓN SUAVE =====
function initializeSmoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Solo aplicar smooth scroll a enlaces internos
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = navbar.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar enlace activo
                    updateActiveNavLink(this);
                }
            }
        });
    });
}

function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        handleNavbarScroll();
        handleActiveSection();
    });
}

function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function handleActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (correspondingNavLink) {
                updateActiveNavLink(correspondingNavLink);
            }
        }
    });
}

// ===== FORMULARIO DE CONTACTO =====
function initializeContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
        
        // Validación en tiempo real
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
    
    // Corporate form handling with modern approach
    const corporateForm = document.getElementById('contacto');
    if (corporateForm) {
        corporateForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // evita que la página se recargue
            
            const form = e.target;
            const data = new FormData(form);
            const respuestaElement = document.getElementById('respuesta');
            
            // Limpiar mensaje anterior
            respuestaElement.textContent = '';
            respuestaElement.className = 'form-response';
            
            // Mostrar mensaje de envío
            respuestaElement.textContent = 'Enviando mensaje...';
            respuestaElement.style.color = '#cccccc';
            
            try {
                const respuesta = await fetch("https://formspree.io/f/xvgbnvon", {
                    method: "POST",
                    body: data,
                    headers: {
                        "Accept": "application/json"
                    }
                });
                
                if (respuesta.ok) {
                    respuestaElement.textContent = "✅ ¡Mensaje enviado con éxito!";
                    respuestaElement.style.color = '#4CAF50';
                    respuestaElement.style.background = 'rgba(76, 175, 80, 0.1)';
                    form.reset(); // limpia los campos
                } else {
                    respuestaElement.textContent = "⚠️ Hubo un problema, intenta de nuevo.";
                    respuestaElement.style.color = '#ff6b35';
                    respuestaElement.style.background = 'rgba(255, 107, 53, 0.1)';
                }
            } catch (error) {
                respuestaElement.textContent = "❌ Error de conexión.";
                respuestaElement.style.color = '#f44336';
                respuestaElement.style.background = 'rgba(244, 67, 54, 0.1)';
            }
        });
    }
}

function handleContactFormSubmit(e) {
    e.preventDefault(); // evita que la página se recargue
    
    const form = e.target;
    const data = new FormData(form);
    const respuestaElement = document.getElementById('respuesta');
    
    // Limpiar mensaje anterior
    respuestaElement.textContent = '';
    
    // Validar formulario antes de enviar
    if (!validateContactForm()) {
        return;
    }
    
    // Mostrar mensaje de envío
    respuestaElement.textContent = 'Enviando mensaje...';
    respuestaElement.style.color = '#666';
    
    // Enviar con fetch
    fetch('https://formspree.io/f/xvgbnvon', {
        method: 'POST',
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            respuestaElement.textContent = '✅ ¡Mensaje enviado con éxito!';
            respuestaElement.style.color = '#28a745';
            form.reset(); // limpia los campos
        } else {
            respuestaElement.textContent = '⚠️ Hubo un problema, intenta de nuevo.';
            respuestaElement.style.color = '#dc3545';
        }
    })
    .catch(error => {
        respuestaElement.textContent = '❌ Error de conexión.';
        respuestaElement.style.color = '#dc3545';
    });
}

function validateContactForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const service = document.getElementById('service');
    const message = document.getElementById('message');
    
    let isValid = true;
    
    // Validar nombre
    if (!name.value.trim()) {
        showFieldError(name, 'El nombre es requerido');
        isValid = false;
    }
    
    // Validar email
    if (!email.value.trim()) {
        showFieldError(email, 'El email es requerido');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showFieldError(email, 'Ingrese un email válido');
        isValid = false;
    }
    
    // Validar servicio
    if (!service.value) {
        showFieldError(service, 'Seleccione un servicio');
        isValid = false;
    }
    
    // Validar mensaje
    if (!message.value.trim()) {
        showFieldError(message, 'El mensaje es requerido');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    clearFieldError(field);
    
    switch (field.type) {
        case 'email':
            if (value && !isValidEmail(value)) {
                showFieldError(field, 'Ingrese un email válido');
            }
            break;
        case 'tel':
            if (value && !isValidPhone(value)) {
                showFieldError(field, 'Ingrese un teléfono válido');
            }
            break;
    }
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    if (typeof field === 'object' && field.target) {
        field = field.target;
    }
    
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showFormSuccess() {
    // Crear mensaje de éxito
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.</p>
    `;
    
    // Insertar mensaje antes del formulario
    contactForm.parentNode.insertBefore(successMessage, contactForm);
    
    // Remover mensaje después de 5 segundos
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
    
    // Scroll al mensaje de éxito
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== UTILIDADES DE VALIDACIÓN =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

// ===== ANIMACIONES =====
function initializeAnimations() {
    // Intersection Observer para animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const animatedElements = document.querySelectorAll('.service-card, .product-card, .testimonial-card, .about-stats .stat');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== FUNCIONES AUXILIARES =====

/**
 * Función para manejar clicks en botones de WhatsApp
 */
function handleWhatsAppClick() {
    // El enlace ya está configurado en el HTML, esta función es para tracking si es necesario
    console.log('WhatsApp button clicked');
}

// ===== FORMULARIO CORPORATIVO =====
/**
 * Función para manejar clicks en botones de planes
 */
function handlePlanClick(planName) {
    // Scroll al formulario de contacto
    const contactSection = document.getElementById('contactenos');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Pre-llenar el formulario con el plan seleccionado
        setTimeout(() => {
            const serviceSelect = document.getElementById('service');
            const messageTextarea = document.getElementById('message');
            
            if (serviceSelect) {
                serviceSelect.value = 'internet';
            }
            
            if (messageTextarea) {
                messageTextarea.value = `Hola, me interesa el ${planName}. Me gustaría recibir más información.`;
            }
        }, 500);
    }
}

/**
 * Plan type switching functionality
 */
function showPlanType(planType) {
    // Hide all plan contents
    const allPlanContents = document.querySelectorAll('.plan-content');
    allPlanContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const allTabButtons = document.querySelectorAll('.tab-button');
    allTabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected plan content
    const selectedPlanContent = document.getElementById(planType + '-plans');
    if (selectedPlanContent) {
        selectedPlanContent.classList.add('active');
    }
    
    // Add active class to clicked tab button
    const clickedButton = event.target.closest('.tab-button');
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

/**
 * Función para lazy loading de imágenes
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== ESTILOS DINÁMICOS PARA ERRORES =====
const dynamicStyles = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .field-error {
        display: block;
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .form-success {
        background-color: #10b981;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .form-success i {
        font-size: 1.25rem;
    }
    
    .form-success p {
        margin: 0;
    }
    
    .navbar.scrolled {
        background-color: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
    }
`;

// Agregar estilos dinámicos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// ===== MANEJO DE ERRORES GLOBALES =====
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
});

// ===== EXPORT PARA TESTING (si es necesario) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        isValidPhone,
        validateContactForm
    };
}