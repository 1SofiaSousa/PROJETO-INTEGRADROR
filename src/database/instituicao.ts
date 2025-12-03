import mysql from "mysql2/promise";
import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import pool from "./connection";

export interface Instituicao {
  id: number;
  nome: string;
  endereco: string;
}

// Inserir uma nova instituição

// Coon - o "canal direto" entre o codigo e o banco                 
// Pool Connection - modelo tecnico de uma conexao que vem do pool(gereciador de conexoes), que garante que os metodos
// do coon ocorram como (query, release e begin trasaction)
// uma promise e um objeto que vai representar algo que ainda vai acontecer no futuro

export async function addInstituicao(nomeInstituicao: string, endereco: string): Promise<number> {
  const conn: PoolConnection = await pool.getConnection();

  try {

    // O result pega apenas o resultado principal 
    // ResultSetHeader - retorno de operacoes de insert, update e delete

    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO Instituicao (Nome, Endereco) VALUES (?, ?)`,
      [nomeInstituicao, endereco]
    );

    // insertId - retorna o ID da instituição cadastrada

    return result.insertId; // retorna o ID da instituição cadastrada
  } finally {
    conn.release();
  }
}

// funcao de obter todas as instituicoes 

export async function getAllInstituicoes(): Promise<Instituicao[]> {

  
  const conn: PoolConnection = await pool.getConnection();

  try {

    // rows - sao todas as linhas que vieram do banco
    // query - comando que enviamos ao banco para pedir alguma coisa para ele
    // Aqui pegamos todas as instituicoes
    // RowDataPacket - representa uma linha de dados retornada por uma consulta SELECT
    // Cada objeto RowDataPacket corresponde a uma linha do conjunto de resultados que garante que o ts entenda


    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT Id AS id, Nome AS nome, Endereco AS endereco
       FROM Instituicao`
    );
    
    // // Converte o retorno para o tipo Instituicao[]
    return rows as Instituicao[];
  } finally {

    // libera a conexao com o banco de dados (caso de erro tambem libera)
    conn.release();
  }
}