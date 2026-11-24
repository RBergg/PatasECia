const listaAnimais = document.getElementById('lista-animais');
console.log(listaAnimais);
fetch('http://localhost:3000/api/animais')
    .then(resposta => resposta.json())
    .then(animais => {
        console.log(animais);
        animais.forEach(animal => {
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
                celulaDataNascimento.textContent = partes[2] + '/' + partes[1] + '/' + partes[0]
            } else {
                celulaDataNascimento.textContent = ' - ';
            }
            linha.appendChild(celulaDataNascimento);

            const tutor = document.createElement('td');
            tutor.textContent = animal.tutor;
            linha.appendChild(tutor);
            listaAnimais.appendChild(linha);
        });
    });