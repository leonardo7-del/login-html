(function () {
    'use strict';

    var form = document.getElementById('loginForm');
    var emailInput = document.getElementById('email');
    var passwordInput = document.getElementById('password');
    var emailGroup = document.getElementById('emailGroup');
    var passwordGroup = document.getElementById('passwordGroup');
    var emailError = document.getElementById('emailError').querySelector('span');
    var passwordError = document.getElementById('passwordError').querySelector('span');
    var toggleBtn = document.getElementById('togglePassword');
    var btnLogin = document.getElementById('btnLogin');
    var toastContainer = document.getElementById('toastContainer');

    var VALID_CREDENTIALS = {
        email: 'admin@meridian.com',
        password: 'Meridian2024'
    };

    function createParticles() {
        var bgLayer = document.querySelector('.bg-layer');

        for (var i = 0; i < 20; i++) {
            var particle = document.createElement('div');
            var size = (1 + Math.random() * 2.5) + 'px';

            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (10 + Math.random() * 16) + 's';
            particle.style.animationDelay = Math.random() * 12 + 's';
            particle.style.width = size;
            particle.style.height = size;

            bgLayer.appendChild(particle);
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }

    function showFieldError(group, errorSpan, message) {
        group.classList.remove('is-valid');
        group.classList.add('has-error');
        errorSpan.textContent = message;
    }

    function clearFieldError(group) {
        group.classList.remove('has-error');
    }

    function markValid(group) {
        group.classList.remove('has-error');
        group.classList.add('is-valid');
    }

    function showToast(type, message) {
        var toast = document.createElement('div');
        var icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark';

        toast.className = 'toast ' + type;
        toast.innerHTML = '<i class="fa-solid ' + icon + '"></i><span>' + message + '</span>';
        toastContainer.appendChild(toast);

        setTimeout(function () {
            toast.classList.add('removing');
            toast.addEventListener('animationend', function () {
                toast.remove();
            });
        }, 4000);
    }

    function injectShakeAnimation() {
        var shakeCSS = document.createElement('style');
        shakeCSS.textContent = '@keyframes shake { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-8px)} 30%{transform:translateX(7px)} 45%{transform:translateX(-6px)} 60%{transform:translateX(5px)} 75%{transform:translateX(-3px)} 90%{transform:translateX(2px)} }';
        document.head.appendChild(shakeCSS);
    }

    function handleEmailBlur() {
        var value = emailInput.value.trim();

        if (!value) {
            showFieldError(emailGroup, emailError, 'El correo es obligatorio');
            return;
        }

        if (!isValidEmail(value)) {
            showFieldError(emailGroup, emailError, 'Formato de correo no valido');
            return;
        }

        markValid(emailGroup);
    }

    function handlePasswordBlur() {
        var value = passwordInput.value;

        if (!value) {
            showFieldError(passwordGroup, passwordError, 'La contrasena es obligatoria');
            return;
        }

        if (value.length < 6) {
            showFieldError(passwordGroup, passwordError, 'Minimo 6 caracteres requeridos');
            return;
        }

        markValid(passwordGroup);
    }

    function handleSubmit(event) {
        var emailVal;
        var passVal;
        var hasErrors = false;

        event.preventDefault();

        emailVal = emailInput.value.trim();
        passVal = passwordInput.value;

        if (!emailVal) {
            showFieldError(emailGroup, emailError, 'El correo es obligatorio');
            hasErrors = true;
        } else if (!isValidEmail(emailVal)) {
            showFieldError(emailGroup, emailError, 'Formato de correo no valido');
            hasErrors = true;
        } else {
            markValid(emailGroup);
        }

        if (!passVal) {
            showFieldError(passwordGroup, passwordError, 'La contrasena es obligatoria');
            hasErrors = true;
        } else if (passVal.length < 6) {
            showFieldError(passwordGroup, passwordError, 'Minimo 6 caracteres requeridos');
            hasErrors = true;
        } else {
            markValid(passwordGroup);
        }

        if (hasErrors) {
            return;
        }

        btnLogin.classList.add('loading');
        btnLogin.disabled = true;

        setTimeout(function () {
            var container = document.querySelector('.login-container');

            btnLogin.classList.remove('loading');
            btnLogin.disabled = false;

            if (emailVal === VALID_CREDENTIALS.email && passVal === VALID_CREDENTIALS.password) {
                showToast('success', 'Acceso concedido. Redirigiendo al portal...');
                container.style.borderColor = 'rgba(68,255,68,0.25)';

                setTimeout(function () {
                    container.style.borderColor = '';
                }, 2500);

                return;
            }

            showToast('error', 'Credenciales incorrectas. Verifica tus datos.');
            btnLogin.style.animation = 'none';
            void btnLogin.offsetHeight;
            btnLogin.style.animation = 'shake 0.5s ease';

            if (emailVal !== VALID_CREDENTIALS.email) {
                showFieldError(emailGroup, emailError, 'No hay cuenta asociada a este correo');
            } else {
                showFieldError(passwordGroup, passwordError, 'Contrasena incorrecta');
            }
        }, 1800);
    }

    function handleForgotPassword(event) {
        var emailVal = emailInput.value.trim();

        event.preventDefault();

        if (emailVal && isValidEmail(emailVal)) {
            showToast('success', 'Enlace de recuperacion enviado a ' + emailVal);
            return;
        }

        showToast('error', 'Ingresa tu correo para recuperar la contrasena');
        emailInput.focus();
    }

    function handleSsoClick(event) {
        event.preventDefault();
        showToast('success', 'Redirigiendo al proveedor de identidad SSO...');
    }

    function handleBodyEnter(event) {
        if (event.key === 'Enter' && document.activeElement === document.body) {
            emailInput.focus();
        }
    }

    createParticles();
    injectShakeAnimation();

    emailInput.addEventListener('blur', handleEmailBlur);
    emailInput.addEventListener('input', function () {
        if (emailGroup.classList.contains('has-error')) {
            clearFieldError(emailGroup);
        }
    });

    passwordInput.addEventListener('blur', handlePasswordBlur);
    passwordInput.addEventListener('input', function () {
        if (passwordGroup.classList.contains('has-error')) {
            clearFieldError(passwordGroup);
        }
    });

    toggleBtn.addEventListener('click', function () {
        var isPassword = passwordInput.type === 'password';
        var icon = toggleBtn.querySelector('i');

        passwordInput.type = isPassword ? 'text' : 'password';
        icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
        toggleBtn.setAttribute('aria-label', isPassword ? 'Ocultar contrasena' : 'Mostrar contrasena');
    });

    form.addEventListener('submit', handleSubmit);

    document.getElementById('forgotLink').addEventListener('click', handleForgotPassword);
    document.getElementById('ssoLink').addEventListener('click', handleSsoClick);
    document.getElementById('btnMicrosoft').addEventListener('click', function () {
        showToast('success', 'Conectando con Microsoft Azure AD...');
    });
    document.getElementById('btnGoogle').addEventListener('click', function () {
        showToast('success', 'Conectando con Google Workspace...');
    });
    document.addEventListener('keydown', handleBodyEnter);
})();
