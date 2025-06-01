import express from 'express';
import multer from 'multer';
import path from 'path';
import { retornaPratos ,retornaCategoriaPratos, retornaNomePratos, retornaDescricaoPratos, cadastraPrato, deletaPrato, editaPrato } from '../servicos/manipulaPratos.js';

const pratosRouters = express.Router(); // Cria um roteador para as rotas relacionadas aos pratos.

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads-imagens/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nomeArquivo = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, nomeArquivo);
  }
});

const upload = multer({ storage });

/**
 * Rota para cadastrar um prato no banco de dados.
 */
pratosRouters.post('/', upload.single('imagem'), async (req, res) => {
  try {
    // Desestrutura campos do corpo, exceto a imagem que virá pelo multer
    const { categoria, nome, descricao = '', preco = 0 } = req.body;
    // Se o arquivo foi enviado, pega o nome do arquivo, senão define como string vazia
    const imagem = req.file ? req.file.filename : '';

    // Chama a função que insere os dados no banco, passando o nome do arquivo da imagem
    const resposta = await cadastraPrato(categoria, nome, descricao, preco, imagem);

    if (!resposta.status) {
      return res.status(400).json({ erro: 'Não foi possível cadastrar o prato.' });
    }
    res.status(201).json({ mensagem: "Prato cadastrado com sucesso!" });
    
  } catch (erro) {
    console.error("Erro ao cadastrar prato:", erro);
    res.status(500).json({ erro: "Erro interno ao cadastrar prato." });
  }
});

/**
 * Rota para listar pratos de acordo com filtros opcionais.
 */
pratosRouters.get('/', async (req, res) => {
    try {
        // Desestrutura os parâmetros da requisição.
        const { categoria, nome, descricao } = req.query;

        // // Se nenhuma chave de busca for fornecida, retorna erro.
        // if (!categoria && !nome && !descricao) {
        //     return res.status(400).json({ erro: 'É necessário informar pelo menos um parâmetro de busca!' });
        // }

        // Define qual função de busca utilizar com base nos parâmetros fornecidos.
        const buscaPratos = categoria 
            ? retornaCategoriaPratos(categoria) 
            : nome 
            ? retornaNomePratos(nome) 
            : descricao
            ? retornaDescricaoPratos(descricao)
            : retornaPratos();

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

