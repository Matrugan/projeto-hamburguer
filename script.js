// --- MENU HAMBURGUER (Corrigido e Consolidado) ---
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

menuToggle.addEventListener('click', toggleMenu);

// Fechar o menu ao clicar em um link (para rolagem suave)
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    // Fecha o menu apenas se estiver aberto (para não interferir no desktop)
    if (nav.classList.contains('open')) {
      toggleMenu(); 
    }
  });
});

// Fechar o menu ao clicar no overlay
menuOverlay.addEventListener('click', toggleMenu);
  
// --- Scroll Header (Mudar estilo ao rolar) ---
window.addEventListener('scroll', ()=>{
  if(window.scrollY > 30){ 
    header.classList.add('scrolled'); 
  } else { 
    header.classList.remove('scrolled'); 
  }
});

// --- Play video overlay ---
const botaoPlay = document.getElementById('botaoPlay');
const video = document.getElementById('meuVideo');

if (botaoPlay && video) { // Verifica se os elementos existem antes de adicionar o listener
    botaoPlay.addEventListener('click', ()=>{
      if(video.paused){ 
        video.play(); 
        botaoPlay.style.display='none'; 
      }
      else{ 
        video.pause(); 
        botaoPlay.style.display='flex'; 
      }
    });
}


// --- Gallery modal ---
const items = document.querySelectorAll('.img-item');
const modal = document.getElementById('modalGaleria');
const imgModal = document.getElementById('imgModal');
const fechar = document.getElementById('fecharModal');

items.forEach(it=>{
  it.addEventListener('click', ()=>{
    const src = it.querySelector('img').src; 
    imgModal.src = src; 
    modal.style.display='flex';
  });
});
fechar.addEventListener('click', ()=>{ 
  modal.style.display='none'; 
  imgModal.src=''; 
});
modal.addEventListener('click',(e)=>{ 
  if(e.target===modal) 
    modal.style.display='none'; 
});

// --- Ajuste final de z-index do header ---
document.addEventListener('DOMContentLoaded', ()=>{ 
  header.style.zIndex = 9999; 
});