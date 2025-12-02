// server.ts
// Rotas criadas pela aluna Sofia de Sousa

import express, { Request, Response, NextFunction } from "express";
import path from "path";

const app = express();

app.use(express.json());

//cors
import cors from "cors";
app.use(cors());


// Caminho absoluto para a pasta FrontEnd
const frontEndPath = path.join(__dirname, '../FrontEnd');
app.use(express.static(frontEndPath));


// Importa a conexão
import { pool } from './database/connection';

// Rota de teste da conexão
app.get('/teste', async (req: Request, res: Response) => { // Rota de teste da conexão
  try {
    const [rows] = await pool.query('SELECT NOW() AS agora');
    res.json({ mensagem: "Conexão funcionando ✅", data: (rows as any)[0].agora });
  } catch (erro) {
    res.status(500).json({ erro: (erro as Error).message });
  }
});

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(frontEndPath, 'HTML', 'index.html'));
});


//ROTAS PARA HTMLS (GET) Posteriormente, é possível migrar para express.static, mas será necessário ajustar os paths dos arquivos CSS e JS no FrontEnd e a organização das pastas.

app.get('/dashboard', (req: Request, res: Response) => {
    res.sendFile(path.join(frontEndPath, 'HTML', 'dashboard.html'));
});

app.get('/dashboard/alunos', (req: Request, res: Response) => {
    res.sendFile(path.join(frontEndPath, 'HTML', 'alunos.html'));
});

app.get('/dashboard/instituicoes', (req: Request, res: Response) => {
    res.sendFile(path.join(frontEndPath, 'HTML', 'instituicoes.html'));
});

app.get('/dashboard/turmas', (req: Request, res: Response) => {
    res.sendFile(path.join(frontEndPath, 'HTML', 'turmas.html'));
});


app.get('/cadastrar-instituicao', (req: Request, res: Response) => {
    res.sendFile(path.join(frontEndPath, 'HTML', 'cadastro-instituicao.html'));
});

app.get('/cadastro', (req: Request, res: Response) => {
    res.sendFile(path.join(frontEndPath, 'HTML', 'cadastro.html'));
});



//ROTAS POST, GET, PUT, DELETE

// rotas de aluno 
 
  //rota adicionar aluno

import { addAluno } from './database/alunos';

// app -  criada com o express 
// post - envia dados 
// async - assincrona por que vai acessar o banco de dados e usar o await

app.post('/adicionarAlunos', async (req: Request, res: Response) => {

  // requirimos os parametros do corpo da requisicao
  const { ra, nome } = req.body;

  try {

    // chamando a funcao de add o aluno, o await por que espera  o banco terminar de responder
    // recebe o novo id do aluno criado pelo banco
    const novoId = await addAluno(ra, nome);

    // objeto da resposta no formato json
    res.status(201).json({ id: novoId, ra, nome });

    // caso de erro
  } catch (erro) {

    // cai dentro dessa mensagem de erro
    res.status(500).json({ erro: (erro as Error).message });
  }
});

//rota obter todas os alunos
import { getAllAluno } from "./database/alunos";
 
  // comando de select do banco ja que pega todos os alunos
app.get("/alunos", async (req: Request, res: Response) => {

  try {

    // getAllAluno - funcao que busca todos os alunos no banco (Select)
    const alunos = await getAllAluno();

    // aqui retorna os alunos em formato json
    res.json(alunos);
  } catch (erro) {

    // em caso de erro na busca, retorna esse erro e mensagem
    console.error("Erro ao buscar alunos:", erro);
    res.status(500).json({ erro: "Erro interno" });
  }
});

  // rotas de instituicao 
   //rota adicionar instituicao

import { addInstituicao } from "./database/instituicao";

// app -  criada com o express 
// post - envia dados 
// async - assincrona por que vai acessar o banco de dados e usar o await

app.post("/cadastrar-instituicao", async (req: Request, res: Response) => {
  try {

    // pegando os dados do corpo da requisicao 
    const { nomeInstituicao, endereco } = req.body;
    
    // chamando a funcao de add a instituicao, o await por que espera  o banco terminar de responder
    const idCriado = await addInstituicao(nomeInstituicao, endereco);
    

    // objeto da resposta no formato json
    res.status(201).json({
      mensagem: "Instituição cadastrada com sucesso!",
      id: idCriado
    });

     // em caso de erro
     // cai dentro dessa mensagem de erro

  } catch (erro) {
    console.error("Erro ao cadastrar instituição:", erro);
    res.status(500).json({ erro: "Erro ao cadastrar instituição" });
  }
});

//rota obter todas as instituicoes
import { getAllInstituicoes } from "./database/instituicao";

// comando de select do banco ja que pega todos as instituicoes
app.get("/instituicoes", async (req: Request, res: Response) => {
  try {

    // query que busca todas as instituicoes no banco (Select)
    // aqui retorna as instituicoes em formato json
    const instituicoes = await getAllInstituicoes();
    res.json(instituicoes);
  } catch (erro) {

    //quando der erro na busca, retorna esse erro e mensagem
    console.error("Erro ao buscar instituições:", erro);
    res.status(500).json({ erro: "Erro interno" });
  }
});


// rotas turma

import { addTurma } from "./database/turma";

// Rota de adicionar turma
// app -  criada com o express
// post - envia dados
// async - assincrona por que vai acessar o banco de dados e usar o await

app.post("/cadastrar-turma", async (req: Request, res: Response) => {
  try {

      // pegando os dados do corpo da requisicao
    const { ID,HoraAula,NumeroTurma, DataInicio, DataFim, LocalAula } = req.body;

     // chamando a funcao de add a turma, o await por que espera  o banco terminar de responder
    const idCriado = await addTurma(ID,HoraAula,NumeroTurma, DataInicio, DataFim, LocalAula);
     
    // objeto da resposta no formato json quando a turma for cadastrada com sucesso
    res.status(201).json({
      mensagem: "Turma cadastrada com sucesso!",
      id: idCriado
    });

     // em caso de erro
     // cai dentro dessa mensagem de erro

  } catch (erro) {
    console.error("Erro ao cadastrar instituição:", erro);
    res.status(500).json({ erro: "Erro ao cadastrar instituição" });
  }
});

// Rota de obter todas as turmas

import { getAllTurmas }  from "./database/turma";

// comando de select do banco ja que pega todos as turmas
// 
app.get("/turmas", async (req: Request, res: Response) => {
  try {
    const turmas = await getAllTurmas();

    // quando retorna as turmas em formato json
    res.json(turmas);

  } catch (erro) {
    //quando der erro na busca, retorna esse erro e mensagem
    console.error("Erro ao buscar turmas:", erro);
    res.status(500).json({ erro: "Erro interno" });
  }
});

// rotas docente

//rota principal para obter todos os docentes

import {getAllDocente} from './database/docente';

// Rota principal para obter todos os docentes
// envia o arquivo cadastro.html 
// get - para obter dados
// app - criada com o express
// async - assincrona por que vai acessar o banco de dados e usar o await

app.get('/Docente', (req: Request, res: Response) => {

  // envia o arquivo cadastro.html

  res.sendFile(path.join(frontEndPath, 'HTML', 'cadastro.html'));
});

// Rota de adicionar docente

import { addDocente } from './database/docente';

// app -  criada com o express
// post - envia dados
// async - assincrona por que vai acessar o banco de dados e usar o await

app.post('/adicionarDocente', async (req: Request, res: Response) => {

  // que requisitamos os parametros do corpo da requisicao
  const { ID, Nome, Email, Telefone_Celular, Senha } = req.body;
  try {

    // chamando a funcao de add o docente, o await por que espera  o banco terminar de responder
    // que recebe o novo id do docente criado pelo banco
    
    const novoId = await addDocente(ID, Nome, Email, Telefone_Celular, Senha);

    // quando o docente for cadastrado com sucesso
    res.status(201).json({ id: novoId, ID, Nome,Email, Telefone_Celular, Senha });
  } catch (erro) {

    // quando der erro na busca, retorna esse erro e mensagem
    res.status(500).json({ erro: (erro as Error).message });
  }
});


// Rotas de curso 

   //Rota principal para obter todos os cursos

 import {getAllCursos} from './database/curso';


 // Rota principal para obter todos os cursos
 // envia o arquivo cadastro.html
 // get - para obter dados
 // app - criada com o express
 // async - assincrona por que vai acessar o banco de dados e usar o await
 
  app.get('/Cursos', (req: Request, res: Response) => {
  res.sendFile(path.join(frontEndPath, 'HTML', 'cadastro.html'));
});
   
   // Rota de adicionar curso

   import { addCurso } from './database/curso';
    // app -  criada com o express
    // post - envia dados
    // async - assincrona por que vai acessar o banco de dados e usar o await

   app.post ('/adicionarCurso', async (req: Request, res: Response) => {

    // que requisitamos os parametros do corpo da requisicao
    const { Instituicao, Nome, Periodo, ID} = req.body;

    try{

      // chamando a funcao de add o curso, o await por que espera  o banco terminar de responder
      // que recebe o novo id do curso criado pelo banco

      const novoId = await addCurso(Instituicao, Nome,Periodo,ID);

      // quando o curso for cadastrado com sucesso

      res.status (201).json ({id: novoId, Instituicao, Nome, Periodo, ID});
    } catch (erro) {

      // em caso de erro na busca, retorna esse erro e mensagem
      res.status (500).json ({ erro: (erro as Error).message});
    }
   });
   
// Inicia o servidor
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});



