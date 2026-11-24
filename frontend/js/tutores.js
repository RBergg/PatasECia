const listaTutores = document.getElementById('lista-tutores');
const buscaTutores = document.getElementById('busca-tutores');
const btnNovoTutor = document.getElementById('btn-novo-tutor');
const modalTutor = document.getElementById('modal-tutor');
const btnCancelarTutor = document.getElementById('btn-cancelar-tutor');
const formTutor = document.getElementById('form-tutor');
let tutorEmEdicao = null;


btnNovoTutor.addEventListener('click', () => {
    tutorEmEdicao = null;
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
        ? `http://localhost:3000/api/tutores/${tutorEmEdicao}`
        : 'http://localhost:3000/api/tutores';

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
        celulaAcoes.appendChild(btnEditar);
        btnEditar.addEventListener('click', () => {
            document.getElementById('nome-tutor').value = tutor.nome;
            document.getElementById('telefone-tutor').value = tutor.telefone;
            document.getElementById('email-tutor').value = tutor.email;
            document.getElementById('endereco-tutor').value = tutor.endereco;
            console.log(tutor.id);
            modalTutor.showModal();
            tutorEmEdicao = tutor.id;
        });
        linha.appendChild(celulaAcoes);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'EXCLUIR';
        celulaAcoes.appendChild(btnExcluir);
        btnExcluir.addEventListener('click', () => {
            console.log(tutor.id);
            fetch(`http://localhost:3000/api/tutores/${tutor.id}`, {
                method: 'DELETE'
            })
                .then(resposta => {
                    if (resposta.ok) {
                        const indice = tutoresCadastrados.findIndex(
                            tutorCadastrado => tutorCadastrado.id === tutor.id
                        );
                        tutoresCadastrados.splice(indice, 1);
                        renderizarTutores(tutoresCadastrados)
                    } else {
                        console.log('Não foi possível excluir o tutor.');
                    }
                });
        });

        listaTutores.appendChild(linha);

    });
}

fetch('http://localhost:3000/api/tutores')
    .then(resposta => resposta.json())
    .then(tutores => {
        console.log(tutores);
        tutoresCadastrados.push(...tutores);
        renderizarTutores(tutoresCadastrados);
    });