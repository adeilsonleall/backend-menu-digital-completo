import mysql from 'mysql2/promise'; // Importa o módulo mysql2 com suporte para promises.

const pool = mysql.createPool({ // Cria um pool de conexões com as configurações fornecidas.
    host     : 'localhost', // Define o host do banco de dados como localhost.
    user     : 'root', // Define o usuário do banco de dados como root.
    password : '@Sophia56224729', // Define a senha do banco de dados.
    database : 'restaurante_db' // Define o nome do banco de dados a ser usado.
});

export default pool; // Exporta o pool de conexões para que possa ser utilizado em outros arquivos.