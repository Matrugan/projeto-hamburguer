document.addEventListener("DOMContentLoaded", () => {
  // ===== GALERIA =====
  const imagens = document.querySelectorAll(".img-item img");
  const modal = document.getElementById("modalGaleria");
  const imgModal = document.getElementById("imgModal");
  const fecharModal = document.getElementById("fecharModal");

  imagens.forEach(img => {
    img.addEventListener("click", () => {
      imgModal.src = img.src;
      modal.style.display = "flex";
    });
  });

  fecharModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Fechar clicando fora
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // Fechar com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.style.display = "none";
  });

  // ===== VÍDEO =====
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

  // ===== MENU HAMBÚRGUER =====
  const menuIcon = document.getElementById('menu-icon');
  const mobileNav = document.getElementById('mobile-nav');
  const navLinks = mobileNav.querySelectorAll('a');

  if (menuIcon && mobileNav) {
    menuIcon.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      // Opcional: Alternar ícone (hambúrguer <-> X)
      if (mobileNav.classList.contains('open')) {
          menuIcon.classList.replace('fa-bars', 'fa-xmark');
      } else {
          menuIcon.classList.replace('fa-xmark', 'fa-bars');
      }
    });

    // Fechar o menu ao clicar em um link (para rolagem suave)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuIcon.classList.replace('fa-xmark', 'fa-bars');
      });
    });
  }
});