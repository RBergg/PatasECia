const listaTutores = document.getElementById('lista-tutores');
const buscaTutores = document.getElementById('busca-tutores');
const btnNovoTutor = document.getElementById('btn-novo-tutor');
btnNovoTutor.classList.add('btn-cadastrar');
const modalTutor = document.getElementById('modal-tutor');
const btnCancelarTutor = document.getElementById('btn-cancelar-tutor');
const formTutor = document.getElementById('form-tutor');
const btnSalvarTutor = formTutor.querySelector('button[type="submit"]');
const campoTelefoneTutor = document.getElementById('telefone-tutor');
const tituloModalTutor = document.getElementById('titulo-modal-tutor');
let tutorEmEdicao = null;

campoTelefoneTutor.addEventListener('input', () => {
    let numeros = campoTelefoneTutor.value.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 2) {
        campoTelefoneTutor.value = numeros ? `(${numeros}` : '';
    } else if (numeros.length <= 6) {
        campoTelefoneTutor.value = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    } else if (numeros.length <= 10) {
        campoTelefoneTutor.value = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    } else {
        campoTelefoneTutor.value = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }
});

btnNovoTutor.addEventListener('click', () => {
    formTutor.reset();
    tutorEmEdicao = null;
    tituloModalTutor.textContent = 'Cadastrar tutor';
    btnSalvarTutor.textContent = 'Cadastrar';
    btnSalvarTutor.classList.replace('btn-editar', 'btn-cadastrar');
    modalTutor.showModal()
});

btnCancelarTutor.addEventListener('click', () => {
    modalTutor.close()
});

formTutor.addEventListener('submit', (event) => {
    console.log('Formulário enviado!');
    event.preventDefault()
    const nome = document.getElementById('nome-tutor').value;
    console.log(nome)
    const telefone = document.getElementById('telefone-tutor').value;
    console.log(telefone)
    const email = document.getElementById('email-tutor').value;
    console.log(email)
    const endereco = document.getElementById('endereco-tutor').value;
    console.log(endereco)

    const tutor = {
        nome,
        telefone,
        email,
        endereco
    };
    const url = tutorEmEdicao !== null
        ? `${API_URL}/tutores/${tutorEmEdicao}`
        : `${API_URL}/tutores`;

    const metodo = tutorEmEdicao !== null
        ? 'PUT'
        : 'POST';
    console.log(tutor);

    fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tutor)
    })
        .then(resposta => {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log('Algo deu errado');
            }
        })
        .then(novoTutor => {


            if (tutorEmEdicao === null) {
                tutoresCadastrados.push(novoTutor);
                renderizarTutores(tutoresCadastrados);
            } else {
                const indice = tutoresCadastrados.findIndex(
                    tutor => tutor.id === tutorEmEdicao
                );
                tutoresCadastrados[indice] = novoTutor;
                renderizarTutores(tutoresCadastrados);

            }
            modalTutor.close();
        });

});


buscaTutores.addEventListener('input', () => {
    console.log('Digitando...')
    const termoBusca = buscaTutores.value.toLowerCase();

    const tutoresFiltrados = tutoresCadastrados.filter(tutor => {
        return tutor.nome.toLowerCase().includes(termoBusca)
    });
    renderizarTutores(tutoresFiltrados);
});
const tutoresCadastrados = [];
console.log(listaTutores);

function renderizarTutores(lista) {
    listaTutores.innerHTML = '';
    lista.forEach(tutor => {
        const linha = document.createElement('tr');
        const celulaNome = document.createElement('td');
        celulaNome.textContent = tutor.nome;
        linha.appendChild(celulaNome);

        const celulaTelefone = document.createElement('td');
        celulaTelefone.textContent = tutor.telefone;
        linha.appendChild(celulaTelefone);

        const celulaEmail = document.createElement('td');
        celulaEmail.textContent = tutor.email || ' - ';
        linha.appendChild(celulaEmail);

        const celulaEndereco = document.createElement('td');
        celulaEndereco.textContent = tutor.endereco || ' - ';
        linha.appendChild(celulaEndereco);

        const celulaAcoes = document.createElement('td');
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'EDITAR';
        btnEditar.classList.add('btn-editar');
        celulaAcoes.appendChild(btnEditar);
        btnEditar.addEventListener('click', () => {
            document.getElementById('nome-tutor').value = tutor.nome;
            document.getElementById('telefone-tutor').value = tutor.telefone;
            document.getElementById('email-tutor').value = tutor.email;
            document.getElementById('endereco-tutor').value = tutor.endereco;
            console.log(tutor.id);
            tutorEmEdicao = tutor.id;
            tituloModalTutor.textContent = 'Editar tutor';
            btnSalvarTutor.textContent = 'Salvar';
            btnSalvarTutor.classList.replace('btn-cadastrar', 'btn-editar');
            modalTutor.showModal();
        });
        linha.appendChild(celulaAcoes);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'EXCLUIR';
        btnExcluir.classList.add('btn-excluir');
        celulaAcoes.appendChild(btnExcluir);
        btnExcluir.addEventListener('click', () => {
            const confirmarExclusao = confirm(
                `Deseja mesmo excluir o tutor ${tutor.nome}?`
            );

            if (!confirmarExclusao) {
                return;
            }

            console.log(tutor.id);

            fetch(`${API_URL}/tutores/${tutor.id}`, {
                method: 'DELETE'
            })
                .then(resposta => {
                    if (resposta.ok) {
                        const indice = tutoresCadastrados.findIndex(
                            tutorCadastrado => tutorCadastrado.id === tutor.id
                        );

                        tutoresCadastrados.splice(indice, 1);
                        renderizarTutores(tutoresCadastrados);
                    } else if (resposta.status === 409) {
                        alert('Não foi possível excluir este tutor porque ele possui animais cadastrados.');
                    } else {
                        alert('Ocorreu um erro ao tentar excluir o tutor.');
                    }
                });
        });;

        const btnVerAnimais = document.createElement('button');
        btnVerAnimais.textContent = 'VER ANIMAIS';
        btnVerAnimais.classList.add('btn-ver-animais');
        celulaAcoes.appendChild(btnVerAnimais);
        btnVerAnimais.addEventListener('click', () => {
            window.abrirModalAnimais(tutor);
        })

        listaTutores.appendChild(linha);

    });
}

fetch(`${API_URL}/tutores`)
    .then(resposta => resposta.json())
    .then(tutores => {
        console.log(tutores);
        tutoresCadastrados.push(...tutores);
        renderizarTutores(tutoresCadastrados);
    });