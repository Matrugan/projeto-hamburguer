document.addEventListener('DOMContentLoaded', () => {
    
    // --- Dados de Produtos (Essencial para o catálogo funcionar) ---
    const PRODUCTS = [
        { id: 1, name: "Classic House", price: 35.50, description: "Our flagship: Brioche bread, 180g house blend, cheddar cheese, bacon, lettuce and special sauce.", image: "imagem/galeria/hamb1.jpg" },
        { id: 2, name: "Veggie Delight", price: 32.00, description: "Chickpea burger, grilled curd cheese, sun-dried tomatoes, arugula and basil mayonnaise.", image: "imagem/order/veggie.png" },
        { id: 3, name: "Double Trouble", price: 48.90, description: "For the hungry: 2 x 180g house blend, prato cheese, caramelized onion and barbecue sauce.", image: "imagem/order/double.jpg" },
        { id: 4, name: "Fritas Rústicas", price: 15.00, description: "Freshly fried rustic potatoes seasoned with sea salt and rosemary.", image: "imagem/order/batata.jpg" },
        { id: 5, name: "Onion Rings", price: 18.00, description: "Crispy onion rings served with homemade ranch dressing.", image: "imagem/order/onionrings.jpg" },
        { id: 6, name: "Milkshake Clássico", price: 22.00, description: "Vanilla, chocolate, or strawberry milkshake. (400ml)", image: "imagem/order/milkshake.jpeg" }
    ];

    // Variáveis e Constantes
    let cart = [];
    const DELIVERY_FEE = 10.00; // Custo de entrega fixo

    // Elementos do DOM
    const productGrid = document.getElementById('productGrid');
    const cartBody = document.getElementById('cartBody');
    const cartTotal = document.getElementById('cartTotal');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartDelivery = document.getElementById('cartDelivery');
    const cartCount = document.getElementById('cartCount');
    const cartEmpty = document.getElementById('cartEmpty');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Elementos do Header (reutilizados do script.js)
    const cartToggleButton = document.getElementById('cartToggle');

    // Funções de Utilitário
    const formatCurrency = (amount) => `R$ ${amount.toFixed(2).replace('.', ',')}`;

    // 0. Renderiza o Catálogo
    const renderProducts = () => {
        productGrid.innerHTML = PRODUCTS.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3 data-product-id="${product.id}">${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="price-container">
                        <span class="price">${formatCurrency(product.price)}</span>
                        <button class="add-to-cart-btn btn-primary" data-product-id="${product.id}">
                            <i class="fa-solid fa-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    };

    // 1. Renderiza o Carrinho (Função principal de atualização da UI)
    const renderCart = () => {
        cartBody.innerHTML = '';
        let subtotal = 0;
        let totalItems = 0;

        // Atualiza status do carrinho vazio/cheio
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
            cartItem.innerHTML = `
                <div class="item-name">${item.name}</div>
                <div class="quantity-controls">
                    <button data-product-id="${item.id}" data-action="decrement">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button data-product-id="${item.id}" data-action="increment">+</button>
                </div>
                <div class="item-price">${formatCurrency(itemTotal)}</div>
                <button class="remove-btn" data-product-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
            `;
            cartBody.appendChild(cartItem);
        });

        const finalTotal = subtotal + (cart.length > 0 ? DELIVERY_FEE : 0);
        
        // Atualiza os totais
        cartSubtotal.textContent = formatCurrency(subtotal);
        cartTotal.textContent = formatCurrency(finalTotal);
        cartCount.textContent = totalItems;
        
        // Salva o carrinho no localStorage (opcional, mas bom para persistência)
        localStorage.setItem('burgerHouseCart', JSON.stringify(cart));
    };

    // 2. Adiciona Item ao Carrinho
    const addToCart = (productId) => {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ 
                id: productId, 
                name: product.name, 
                price: product.price, 
                quantity: 1 
            });
        }
        renderCart();
    };

    // 3. Atualiza Quantidade
    const updateQuantity = (productId, action) => {
        const item = cart.find(i => i.id === productId);
        if (!item) return;

        if (action === 'increment') {
            item.quantity += 1;
        } else if (action === 'decrement') {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                removeFromCart(productId);
                return;
            }
        }
        renderCart();
    };

    // 4. Remove Item do Carrinho
    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    };

    // 5. Event Listeners para Adicionar Produto
    productGrid.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const productId = parseInt(e.target.closest('.add-to-cart-btn').dataset.productId);
            addToCart(productId);
        }
    });

    // 6. Event Listeners para Alterar/Remover do Carrinho
    cartBody.addEventListener('click', (e) => {
        const target = e.target;
        const productId = parseInt(target.dataset.productId || target.closest('button')?.dataset.productId);

        if (target.closest('.remove-btn')) {
            removeFromCart(productId);
        } else if (target.dataset.action === 'increment' || target.dataset.action === 'decrement') {
            updateQuantity(productId, target.dataset.action);
        }
    });
    
    // 7. Função de Checkout (Geração de Link WhatsApp)
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
        message += "\n\nAguardando confirmação de endereço/pagamento. Por favor, inclua seu endereço completo.";

        // URL ENCODING para o link do WhatsApp
        const encodedMessage = encodeURIComponent(message);
        
        // Substitua '5511999999999' pelo seu número de WhatsApp
        const whatsappNumber = '5511999999999'; 
        
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Abre o link do WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Opcional: Limpar o carrinho após o checkout
        // cart = []; 
        // renderCart();
    });
    
    // --- Inicialização ---
    // Tenta carregar o carrinho do localStorage ao iniciar
    const savedCart = localStorage.getItem('burgerHouseCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    renderProducts(); // Cria os cards de produtos
    renderCart();     // Renderiza o carrinho inicial
});