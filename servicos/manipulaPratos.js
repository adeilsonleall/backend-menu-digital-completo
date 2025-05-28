import pool from "./conexao.js"; // Importa o pool de conexões do banco.

/**
 * Função assíncrona para cadastrar um prato no banco de dados.
 */
export async function cadastraPrato(categoria, nome, descricao = '', preco = 0, imagem = '') {
    let conexao;

    try {
        conexao = await pool.getConnection();

        const query = 'INSERT INTO cardapio (categoria, nome, descricao, preco, imagem) VALUES (?, ?, ?, ?, ?)';
        const valores = [categoria, nome, descricao, preco, imagem];

        // Executa a query e verifica se foi inserido corretamente.
        const [resultado] = await conexao.query(query, valores);

        if (resultado.affectedRows > 0) {
            console.log('Prato cadastrado com sucesso!');
            return { status: true, mensagem: "Prato cadastrado com sucesso!" };
        } else {
            console.error('Falha ao cadastrar prato.');
            throw new Error('Não foi possível cadastrar o prato.');
        }

    } catch (erro) {
        console.error("Erro ao cadastrar prato:", erro.sqlMessage || erro.message);
        return { status: false, erro: erro.sqlMessage || "Erro desconhecido ao cadastrar prato." };

    } finally {
        if (conexao) conexao.release();
    }
}

/**
 * Função assíncrona que retorna todos os pratos.
 */
export async function retornaPratos() {
    let conexao;

    try {
        conexao = await pool.getConnection(); // Obtém uma conexão do pool.

        // Executa a query de seleção, garantindo segurança contra SQL Injection.
        const [pratos] = await conexao.query(
            'SELECT id, categoria, nome, descricao, preco, imagem FROM cardapio'
        );

        // Retorna os pratos encontrados ou uma mensagem de erro.
        return {
            pratos: pratos.length > 0 ? pratos : { erro: 'Nenhum registro encontrado!' },
            status: pratos.length > 0
        };

    } catch (erro) {
        console.error("Erro ao buscar pratos por categoria:", erro);
        return { pratos: [], status: false };

    } finally {
        if (conexao) conexao.release(); // Libera a conexão.
    }
}

/**
 * Função assíncrona que retorna pratos filtrados pela categoria.
 */
export async function retornaCategoriaPratos(categoria) {
    let conexao;

    try {
        conexao = await pool.getConnection(); // Obtém uma conexão do pool.

        // Executa a query de seleção, garantindo segurança contra SQL Injection.
        const [pratos] = await conexao.query(
            'SELECT id, categoria, nome, descricao, preco, imagem FROM cardapio WHERE categoria = ?',
            [categoria]
        );

        // Retorna os pratos encontrados ou uma mensagem de erro.
        return {
            pratos: pratos.length > 0 ? pratos : { erro: 'Nenhum registro encontrado!' },
            status: pratos.length > 0
        };

    } catch (erro) {
        console.error("Erro ao buscar pratos por categoria:", erro);
        return { pratos: [], status: false };

    } finally {
        if (conexao) conexao.release(); // Libera a conexão.
    }
}

/**
 * Função assíncrona que retorna pratos filtrados pelo nome.
 */
export async function retornaNomePratos(nome) {
    let conexao;

    try {
        conexao = await pool.getConnection(); // Obtém uma conexão do pool.

        // Executa a busca usando LIKE para encontrar nomes semelhantes.
        const [pratos] = await conexao.query(
            'SELECT id, categoria, nome, descricao, preco, imagem FROM cardapio WHERE nome LIKE ?',
            [`%${nome}%`]
        );

        return {
            pratos: pratos.length > 0 ? pratos : { erro: 'Nenhum registro encontrado!' },
            status: pratos.length > 0
        };

    } catch (erro) {
        console.error("Erro ao buscar pratos por nome:", erro);
        return { pratos: [], status: false };

    } finally {
        if (conexao) conexao.release();
    }
}

/**
 * Função assíncrona que retorna pratos filtrados pela descrição.
 */
export async function retornaDescricaoPratos(descricao) {
    let conexao;

    try {
        conexao = await pool.getConnection();

        // Executa a busca usando LIKE para encontrar descrições semelhantes.
        const [pratos] = await conexao.query(
            'SELECT id, categoria, nome, descricao, preco, imagem FROM cardapio WHERE descricao LIKE ?',
            [`%${descricao}%`]
        );

        return {
            pratos: pratos.length > 0 ? pratos : { erro: 'Nenhum registro encontrado!' },
            status: pratos.length > 0
        };

    } catch (erro) {
        console.error("Erro ao buscar pratos por descrição:", erro);
        return { pratos: [], status: false };

    } finally {
        if (conexao) conexao.release();
    }
}

/**
 * Função assíncrona para deletar um prato no banco de dados.
 */
export async function deletaPrato(id) {
    let conexao;

    try {
        conexao = await pool.getConnection();

        const query = 'DELETE FROM cardapio WHERE id = ?';
        const [resultado] = await conexao.query(query, [id]);

        if (resultado.affectedRows > 0) {
            console.log('Prato deletado com sucesso!');
            return { status: true, mensagem: "Prato deletado com sucesso!" };
        } else {
            console.error('Nenhum prato encontrado para deletar.');
            return { status: false, erro: "Nenhum prato encontrado!" };
        }

    } catch (erro) {
        console.error("Erro ao deletar prato:", erro.sqlMessage || erro.message);
        return { status: false, erro: erro.sqlMessage || "Erro desconhecido ao deletar prato." };

    } finally {
        if (conexao) conexao.release();
    }
}

/**
 * Função assíncrona para editar um prato no banco de dados.
 */
export async function editaPrato(novaCategoria, novoNome, novaDescricao, novoPreco, novaImagem, id) {
    let conexao;

    try {
        conexao = await pool.getConnection();

        const query = 'UPDATE cardapio SET categoria = ?, nome = ?, descricao = ?, preco = ?, imagem = ? WHERE id = ?';
        const valores = [novaCategoria, novoNome, novaDescricao, novoPreco, novaImagem, id];

        const [resultado] = await conexao.query(query, valores);

        if (resultado.affectedRows > 0) {
            console.log('Prato atualizado com sucesso!');
            return { status: true, mensagem: "Prato atualizado com sucesso!" };
        } else {
            console.error('Nenhum prato encontrado para atualizar.');
            return { status: false, erro: "Nenhum prato encontrado!" };
        }

    } catch (erro) {
        console.error("Erro ao editar prato:", erro.sqlMessage || erro.message);
        return { status: false, erro: erro.sqlMessage || "Erro desconhecido ao editar prato." };

    } finally {
        if (conexao) conexao.release();
    }
}
