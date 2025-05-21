import pool from "./conexao.js"; // Importa o pool de conexões do arquivo conexao.js.

export async function retornaPratos() {
    let conexao;

    try {
        conexao = await pool.getConnection(); // Obtém uma conexão do pool.

        // Executa a query de seleção no banco de dados.
        const [pratos] = await conexao.query("SELECT categoria, nome, preco FROM cardapio");

        return pratos; // Retorna a lista de pratos.

    } catch (erro) {
        console.error("Erro ao buscar pratos:", erro);
        return []; // Retorna um array vazio em caso de erro.

    } finally {
        if (conexao) conexao.release(); // Libera a conexão de volta para o pool, se existir.
    }
}
