//-- ================= JS MENU ================= -->

const menu = document.querySelector('.menu');

window.addEventListener('scroll', () => {
    if (window.scrollY === 0) {
        menu.classList.remove('menu--overlay');
        menu.classList.add('menu--top');
    } else {
        menu.classList.remove('menu--top');
        menu.classList.add('menu--overlay');
    }
});


//-- ================= JS DARK MODE ================= -->

const toggle = document.getElementById('btn-dark-mode');
const body = document.body;

toggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});

//================== JS ANIMACIONES ==================

  //Operador ternario, para que parpadear suavemente el texto de la autor
  const autor = document.getElementById('autor');
  console.log(autor);
  if(autor){
	let encendido = false;
	setInterval(() =>{
		//Interuptor on/of
		encendido = !encendido;
		autor.style.transition = "color 0.35s ease";
		autor.style.color = encendido ? "#100cf7" : "oklch(0.446 0.03 256.802)";
	}, 1200);
   }


