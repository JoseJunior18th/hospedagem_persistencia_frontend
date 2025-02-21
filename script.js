loadDataTotal();
loadDescription();

const atividades = {
    ensino: {
        "Estágio extracurricular": { aproveitamento: 0.7, maxHoras: 40 },
        "Monitoria": { aproveitamento: 0.7, maxHoras: 40 },
        "Concursos e campeonatos": { aproveitamento: 0.7, maxHoras: 50 },
        "Presença a defesas de TCC": { aproveitamento: 0.5, maxHoras: 3 },
        "Cursos profissionalizantes específicos": { aproveitamento: 0.8, maxHoras: 40 },
        "Cursos profissionalizantes em geral": { aproveitamento: 0.2, maxHoras: 10 }
    },
    extensao: {
        "Projeto de extensão": { aproveitamento: 0.1, maxHoras: 40 },
        "Atividades culturais": { aproveitamento: 0.8, maxHoras: 5 },
        "Visitas técnicas": { aproveitamento: 1.0, maxHoras: 40 },
        "Visitas a feiras e exposições": { aproveitamento: 0.2, maxHoras: 5 },
        "Cursos de idiomas": { aproveitamento: 0.6, maxHoras: 20 },
        "Palestras, seminários e congressos - ouvinte": { aproveitamento: 0.8, maxHoras: 10 },
        "Palestras, seminários e congressos - apresentador": { aproveitamento: 1.0, maxHoras: 15 },
        "Projeto empresa júnior": { aproveitamento: 0.2, maxHoras: 20 }
    },
    pesquisa: {
        "Iniciação científica": { aproveitamento: 0.8, maxHoras: 40 },
        "Publicação de artigos em periódicos científicos": { aproveitamento: 1.0, maxHoras: 10 },
        "Publicação de artigos completos em anais de congressos": { aproveitamento: 1.0, maxHoras: 7 },
        "Publicação de capítulo de livro": { aproveitamento: 1.0, maxHoras: 7 },
        "Publicação de resumos de artigos em anais": { aproveitamento: 1.0, maxHoras: 5 },
        "Registro de patentes como auto/coautor": { aproveitamento: 1.0, maxHoras: 40 },
        "Premiação resultante de pesquisa científica": { aproveitamento: 1.0, maxHoras: 10 },
        "Colaborar em atividades como seminários e congressos": { aproveitamento: 1.0, maxHoras: 10 },
        "Palestras, seminários e congressos de pesquisas - ouvinte": { aproveitamento: 0.8, maxHoras: 10 },
        "Palestras, seminários e congressos de pesquisas - apresentador": { aproveitamento: 1.0, maxHoras: 15 }
    }
};

let totais = { ensino: 0, extensao: 0, pesquisa: 0 };


async function loadDataTotal() {
    console.log("Reqiest feito")
    const url_request = "http://18.230.95.142:3030/query-sum";
    try {
        const response = await axios.get(url_request);
        if (response.data) {
            // console.log(response.data);
            response.data.forEach(element => {
                totais[element.categoria] = parseFloat(element.total_horas_aproveitadas);
                document.getElementById(`total${element.categoria.charAt(0).toUpperCase() + element.categoria.slice(1)}`).textContent = totais[element.categoria];
            });
        }
        console.log(totais)
    } catch (error) {
        console.log("Flaha ao carregar dados");
    }
}

async function loadDescription(){
    const url_request = "http://18.230.95.142:3030/query-descriptions";
    try {
        const response = await axios.get(url_request);
        if (response.data) {
            const tabelaAtividades = document.getElementById("tabelaAtividades");
            console.log(response.data)
    
            response.data.forEach(element => {
                Object.entries(element).forEach(([key, value]) => {
                    console.log(key)
                    const linha = document.createElement("tr");
                    const descricaoTd = document.createElement("td");
                    descricaoTd.textContent = key;
                    const horasTd = document.createElement("td");
                    horasTd.textContent = parseFloat(value).toFixed(2);
                    linha.appendChild(descricaoTd);
                    linha.appendChild(horasTd);
                    tabelaAtividades.appendChild(linha);
                })
            })

        }
    } catch(error){
        console.log("erro carregar descrições");
    }
}

function atualizarClassificacoes() {
    const categoria = document.getElementById("categoria").value;
    console.log(categoria);
    const classificacaoSelect = document.getElementById("classificacao");
    classificacaoSelect.innerHTML = "";
    if (categoria && atividades[categoria]) {
        for (let key in atividades[categoria]) {
            let option = document.createElement("option");
            option.value = key;
            option.textContent = key;
            classificacaoSelect.appendChild(option);
        }
    }
}

function cadastrarAtividade() {
    const categoria = document.getElementById("categoria").value;
    const classificacao = document.getElementById("classificacao").value;
    const descricao = document.getElementById("descricao").value;
    const horas = parseInt(document.getElementById("horas").value);
    const { aproveitamento, maxHoras } = atividades[categoria][classificacao];
    const horasAproveitadas = Math.min(horas * aproveitamento, maxHoras);
    
    if (totais[categoria] + horasAproveitadas > 90) {
        document.getElementById("erro").textContent = "Erro: Limite de 90 horas por categoria excedido!";
        return;
    }
    
    totais[categoria] += horasAproveitadas;
    document.getElementById(`total${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`).textContent = totais[categoria];

    const data = {
        "categoria": categoria,
        "classificacao": classificacao,
        "descricao": descricao,
        "horas": horas,
        "horasAproveitadas": horasAproveitadas
    }
    saveData(data);
    
    
    const tabelaAtividades = document.getElementById("tabelaAtividades");
    const linha = document.createElement("tr");
    const descricaoTd = document.createElement("td");
    descricaoTd.textContent = descricao;
    const horasTd = document.createElement("td");
    horasTd.textContent = horasAproveitadas.toFixed(2); // Exibe a quantidade de horas aproveitadas com 2 casas decimais
    linha.appendChild(descricaoTd);
    linha.appendChild(horasTd);
    tabelaAtividades.appendChild(linha);
}


async function saveData(data){
    const url_request = "http://18.230.95.142:3030/save-activities";
    const response = await axios.post(url_request, data);
    console.log(response);

}
