import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Importa funções de manipulação de pratos do serviço correspondente.
import { retornaPratos ,retornaCategoriaPratos, retornaNomePratos, retornaDescricaoPratos, cadastraPrato, deletaPrato, editaPrato } from '../servicos/manipulaPratos.js';

// Cria um roteador para as rotas relacionadas aos pratos.
const pratosRouters = express.Router();

// Configuração do armazenamento de imagens usando o Multer.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads-imagens/'); // Define o diretório de destino das imagens.
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Obtém a extensão do arquivo.
    const nomeArquivo = `${file.fieldname}-${Date.now()}${ext}`; // Gera um nome único para o arquivo.
    cb(null, nomeArquivo);
  }
});

const upload = multer({ storage });

/**
 * Rota para cadastrar um prato no banco de dados.
 */
pratosRouters.post('/', upload.single('imagem'), async (req, res) => {
  try {
    // Obtém os dados enviados no corpo da requisição.
    const { categoria, nome, descricao = '', preco = 0 } = req.body;
    // Verifica se uma imagem foi enviada e obtém o nome do arquivo.
    const imagem = req.file ? req.file.filename : '';

    // Chama a função de cadastro de prato no banco de dados.
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
 * Rota para listar pratos, permitindo filtros opcionais.
 */
pratosRouters.get('/', async (req, res) => {
    try {
        // Obtém os parâmetros de busca da requisição.
        const { categoria, nome, descricao } = req.query;

        // Define qual função de busca utilizar com base nos parâmetros informados.
        const buscaPratos = categoria 
            ? retornaCategoriaPratos(categoria) 
            : nome 
            ? retornaNomePratos(nome) 
            : descricao
            ? retornaDescricaoPratos(descricao)
            : retornaPratos();

        // Obtém a lista de pratos com base na busca.
        const listaPratos = await buscaPratos;

        // Retorna os dados encontrados com status apropriado.
        res.status(listaPratos.status ? 200 : 404).json(listaPratos.pratos);

    } catch (erro) {
        console.error("Erro ao buscar pratos:", erro);
        res.status(500).json({ erro: "Erro interno ao buscar pratos." });
    }
});

// Rota para fornecer imagens salvas no servidor.
pratosRouters.get('/:nomeImagem', (req, res) => {
  const { nomeImagem } = req.params; // Obtém o nome da imagem da requisição.
  const caminhoImagem = path.join('uploads-imagens', nomeImagem); // Define o caminho da imagem.

  if (fs.existsSync(caminhoImagem)) {
    res.sendFile(caminhoImagem, { root: '.' }); // Envia a imagem como resposta.
  } else {
    res.status(404).json({ erro: 'Imagem não encontrada.' }); // Retorna erro caso a imagem não exista.
  }
});

/**
 * Rota para editar um prato existente.
 */
pratosRouters.put('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do prato a ser editado.
        const { novaCategoria, novoNome, novaDescricao, novoPreco, novaImagem } = req.body; // Obtém os novos dados.

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
 * Rota para deletar um prato do banco de dados.
 */
pratosRouters.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Obtém o ID do prato a ser deletado.

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

// Exporta o roteador para ser utilizado em outras partes do projeto.
export default pratosRouters;
