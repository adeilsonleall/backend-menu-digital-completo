import express from 'express'; // Importa o framework Express para construção de aplicações web.
import cors from 'cors'; // Importa o middleware para habilitar o compartilhamento de recursos entre diferentes origens (CORS).

const app = express(); // Cria uma instância da aplicação Express.

app.use(express.json()); // Habilita o uso de JSON no corpo da requisição (req.body).
app.use(cors()); // Possibilita receber requisições de origens diferentes.

/* ROTA 1 */
app.post('/?', (req, res) => { // Define uma rota POST em "/leads" para lidar com dados recebidos.

}) // Rota de Cadastro de Leads.

// EXECUTA SERVIDOR LOCAL.
app.listen(8080, async () => { // Configura a aplicação para escutar requisições na porta 8080.
    const data = new Date();

    console.log(`Servidor iniciado em: ${data}`); // Exibe no console que o servidor foi iniciado com sucesso.
});
