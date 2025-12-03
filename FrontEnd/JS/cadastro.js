// Feito pela aluna Sofia de Sousa
// Seleciona o formulário da página
const form = document.querySelector('.form');

// Função responsável por enviar os dados do usuário para o servidor
function cadastrarUsuarioServidor(nome, email, telefone, senha) {
  // Validação simples dos campos
  if (!nome || !email || !telefone || !senha) {
    window.alert("Preencha todos os campos antes de cadastrar.");
    return;
  }

  // Monta o objeto com os dados do usuário
  const dados = {nome: nome, email: email, telefone: telefone, senha: senha
  };

  // Envia os dados para o servidor usando fetch
  fetch('/adicionarDocente', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Resposta não OK do servidor');
      }
      return response.json();
    })
    .then(data => {
        
      // Mensagem de sucesso para o usuário
      window.alert('Cadastro realizado com sucesso!');

      // Log da resposta para debug
      console.log('Resposta do servidor:', data);
    })
    .catch(error => {
      // Mensagem de erro para o usuário
      window.alert('Erro ao realizar cadastro. Tente novamente.');

      // Log do erro para debug
      console.error('Erro no servidor:', error);
    });
}

// Evento de envio do formulário
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Evita o envio padrão do formulário (recarregar a página)

  // Pega os valores dos campos do formulário
  const nome = document.getElementById('txtName').value;
  const email = document.getElementById('txtEmail').value;
  const telefone = document.getElementById('txtPhone').value;
  const senha = document.getElementById('txtPassword').value;

  // Envia os dados para o servidor
  cadastrarUsuarioServidor(nome, email, telefone, senha);

  // Limpa o formulário após o envio
  form.reset();
});