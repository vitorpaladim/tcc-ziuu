// abrido e aberto menu

const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const menu = document.querySelector("nav .container ul");

//slidebar abrido

menuBtn.addEventListener('click', () =>{
    menu.style.display = 'block';
    menuBtn.style.display = 'none';
    closeBtn.style.display = 'inline-block'
})

closeBtn.addEventListener('click', () =>{
    menu.style.display = 'none';
    closeBtn.style.display = 'none';
    menuBtn.style.display = 'inline-block'
}
)
// Função para animar elementos ao rolar para baixo
        function handleScrollAnimation() {
            var elements = document.querySelectorAll('.animated');
            elements.forEach(function(element) {
                if (isElementInViewport(element)) {
                    element.classList.add('visible');
                }
            });
        }

        // Verifica se o elemento está visível na janela de visualização
        function isElementInViewport(el) {
            var rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        // Adiciona um evento de rolagem para acionar a animação
        window.addEventListener('scroll', handleScrollAnimation);

        // Executa a animação inicial ao carregar a página
        window.addEventListener('load', function() {
            handleScrollAnimation();
        });