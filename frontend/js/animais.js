const listaAnimais = document.getElementById('lista-animais');
const selectTutorAnimal = document.getElementById('tutor-animal');
const btnNovoAnimal = document.getElementById('btn-novo-animal');
btnNovoAnimal.classList.add('btn-cadastrar');
const modalAnimal = document.getElementById('modal-animal');
const btnCancelarAnimal = document.getElementById('btn-cancelar-animal');
const formAnimal = document.getElementById('form-animal');
const btnSalvarAnimal = formAnimal.querySelector('button[type="submit"]');
const parametrosURL = new URLSearchParams(window.location.search);
const idAnimalParaEditar = parametrosURL.get('editar');
const idTutorOrigem = parametrosURL.get('tutor');
const animaisCadastrados = [];
let animalEmEdicao = null;
console.log(listaAnimais);

btnNovoAnimal.addEventListener('click', () => {
    formAnimal.reset();
    animalEmEdicao = null;
    btnSalvarAnimal.textContent = 'Cadastrar';
    btnSalvarAnimal.classList.replace('btn-editar', 'btn-cadastrar');
    modalAnimal.showModal()
});

btnCancelarAnimal.addEventListener('click', () => {
    modalAnimal.close()
});

formAnimal.addEventListener('submit', (event) => {
    console.log('Formulário enviado!');
    event.preventDefault()
    const nome = document.getElementById('nome-animal').value;
    console.log(nome)
    const especie = document.getElementById('especie-animal').value;
    console.log(especie)
    const raca = document.getElementById('raca-animal').value;
    console.log(raca)
    const dataInformada = document.getElementById('dataNascimento-animal').value;
    const data_nascimento = dataInformada ? dataInformada : null;
    console.log(data_nascimento)
    const tutor_id = selectTutorAnimal.value
    console.log(tutor_id)

    const animal = {
        nome,
        especie,
        raca,
        data_nascimento,
        tutor_id
    };
    const url = animalEmEdicao !== null
        ? `${API_URL}/animais/${animalEmEdicao}`
        : `${API_URL}/animais`;

    const metodo = animalEmEdicao !== null
        ? 'PUT'
        : 'POST';
    console.log(animal);

    fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(animal)
    })
        .then(resposta => {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log('Algo deu errado');
            }
        })
        .then(novoAnimal => {


            if (animalEmEdicao === null) {
                animaisCadastrados.push(novoAnimal);
                renderizarAnimais(animaisCadastrados);
            } else {
                const indice = animaisCadastrados.findIndex(
                    animal => animal.id === animalEmEdicao
                );
                animaisCadastrados[indice] = novoAnimal;
                renderizarAnimais(animaisCadastrados);

            }
            modalAnimal.close();
        });

});
function renderizarAnimais(lista) {
    listaAnimais.innerHTML = '';
    lista.forEach(animal => {
        const linha = document.createElement('tr');
        const celulaNome = document.createElement('td');
        celulaNome.textContent = animal.nome;
        linha.appendChild(celulaNome);

        const celulaEspecie = document.createElement('td');
        celulaEspecie.textContent = animal.especie;
        linha.appendChild(celulaEspecie);

        const celulaRaca = document.createElement('td');
        celulaRaca.textContent = animal.raca || ' - ';
        linha.appendChild(celulaRaca);

        const celulaDataNascimento = document.createElement('td');
        if (animal.data_nascimento) {
            const data = animal.data_nascimento.slice(0, 10);
            const partes = data.split('-');
            celulaDataNascimento.textContent = partes[2] + '/' + partes[1] + '/' + partes[0];
        } else {
            celulaDataNascimento.textContent = ' - ';
        }
        linha.appendChild(celulaDataNascimento);

        const tutor = document.createElement('td');
        tutor.textContent = animal.tutor;
        linha.appendChild(tutor);

        const celulaAcoes = document.createElement('td');
        const btnEditar = document.createElement('button');
        btnEditar.classList.add('btn-editar');
        btnEditar.textContent = 'EDITAR';
        celulaAcoes.appendChild(btnEditar);
        btnEditar.addEventListener('click', () => {
            editarAnimal(animal);
        });
        linha.appendChild(celulaAcoes);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'EXCLUIR';
        celulaAcoes.appendChild(btnExcluir);
        btnExcluir.classList.add('btn-excluir');
        btnExcluir.addEventListener('click', () => {
            const confirmarExclusao = confirm(
                `Deseja mesmo excluir o animal ${animal.nome}?`
            );

            if (!confirmarExclusao) {
                return;
            }

            console.log(animal.id);

            fetch(`${API_URL}/animais/${animal.id}`, {
                method: 'DELETE'
            })
                .then(resposta => {
                    if (resposta.ok) {
                        const indice = animaisCadastrados.findIndex(
                            animalCadastrado => animalCadastrado.id === animal.id
                        );
                        animaisCadastrados.splice(indice, 1);
                        renderizarAnimais(animaisCadastrados);
                    } else {
                        console.log('Não foi possível excluir o animal.');
                    }
                });
        });

        listaAnimais.appendChild(linha);
    });
}

function editarAnimal(animal) {
    document.getElementById('nome-animal').value = animal.nome;
    document.getElementById('especie-animal').value = animal.especie;
    document.getElementById('raca-animal').value = animal.raca;

    if (animal.data_nascimento === null) {
        document.getElementById('dataNascimento-animal').value = '';
    } else {
        document.getElementById('dataNascimento-animal').value = animal.data_nascimento.slice(0, 10);
    }
    selectTutorAnimal.value = animal.tutor_id;
    animalEmEdicao = animal.id;
    btnSalvarAnimal.textContent = 'Salvar';
    btnSalvarAnimal.classList.replace('btn-cadastrar', 'btn-editar');
    modalAnimal.showModal();
}


fetch(`${API_URL}/tutores`)
    .then(resposta => resposta.json())
    .then(tutores => {
        tutores.forEach(tutor => {
            const opcao = document.createElement('option');
            opcao.value = tutor.id;
            opcao.textContent = tutor.nome;
            selectTutorAnimal.appendChild(opcao);
        });
        if (idTutorOrigem) {
            selectTutorAnimal.value = idTutorOrigem;
        }

        return fetch(`${API_URL}/animais`);
    })
    .then(resposta => resposta.json())
    .then(animais => {
        animaisCadastrados.push(...animais);
        renderizarAnimais(animaisCadastrados);
        if (idAnimalParaEditar) {
            const animalEncontrado = animaisCadastrados.find(
                animal => animal.id === Number(idAnimalParaEditar)
            );

            if (animalEncontrado) {
                editarAnimal(animalEncontrado);
            }
        } else if (idTutorOrigem) {
            formAnimal.reset();
            animalEmEdicao = null;
            selectTutorAnimal.value = idTutorOrigem;
            btnSalvarAnimal.textContent = 'Cadastrar';
            modalAnimal.showModal();
        }
    });
