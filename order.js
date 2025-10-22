// --- MENU HAMBURGUER ---
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('header nav');
const menuOverlay = document.getElementById('menuOverlay'); 

// Função para abrir/fechar o menu e o overlay
function toggleMenu() {
    nav.classList.toggle('open');
    menuOverlay.classList.toggle('open');
    
    // Opcional: Alterna o ícone entre fa-bars e fa-xmark
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
}

// Abre/fecha o menu ao clicar no botão
menuToggle.addEventListener('click', toggleMenu);

// Fecha o menu ao clicar em um link (para rolagem suave ou navegação)
nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        // Fecha o menu apenas se estiver aberto (para não interferir no desktop)
        if (nav.classList.contains('open')) {
            toggleMenu(); 
        }
    });
});

// Fecha o menu ao clicar no overlay
menuOverlay.addEventListener('click', toggleMenu);

document.addEventListener('DOMContentLoaded', () => {
    // Variável para armazenar o carrinho
    let cart = [];
    const DELIVERY_FEE = 10.00; // Custo de entrega fixo

    // Elementos do DOM
    const productGrid = document.getElementById('productGrid');
    const cartBody = document.getElementById('cartBody');
    const cartTotal = document.getElementById('cartTotal');
    const cartSubtotal = document.getElementById('cartSubtotal'); // Novo
    const cartDelivery = document.getElementById('cartDelivery'); // Novo
    const cartCount = document.getElementById('cartCount');
    const cartEmpty = document.getElementById('cartEmpty');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Funções de Utilitário
    const formatCurrency = (amount) => `R$ ${amount.toFixed(2).replace('.', ',')}`;

    // 1. Renderiza o Carrinho (Função principal de atualização da UI)
    const renderCart = () => {
        cartBody.innerHTML = '';
        let subtotal = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            checkoutBtn.disabled = true;
            cartDelivery.textContent = formatCurrency(0); 
        } else {
            cartEmpty.style.display = 'none';
            checkoutBtn.disabled = false;
            cartDelivery.textContent = formatCurrency(DELIVERY_FEE); 
        }

        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            totalItems += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            // CORREÇÃO: Garante que item.name seja renderizado na div item-name
            cartItem.innerHTML = `
                <div class="item-details">
                    <div class="item-name">${item.name}</div> 
                    <div class="item-price">${formatCurrency(itemTotal)}</div>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn decrease" data-product-id="${item.id}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="qty-btn increase" data-product-id="${item.id}">+</button>
                </div>
                <button class="remove-btn" data-product-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
            `;
            
            cartBody.appendChild(cartItem);
        });

        // Atualiza os totais
        const finalTotal = subtotal + (cart.length > 0 ? DELIVERY_FEE : 0);
        cartSubtotal.textContent = formatCurrency(subtotal);
        cartTotal.textContent = formatCurrency(finalTotal);
        cartCount.textContent = totalItems;
    };

    // 2. Adicionar Item ao Carrinho
    const addToCart = (productId) => {
        // Encontra o item no catálogo (para obter nome e preço)
        // Certifica-se de que estamos pegando o card correto
        const productCard = productGrid.querySelector(`.product-card [data-product-id="${productId}"]`).closest('.product-card');
        if (!productCard) return;

        // O nome do produto é puxado do <h3> do card - Seletor validado pelo HTML
        const name = productCard.querySelector('h3').textContent;
        const priceText = productCard.querySelector('.price').textContent.replace('R$', '').replace(',', '.').trim();
        const price = parseFloat(priceText);

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: productId, name, price, quantity: 1 });
        }

        renderCart();
    };

    // 3. Atualizar Quantidade do Item
    const updateQuantity = (productId, change) => {
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;

            // Remove o item se a quantidade for 0 ou menos
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
        }
        renderCart();
    };

    // 4. Remover Item do Carrinho
    const removeItem = (productId) => {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
        }
        renderCart();
    };

    // 5. Listener para Botões "Adicionar" no Catálogo
    productGrid.addEventListener('click', (e) => {
        const target = e.target.closest('.add-to-cart-btn');
        if (target) {
            const productId = parseInt(target.dataset.productId);
            addToCart(productId);
        }
    });
    
    // 6. Listener para Botões de Controle de Quantidade e Remoção no Carrinho
    cartBody.addEventListener('click', (e) => {
        const target = e.target.closest('.qty-btn, .remove-btn');
        if (!target) return;

        const productId = parseInt(target.dataset.productId);

        if (target.classList.contains('increase')) {
            updateQuantity(productId, 1);
        } else if (target.classList.contains('decrease')) {
            updateQuantity(productId, -1);
        } else if (target.classList.contains('remove-btn')) {
            removeItem(productId);
        }
    });
    
    // 7. Função de Checkout aprimorada (Geração de Link WhatsApp)
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const finalTotal = subtotal + DELIVERY_FEE;
        
        let message = "Olá, gostaria de fazer um pedido na Burger House! \n\n*Meu Pedido:*\n";
        
        cart.forEach(item => {
            message += `\n- ${item.name} (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}`;
        });
        
        message += "\n\n---";
        message += `\nSubtotal: ${formatCurrency(subtotal)}`;
        message += `\nEntrega: ${formatCurrency(DELIVERY_FEE)}`;
        message += `\n*TOTAL: ${formatCurrency(finalTotal)}*`;
        message += "\n---";
        message += "\n\nAguardando confirmação de endereço/pagamento.";

        // URL ENCODING para o link do WhatsApp
        const encodedMessage = encodeURIComponent(message);
        
        // Substitua '55' + 'DDD' + 'NUMERO' pelo seu número de WhatsApp
        const whatsappNumber = '5511999999999'; 
        
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        
        // Limpar o carrinho após o checkout
        cart = [];
        renderCart();
    });

    // Renderiza o carrinho na inicialização
    renderCart();
});