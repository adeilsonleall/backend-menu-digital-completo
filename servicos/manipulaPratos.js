import pool from "./conexao.js"; // Importa o pool de conexões do arquivo conexao.js.

// Função retorna categoria de pratos.
export async function retornaCategoriaPratos(categoria) {
    let conexao;
    let status;

    try {
        conexao = await pool.getConnection(); // Obtém uma conexão do pool.

        // Executa a query de seleção no banco de dados.
        let [pratos] = await conexao.query('SELECT categoria, nome, preco FROM cardapio WHERE categoria ="' + categoria + '"');

        if (pratos.length > 0) { // Verifica se a bsuca encontrou algun dado.
            status=true; // Seta status para verdadeiro.
            return {pratos, status} // Retorna dados encontrados e status.
        }else{
            status=false; // Seta status para false.
            pratos = {erro: 'Nenhum registro encontrado!'}; // Informa que nenhum dado foi encontrado.
            return {pratos, status} // Retorna mensagem de alerta e status.
        }

    } catch (erro) {
        console.error("Erro ao buscar pratos:", erro);
        return []; // Retorna um array vazio em caso de erro.

    } finally {
        if (conexao) conexao.release(); // Libera a conexão de volta para o pool, se existir.
    }
}
