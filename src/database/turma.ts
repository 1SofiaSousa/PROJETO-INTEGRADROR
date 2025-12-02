// Feito pela aluna Sofia de Sousa

import { promises } from "dns";
import mysql from "mysql2/promise";
import { PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { pool } from "./connection";


export interface Turma {
  ID: number;
  HoraAula: string;
  NumeroTurma: number;
  DataInicio: number;
  DataFim: number;
  LocalAula: string;
}


// Comecando funcoes 
// Essa funcao obtem todas as turmas da tabela de turma do mySql

export async function getAllTurmas(): Promise<Turma[]> {

  // geral - 
      // conn -  canal direto com o banco
      // await - vai esperar a conexao ficar disponibilizada
      // Pool Connection - modelo tecnico de uma conexao que vem do pool(gereciador de conexoes), que garante que os metodos
      // do coon ocorram como (query, release e begin trasaction)
    
  const conn: PoolConnection = await pool.getConnection();
  try {

    // RowDataPacket - representa uma linha de dados retornada pelo banco 
    // (estilo um envole que a biblioteca usa para entregar os dado do bd)

    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT ID AS ID, HoraAula AS Horario_Aula, NumeroTurma AS Numero_Turma, DataInicio AS Data_Inicio, 
       DataFim AS Data_Fim , LocalAula AS Local_Aula FROM Aluno`
    );

    // usado para evitar erro de tipagem (usar um tipo de dado como se fosse outro tipo)
    return rows as unknown as Turma[];
  } finally {
    conn.release();
  }
}



// Obtendo a turma pelo seu ID
export async function getTurmaById(ID: number): Promise<Turma | null> {
  const conn: PoolConnection = await pool.getConnection();
  try {

    // geral - 
        // rows - sao todas as linhas que vieram do banco 
       // query - comando que enviamos ao banco para pedir alguma coisa para ele

    // especificos - 
       // Faz a consulta no banco de dados
       // Seleciona a turma com o ID fornecido
       // Usa o ? para evitar SQL Injection (injeta comandos SQL maliciosos dentro de campos de formulário ou parâmetros)
       // O valor do ID é passado como um array no segundo parâmetro da função query (garantindo a segurança)
    
    const [rows] = await conn.query<RowDataPacket[]>(
             `SELECT ID AS ID, HoraAula AS Horario_Aula, NumeroTurma AS Numero_Turma, DataInicio AS Data_Inicio, 
              DataFim AS Data_Fim , LocalAula AS Local_Aula FROM Aluno FROM Aluno
              WHERE ID = ?`, [ID]
    );

    // Pega a primeira turma encontrada
    const Turma = (rows as unknown as Turma [])[0];

    // Se não encontrar, retorna null
    return Turma ?? null;
  } finally {
    conn.release();
  }
}

// Adicionando uma nova turma na tabela de turma

export async function addTurma (ID:number, HoraAula:string, NumeroTurma:number, DataInicio:number, DataFim: number, LocalAula:string): Promise<number> {
  const conn: PoolConnection = await pool.getConnection();
  try {

    // ResultSetHeader - resultado de um insert, update ou delete
    const [result] = await conn.execute<ResultSetHeader>(

      // (?, ?, ?, ?, ?, ?) - são os valores que vão ser passados depois pelo código (JavaScript/Node)
      `INSERT INTO Turma (ID, Horario_Aula, Numero_Turma, Data_Inicio, Data_Fim, Local_Aula) VALUES (?, ?, ?, ?, ?, ?)`,
      [ID, HoraAula, NumeroTurma,DataInicio, DataFim, LocalAula]
    );

    // insertId - retorna o ID da turma cadastrada
    return result.insertId;
  } finally {
    conn.release();
  }
}





