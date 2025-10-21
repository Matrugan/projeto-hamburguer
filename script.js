    const header = document.getElementById('siteHeader');
    window.addEventListener('scroll', ()=>{
      if(window.scrollY > 30){ header.classList.add('scrolled'); } else { header.classList.remove('scrolled'); }
    });

    // Play video overlay
    const botaoPlay = document.getElementById('botaoPlay');
    const video = document.getElementById('meuVideo');
    botaoPlay.addEventListener('click', ()=>{
      if(video.paused){ video.play(); botaoPlay.style.display='none'; }
      else{ video.pause(); botaoPlay.style.display='flex'; }
    });

    // Gallery modal
    const items = document.querySelectorAll('.img-item');
    const modal = document.getElementById('modalGaleria');
    const imgModal = document.getElementById('imgModal');
    const fechar = document.getElementById('fecharModal');

    items.forEach(it=>{
      it.addEventListener('click', ()=>{
        const src = it.querySelector('img').src; imgModal.src = src; modal.style.display='flex';
      });
    });
    fechar.addEventListener('click', ()=>{ modal.style.display='none'; imgModal.src=''; });
    modal.addEventListener('click',(e)=>{ if(e.target===modal) modal.style.display='none'; });

    // ensure header stays on top (in case embedded elements use z-index)
    document.addEventListener('DOMContentLoaded', ()=>{ header.style.zIndex = 9999; });