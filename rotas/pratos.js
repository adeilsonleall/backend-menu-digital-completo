import express from 'express'; // Importa o framework Express para construção de aplicações web.
import { retornaCategoriaPratos } from '../servicos/manipulaPratos.js';

const pratosRouters = express.Router(); // Cria uma instância da aplicação Express.

// Rota para listar pratos
pratosRouters.get('/', async (req, res) => {
    const categoria = req.query.categoria;

    if(categoria === undefined){
        res.status(400).json({ Erro: 'Nenhum parametro recebido' }); // 
    }else {
        const listaPratos =  await retornaCategoriaPratos(categoria); 
         res.status(200).json({ Pratos: listaPratos }); // 
    }

    
});

export default pratosRouters;