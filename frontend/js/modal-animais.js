const janelaModal = document.getElementById('modal-animais');
const nomeDoTutor = document.getElementById('nome-tutor-selecionado');
const listaDeAnimais = document.getElementById('lista-animais-tutor');
const btnFechar = document.getElementById('btn-fechar-modal-animais');

btnFechar.addEventListener('click', () => {
    janelaModal.close();
});

const btnCadastrarAnimal = document.getElementById('btn-cadastrar-animal-modal');
let tutorSelecionado = null;


function abrirModalAnimais(tutor) {
    tutorSelecionado = tutor;
    listaDeAnimais.innerHTML = '';
    nomeDoTutor.textContent = tutor.nome;
    janelaModal.showModal();


    fetch(`${API_URL}/animais`)
        .then(resposta => resposta.json())
        .then(animais => {
            const animaisDoTutor = animais.filter(
                animal => animal.tutor_id === tutor.id

            );
            if (animaisDoTutor.length === 0) {
                listaDeAnimais.textContent = 'Este tutor ainda não possui animais cadastrados.';
                return;
            }
            animaisDoTutor.forEach(animal => {
                const itemAnimal = document.createElement('div');
                itemAnimal.classList.add('item-animal');

                const tituloAnimal = document.createElement('h3');
                tituloAnimal.textContent = animal.nome;

                const btnEditar = document.createElement('button');
                btnEditar.classList.add('btn-editar');
                btnEditar.textContent = 'EDITAR';

                btnEditar.addEventListener('click', () => {
                    window.location.href = `animais.html?editar=${animal.id}&tutor=${tutor.id}`;
                });

                itemAnimal.appendChild(tituloAnimal);
                itemAnimal.appendChild(btnEditar);

                listaDeAnimais.appendChild(itemAnimal);
            });

        });
}
btnCadastrarAnimal.addEventListener('click', () => {
    window.location.href = `animais.html?tutor=${tutorSelecionado.id}`;
});

window.abrirModalAnimais = abrirModalAnimais;