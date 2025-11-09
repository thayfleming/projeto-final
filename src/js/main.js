// src/js/main.js - ACESSIBILIDADE WCAG 2.1 AA

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades de acessibilidade
    initAccessibility();
    initThemeSwitcher();
    initKeyboardNavigation();
    initSkipLink();
});

// Inicialização principal de acessibilidade
function initAccessibility() {
    console.log('Sistema de acessibilidade inicializado - WCAG 2.1 AA');
    
    // Adicionar atributos ARIA dinamicamente
    enhanceSemanticStructure();
    
    // Configurar gerenciamento de foco
    setupFocusManagement();
}

// Gerenciador de temas
function initThemeSwitcher() {
    const themeButtons = document.querySelectorAll('[data-theme]');
    const savedTheme = localStorage.getItem('preferred-theme');
    
    // Aplicar tema salvo
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
    
    // Configurar botões de tema
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            switchTheme(theme);
        });
        
        // Suporte a teclado (Enter e Espaço)
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const theme = this.getAttribute('data-theme');
                switchTheme(theme);
            }
        });
    });
}

// Alternar entre temas
function switchTheme(theme) {
    const body = document.body;
    
    // Remover todos os temas
    body.removeAttribute('data-theme');
    
    if (theme && theme !== 'default') {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('preferred-theme', theme);
    } else {
        localStorage.removeItem('preferred-theme');
    }
    
    // Anunciar mudança para leitores de tela
    announceToScreenReader(`Tema alterado para ${getThemeName(theme)}`);
}

// Obter nome amigável do tema
function getThemeName(theme) {
    const themes = {
        'default': 'padrão',
        'dark': 'modo escuro',
        'high-contrast': 'alto contraste'
    };
    return themes[theme] || 'padrão';
}

// Navegação por teclado
function initKeyboardNavigation() {
    // Trap de foco para modais (se houver)
    setupFocusTraps();
    
    // Navegação por teclas de atalho
    document.addEventListener('keydown', function(e) {
        // Alt + 1 - Ir para conteúdo principal
        if (e.altKey && e.key === '1') {
            e.preventDefault();
            const main = document.querySelector('main');
            if (main) main.focus();
        }
        
        // Alt + 2 - Ir para menu de navegação
        if (e.altKey && e.key === '2') {
            e.preventDefault();
            const nav = document.querySelector('nav');
            if (nav) nav.focus();
        }
        
        // Alt + T - Alternar temas
        if (e.altKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            cycleThemes();
        }
    });
}

// Ciclar entre temas com teclado
function cycleThemes() {
    const currentTheme = document.body.getAttribute('data-theme') || 'default';
    const themes = ['default', 'dark', 'high-contrast'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    
    switchTheme(themes[nextIndex]);
}

// Configurar skip link
function initSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                
                // Remover tabindex após o foco
                setTimeout(() => {
                    targetElement.removeAttribute('tabindex');
                }, 1000);
            }
        });
    }
}

// Melhorar estrutura semântica com ARIA
function enhanceSemanticStructure() {
    // Adicionar roles e labels onde necessário
    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
        main.setAttribute('role', 'main');
    }
    
    const header = document.querySelector('header');
    if (header && !header.getAttribute('role')) {
        header.setAttribute('role', 'banner');
    }
    
    const footer = document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
    }
    
    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('aria-label')) {
        nav.setAttribute('aria-label', 'Navegação principal');
    }
}

// Gerenciamento de foco
function setupFocusManagement() {
    // Manter controle do último elemento focado
    let lastFocusedElement;
    
    document.addEventListener('focusin', function(e) {
        lastFocusedElement = e.target;
    });
    
    // Restaurar foco quando necessário
    window.restoreFocus = function() {
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    };
}

// Configurar traps de foco para modais
function setupFocusTraps() {
    const modals = document.querySelectorAll('[role="dialog"]');
    
    modals.forEach(modal => {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            modal.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
                
                // ESC para fechar modal
                if (e.key === 'Escape') {
                    closeModal(modal);
                }
            });
        }
    });
}

// Fechar modal (função auxiliar)
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    restoreFocus();
}

// Anunciar mudanças para leitores de tela
function announceToScreenReader(message) {
    const announcer = document.getElementById('aria-announcer') || createAriaAnnouncer();
    announcer.textContent = message;
    
    // Limpar após alguns segundos
    setTimeout(() => {
        announcer.textContent = '';
    }, 3000);
}

// Criar elemento para anúncios de leitor de tela
function createAriaAnnouncer() {
    const announcer = document.createElement('div');
    announcer.id = 'aria-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    return announcer;
}

// Detectar preferências do sistema
function detectSystemPreferences() {
    // Preferência de reduzir movimento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }
    
    // Preferência de alto contraste
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    if (prefersHighContrast.matches && !localStorage.getItem('preferred-theme')) {
        switchTheme('high-contrast');
    }
    
    // Preferência de modo escuro
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (prefersDark.matches && !localStorage.getItem('preferred-theme')) {
        switchTheme('dark');
    }
}

// Inicializar detecção de preferências do sistema
detectSystemPreferences();