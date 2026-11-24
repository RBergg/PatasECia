const listaTutores = document.getElementById('lista-tutores');
console.log(listaTutores);
fetch('http://localhost:3000/api/tutores')
    .then(resposta => resposta.json())
    .then(tutores => {
        console.log(tutores);
        tutores.forEach(tutor => {
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
            listaTutores.appendChild(linha);

        });
    });