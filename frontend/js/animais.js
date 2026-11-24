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

            const celulaDataNascmento = document.createElement('td');
            celulaDataNascmento.textContent = animal.data_nascimento || ' - ';
            linha.appendChild(celulaDataNascmento);

            const tutor = document.createElement('td');
            tutor.textContent = animal.tutor;
            linha.appendChild(tutor);
            listaAnimais.appendChild(linha);
        });
    });