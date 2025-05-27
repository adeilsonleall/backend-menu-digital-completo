import express from 'express';
import { retornaCategoriaPratos, retornaNomePratos, retornaDescricaoPratos, cadastraPrato, deletaPrato, editaPrato } from '../servicos/manipulaPratos.js';

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


/**
 * Rota para editar pratos.
*/
pratosRouters.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { novaCategoria, novoNome, novaDescricao, novoPreco, novaImagem} = req.body;

        console.log(id)
        console.log(novaCategoria)
        
        const resposta = await editaPrato(novaCategoria, novoNome, novaDescricao, novoPreco, novaImagem, id);
        
        if (!resposta.status) {
            return res.status(404).json({ erro: 'Nenhum prato encontrado para atualizar!' });
        }
        
        res.status(200).json({ mensagem: "Prato atualizado com sucesso!" });
        
    } catch (erro) {
        console.error("Erro ao editar prato:", erro);
        res.status(500).json({ erro: "Erro interno ao editar prato." });
    }
});

/**
 * Rota para deletar pratos.
 */
pratosRouters.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const resposta = await deletaPrato(id);

        if (!resposta.status) {
            return res.status(404).json({ erro: 'Nenhum prato encontrado para deletar!' });
        }

        res.status(200).json({ mensagem: "Prato deletado com sucesso!" });

    } catch (erro) {
        console.error("Erro ao deletar prato:", erro);
        res.status(500).json({ erro: "Erro interno ao deletar prato." });
    }
});

export default pratosRouters; // Exporta o roteador para uso em outras partes do projeto.

