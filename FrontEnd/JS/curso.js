// Função de adicionar disciplina feita pelas alunas - Ana Júlia e Sofia de Sousa 

// Seleciona elementos do formulário e tabela
const form = document.querySelector('form');
const tbody = document.querySelector('table tbody');

function adicionarCurso(instituicao, nome, periodo, codigo) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${instituicao}</td>
    <td>${nome}</td>
    <td>${periodo}</td>
    <td>${codigo}</td>
    <td>
      <button class="edit">Editar</button>
      <button class="delete">Excluir</button>
    </td>
  `;

  // Adiciona eventos aos botões da linha
  tr.querySelector('.delete').addEventListener('click', () => {
    tr.remove(); // Remove a linha da tabela
  });

  tr.querySelector('.edit').addEventListener('click', () => {
    // Preenche o formulário com os dados da linha para edição
    document.getElementById('instituicao').value = instituicao;
    document.getElementById('nome').value = nome;
    document.getElementById('periodo').value = periodo;
    document.getElementById('codigo').value = codigo;

    // Remove a linha antiga (vai substituir ao salvar)
    tr.remove();
  });

  tbody.appendChild(tr); // Adiciona a linha na tabela
}

// Busca no servidor todos os cursos e mostra todos na tabela
async function carregarCursos() {
  try {
    const resposta = await fetch('/listar-cursos');
    if (!resposta.ok) {
      throw new Error('Erro ao buscar cursos no servidor.');
    }

    const cursos = await resposta.json();

    // Limpa a tabela antes de preencher de novo
    tbody.innerHTML = '';

    cursos.forEach((curso) => {
      // No back-end, getAllCursos devolve: Instituicao, Nome, Periodo, ID
      adicionarCurso(curso.Instituicao, curso.Nome, curso.Periodo, curso.ID);
    });
  } 
  catch (erro) {
    console.error(erro);
    alert('Não foi possível carregar os cursos.');
  }
}

// Evento de envio do formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita o envio padrão do formulário

  // Pega os valores do formulário
  const instituicao = document.getElementById('instituicao').value;
  const nome = document.getElementById('nome').value;
  const periodo = document.getElementById('periodo').value;
  const codigo = document.getElementById('codigo').value;

  try {
    // Envia os dados para o servidor cadastrar o curso
    const resposta = await fetch('/adicionarCurso', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Instituicao: Number(instituicao),
        Nome: nome,
        Periodo: periodo,
        Codigo: Number(codigo),
      }),
    });

    if (!resposta.ok) {
      let mensagem = 'Erro ao cadastrar curso.';
      try {
        const erroBody = await resposta.json();
        if (erroBody && erroBody.erro) {
          mensagem = erroBody.erro;
        }
      } catch (_) {
        // Se a resposta não for JSON, mantém mensagem padrão
      }
      throw new Error(mensagem);
    }

    // Depois de cadastrar, usa a rota /cursos para carregar e mostrar todos os cursos
    await carregarCursos();

    // Limpa o formulário
    form.reset();
  } catch (erro) {
    console.error(erro);
    alert(erro.message || 'Erro ao cadastrar curso.');
  }
});