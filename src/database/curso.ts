// Feito pela aluna Sofia de Sousa

import { promises } from "dns";
import mysql from "mysql2/promise";
import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "./connection";

// Interface de curso 
export interface Curso {
  Instituicao: string;
  Nome: string;
  Periodo: string;
  ID: number;
}


// Comecando funcoes 
// Essa funcao obtem todas os curos 

// Coon - o "canal direto" entre o codigo e o banco                 
// Pool Connection - modelo tecnico de uma conexao que vem do pool(gereciador de conexoes), que garante que os metodos
// do coon ocorram como (query, release e begin trasaction)

export async function getAllCursos(): Promise<Curso[]> {
  const conn: PoolConnection = await pool.getConnection();
  try {
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT ID_Instituicao AS Instituicao, Nome_Curso AS Nome, Periodo AS Periodo, Codigo AS ID
       FROM Curso`
    );
    return rows as unknown as Curso[];
  }
  finally {
    conn.release();
  }
}



// Obtendo o curso pelo seu Codigo

// uma promise e um objeto que vai representar algo que ainda vai acontecer no futuro
export async function getCursoById(Codigo: number): Promise<Curso | null> {

  // await - vai esperar a conexao ficar disponibilizada
  // conn -  canal direto com o ban

  const conn: PoolConnection = await pool.getConnection();
  try {

    // rows - sao todas as linhas que vieram do banco 
    // query - comando que enviamos ao banco para pedir alguma coisa para ele

    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT ID_Instituicao AS Instituicao, Nome_Curso AS Nome, Periodo AS Periodo, Codigo AS ID
       FROM Curso
       WHERE Codigo = ?`,[Codigo]);

    // ?? - se o valor que estiver na esquerda for nulo ou indefinido, ele retorna o valor da direita
    // unknow - tipo do TS que e usado para representar valores de tipo desconhecido 

    const Curso = (rows as unknown as Curso [])[0];
    return Curso ?? null;
  } 
  finally {
    conn.release();
  }
}

// adicionando um novo curso 

export async function addCurso (Instituicao: number, Nome: string, Periodo: string, Codigo: number): Promise<number> {
  const conn: PoolConnection = await pool.getConnection();
  try {

    // ResultSetHeader - retorno de operacoes de insert, update e delete

    const [result] = await conn.execute<ResultSetHeader>(
      
      `INSERT INTO Curso (Nome_Curso, Periodo, Codigo, ID_Instituicao) VALUES (?, ?, ?, ?)`,
      [Nome, Periodo, Codigo, Instituicao,]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}






