// Feito pela aluna Sofia de Sousa

import { promises } from "dns";
import mysql from "mysql2/promise";
import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "./connection";


// criando a interface do aluno 
export interface Aluno {
  id: number;
  ra: string;
  nome: string;
}

// Comecando funcoes 
// Essa funcao obtem todos os estudantes da tabela de alunos do mySql
// As funcoes sao assincronas por conta do banco de dados

// Funcoes do Aluno
// Coon - o "canal direto" entre o codigo e o banco                 
// Pool Connection - modelo tecnico de uma conexao que vem do pool(gereciador de conexoes), que garante que os metodos
// do conn ocorram como (query, release e begin trasaction)
// uma promise e um objeto em js que vai representar algo que ainda vai acontecer no futuro

export async function getAllAluno(): Promise<Aluno[]> {
  const conn: PoolConnection = await pool.getConnection();

    // rows - sao todas as linhas que vieram do banco 
    // query - comando que enviamos ao banco para pedir alguma coisa para ele

  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT ID AS id, RA AS ra, Nome_Aluno AS nome FROM Aluno`
    );
    return rows as unknown as Aluno[];
  } finally {

    // Libera a conexao com o banco de dados 
    conn.release();
  }
}


// Obtendo o Aluno pelo ID
// async -  a funcao ela trabalha com operacoes assincronas (banco)

export async function getAlunoById(id: number): Promise<Aluno | null> {

  // await - vai esperar a conexao ficar disponibilizada
  // conn -  canal direto com o banco 

  const conn: PoolConnection = await pool.getConnection();

  // no try tudo que tem dentro dele pode dar erro sem quebrar o sistema, por conta do finally
  // que vai garantir a limpeza 

  try {

    // await - nesse caso espera o resultado
    // rows - pega somente as linhas que vao ser retornadas 
    // RowDataPacket - diz para o TS que vai vir em formato de linhas do banco

    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT ID AS id, RA AS ra, Nome_Aluno AS nome
       FROM Aluno
       WHERE ID = ?`, [id]
    );

    // convete para uma array de alunos, e depois pega o primeirop elemento dessa array   
    // ?? - se for nulo ou indefinido, retorna o null

    const aluno = (rows as unknown as Aluno[])[0];
    return aluno ?? null;
  } finally {
    conn.release();
  }
}

// funcao de adicionar  um aluno 


export async function addAluno(ra: string, nome: string): Promise<number> {
  const conn: PoolConnection = await pool.getConnection();
  try {

    // O result pega apenas o resultado principal 
    // ResultSetHeader - retorno de operacoes de insert, update e delete

    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO Aluno (RA, Nome_Aluno) VALUES (?, ?)`,
      [ra, nome]
    );

    // retorna o ID do aluno inserido
    return result.insertId;
  } finally {
    conn.release();
  }
}





