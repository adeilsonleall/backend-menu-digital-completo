import express from 'express';
import { retornaCategoriaPratos, retornaNomePratos, retornaDescricaoPratos, cadastraPrato } from '../servicos/manipulaPratos.js';

const pratosRouters = express.Router(); // Cria um roteador para as rotas relacionadas aos pratos.

/**
 * Rota para cadastrar um prato no banco de dados.
 */
pratosRouters.post('/', async (req, res) => {
    try {
        // Desestrutura o corpo da requisição e define valores padrão para evitar problemas.
        const { categoria, nome, descricao = '', preco = 0, imagem = '' } = req.body;

        // Chama a função que insere os dados no banco.
        const resposta = await cadastraPrato(categoria, nome, descricao, preco, imagem);

        if(!resposta.status) {
            res.status(400).json({erro: 'Não foi possível cadastrar o prato.'})
        }else{
            // Retorna um status 201 (Created) indicando sucesso.
        res.status(201).json({ mensagem: "Prato cadastrado com sucesso!" });
        }

    } catch (erro) {
        console.error("Erro ao cadastrar prato:", erro);
        res.status(500).json({ erro: "Erro interno ao cadastrar prato." }); // Retorno mais informativo em caso de falha.
    }
});

/**
 * Rota para listar pratos de acordo com filtros opcionais.
 */
pratosRouters.get('/', async (req, res) => {
    try {
        // Desestrutura os parâmetros da requisição.
        const { categoria, nome, descricao } = req.query;

        // Se nenhuma chave de busca for fornecida, retorna erro.
        if (!categoria && !nome && !descricao) {
            return res.status(400).json({ erro: 'É necessário informar pelo menos um parâmetro de busca!' });
        }

        // Define qual função de busca utilizar com base nos parâmetros fornecidos.
        const buscaPratos = categoria 
            ? retornaCategoriaPratos(categoria) 
            : nome 
            ? retornaNomePratos(nome) 
            : retornaDescricaoPratos(descricao);

        // Aguarda a resposta da busca.
        const listaPratos = await buscaPratos;

        // Retorna os dados encontrados com status apropriado.
        res.status(listaPratos.status ? 200 : 404).json(listaPratos.pratos);

    } catch (erro) {
        console.error("Erro ao buscar pratos:", erro);
        res.status(500).json({ erro: "Erro interno ao buscar pratos." }); // Tratamento de erro adequado.
    }
});

export default pratosRouters; // Exporta o roteador para uso em outras partes do projeto.

