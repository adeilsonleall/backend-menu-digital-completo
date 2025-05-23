import express from 'express'; // Importa o framework Express para construção de aplicações web.
import { retornaCategoriaPratos } from '../servicos/manipulaPratos.js';

const pratosRouters = express.Router(); // Cria uma instância da aplicação Express.

// Rota para listar pratos
pratosRouters.get('/', async (req, res) => {
    const categoria = req.query.categoria; // Recebe valor a ser requisitado no banco de dados.

    if(categoria === undefined){ // Valida se a chave foi recebida corretamente.
        res.status(400).json({ Erro: 'Nenhum parametro recebido!' }); // 
    }else {
        const listaPratos =  await retornaCategoriaPratos(categoria); 

        if(listaPratos.status){
            res.status(200).json(listaPratos.pratos);
        }else{
            res.status(401).json(listaPratos.pratos);
        }
    }

});

export default pratosRouters;