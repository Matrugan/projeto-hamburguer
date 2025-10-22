document.addEventListener("DOMContentLoaded", () => {
    
    // =======================================
    // ===== MENU HAMBÚRGUER (Principal) =====
    // =======================================
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('header nav');
    const menuOverlay = document.getElementById('menuOverlay'); 
    const header = document.getElementById('siteHeader');

    // Função para abrir/fechar o menu e o overlay
    function toggleMenu() {
        nav.classList.toggle('open');
        menuOverlay.classList.toggle('open');
        
        // Alterna o ícone entre fa-bars e fa-xmark
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    }

    if (menuToggle && nav && menuOverlay) {
        menuToggle.addEventListener('click', toggleMenu);

        // Fechar o menu ao clicar em um link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('open')) {
                    toggleMenu(); 
                }
            });
        });

        // Fechar o menu ao clicar no overlay (fundo escuro)
        menuOverlay.addEventListener('click', toggleMenu);
    }
    
    // --- Scroll Header (Mudar estilo ao rolar) ---
    if (header) {
        window.addEventListener('scroll', ()=>{
            if(window.scrollY > 30){ 
                header.classList.add('scrolled'); 
            } else { 
                header.classList.remove('scrolled'); 
            }
        });
    }

    // =======================================
    // ===== VÍDEO E BOTÃO PLAY (Contato) =====
    // =======================================
    const video = document.getElementById('meuVideo');
    const botaoPlay = document.getElementById('botaoPlay');

    if (video && botaoPlay) {
        // Inicia o vídeo
        botaoPlay.addEventListener('click', () => {
            video.play();
            botaoPlay.style.display = 'none';
        });

        // Clique no vídeo pausa / reproduz
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                botaoPlay.style.display = 'none';
            } else {
                video.pause();
                botaoPlay.style.display = 'flex';
            }
        });

        // Ao terminar, o botão volta
        video.addEventListener('ended', () => {
            botaoPlay.style.display = 'flex';
        });
    }


    // =======================================
    // ===== GALERIA MODAL (Galeria) =====
    // =======================================
    const imagens = document.querySelectorAll(".img-item img");
    const modal = document.getElementById("modalGaleria");
    const imgModal = document.getElementById("imgModal");
    const fecharModal = document.getElementById("fecharModal");

    if (modal) {
        imagens.forEach(img => {
            img.addEventListener("click", () => {
                imgModal.src = img.src;
                modal.style.display = "flex";
            });
        });

        fecharModal.addEventListener("click", () => {
            modal.style.display = "none";
        });

        // Fechar clicando fora do modal
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });

        // Fechar com ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.style.display === "flex") modal.style.display = "none";
        });
    }
});