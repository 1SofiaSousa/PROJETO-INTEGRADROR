// Feito pela aluna Sofia de Sousa

import { promises } from "dns";
import mysql from "mysql2/promise";
import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "./connection";


export interface Docente {
  ID: number;
  Nome: string;
  Email: string;
  Telefone_Celular: number;
  Senha: string;
}


// Comecando funcoes 
// Essa funcao obtem todos os docente da tabela de docente do mySql

// Coon - o "canal direto" entre o codigo e o banco                 
// Pool Connection - modelo tecnico de uma conexao que vem do pool(gereciador de conexoes), que garante que os metodos
// do coon ocorram como (query, release e begin trasaction)
// uma promise e um objeto em js que vai representar algo que ainda vai acontecer no futuro

export async function getAllDocente(): Promise<Docente[]> {

  const conn: PoolConnection = await pool.getConnection();
  try {

      // gerais 
        // rows - sao todas as linhas que vieram do banco 
        // query - comando que enviamos ao banco para pedir alguma coisa para ele

    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT ID AS ID_Docente, Nome AS Nome_Docente, Email AS Email, Telefone_Celular AS Telefone_Celular, Senha AS Senha FROM Aluno`
    );

    // usado para evitar erro de tipagem (usar um tipo de dado como se fosse outro tipo)
    return rows as unknown as Docente[];
  } finally {
    conn.release();
  }
}


// Obtendo o docente pelo ID

  // caso nao encontre esse docente ela retorna null
export async function getDocenteById(ID: number): Promise<Docente | null> {

   // await - vai esperar a conexao ficar disponibilizada
   // conn -  canal direto com o banco 

  const conn: PoolConnection = await pool.getConnection();
  try {

    // await - nesse caso espera o resultado
    // rows - pega somente as linhas que vao ser retornadas 
    // RowDataPacket - diz para o TS que vai vir em formato de linhas do banco 
    // Usa o ? para evitar SQL Injection (injeta comandos SQL maliciosos dentro de campos de formulário ou parâmetros)
    // O valor do ID é passado como um array no segundo parâmetro da função query (garantindo a segurança)

    const [rows] = await conn.query<RowDataPacket[]>(
             `SELECT ID AS ID_Docente, Nome AS Nome_Docente, Email AS Email, Telefone_Celular AS Telefone_Celular,
              Senha AS Senha FROM Aluno
              WHERE ID = ?`, [ID]
    );

    // Pega o primeiro docente encontrado
    const Docente = (rows as unknown as Docente[])[0];
    // Se não encontrar, retorna null
    return Docente ?? null;
  } finally {
    conn.release();
  }
}

// funcao de adicionar docente 
export async function addDocente(ID: number, Nome:string, Email:string, Telefone_Celular:number, Senha:string): Promise<number> {
  const conn: PoolConnection = await pool.getConnection();
  try {

     // O result pega apenas o resultado principal 
     // ResultSetHeader - retorno de operacoes de insert, update e delete

    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO Docente (ID_Docente, Nome_Docente, Email, Telefone_Celular, Senha) VALUES (?, ?, ?, ?, ?)`,
      [ID, Nome, Email, Telefone_Celular, Senha]
    );

    // insertId - retorna o ID da docente cadastrada
    
    return result.insertId;
  } finally {
    conn.release();
  }
}





