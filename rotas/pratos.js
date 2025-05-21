import express from 'express'; // Importa o framework Express para construção de aplicações web.
import { retornaPratos } from '../servicos/manipulaPratos.js';

const pratosRouters = express.Router(); // Cria uma instância da aplicação Express.

// Rota para listar pratos
pratosRouters.get('/', async (req, res) => {
    const listaPratos =  await retornaPratos();  

    res.json({ pratos: listaPratos }); // Responde com o código de status apropriado e a lista de leads.
});

export default pratosRouters;