/* =========================================
   DOCE AGRADO - SACOLA DE COMPRAS
========================================= */

// SACOLA
let carrinho = [];


/* =========================================
   FORMATAR MOEDA
========================================= */

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


/* =========================================
   ABRIR SACOLA LATERAL
========================================= */

function abrirCarrinho(event) {

    if (event) {
        event.preventDefault();
    }

    const painel = document.getElementById("painel-carrinho");
    const fundo = document.getElementById("fundo-carrinho");

    painel.classList.add("aberto");
    fundo.classList.add("aberto");

    document.body.style.overflow = "hidden";
}


/* =========================================
   FECHAR SACOLA
========================================= */

function fecharCarrinho() {

    const painel = document.getElementById("painel-carrinho");
    const fundo = document.getElementById("fundo-carrinho");

    painel.classList.remove("aberto");
    fundo.classList.remove("aberto");

    document.body.style.overflow = "";
}


/* =========================================
   ATUALIZAR RESUMO DO CABEÇALHO E PAINEL
========================================= */

function atualizarResumoCarrinho() {

    const quantidadeCabecalho =
        document.getElementById("quantidade-cabecalho");

    const totalCabecalho =
        document.getElementById("total-cabecalho");

    const quantidadePainel =
        document.getElementById("quantidade-painel");

    // QUANTIDADE TOTAL
    const quantidade = carrinho.reduce(
        (total, item) => total + item.quantidade,
        0
    );

    // VALOR TOTAL
    const total = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade,
        0
    );

    // CABEÇALHO
    if (quantidadeCabecalho) {
        quantidadeCabecalho.textContent =
            quantidade + (quantidade === 1 ? " produto" : " produtos");
    }

    if (totalCabecalho) {
        totalCabecalho.textContent = formatarMoeda(total);
    }

    // PAINEL LATERAL
    if (quantidadePainel) {
        quantidadePainel.textContent =
            quantidade + (quantidade === 1 ? " item" : " itens");
    }
}


/* =========================================
   ADICIONAR PRODUTO
========================================= */

function adicionar(nome, preco) {

    const produtoExistente = carrinho.find(
        item => item.nome === nome
    );

    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });

    }

    atualizarCarrinho();

}


/* =========================================
   ADICIONAR BOLO PERSONALIZADO
========================================= */

function adicionarBolo() {

    const tamanho = document.getElementById("tamanho-bolo").value;
    const massa = document.getElementById("massa-bolo").value;
    const recheio1 = document.getElementById("recheio-bolo-1").value;
    const recheio2 = document.getElementById("recheio-bolo-2").value;

    if (!tamanho || !massa || !recheio1) {
        alert("Escolha o tamanho, a massa e o primeiro recheio do bolo!");
        return;
    }

    const preco = Number(tamanho);

    const nome =
        `Bolo ${massa} - ${recheio1}` +
        (recheio2 ? ` + ${recheio2}` : "");

    carrinho.push({
        nome: nome,
        preco: preco,
        quantidade: 1
    });

    atualizarCarrinho();

    alert("Bolo adicionado à sua sacola! ❤️");

}


/* =========================================
   ATUALIZAR PRODUTOS DA SACOLA
========================================= */

function atualizarCarrinho() {

    const itensCarrinho =
        document.getElementById("itens-carrinho");

    const valorTotal =
        document.getElementById("valor-total");

    const finalizarPedido =
        document.getElementById("finalizar-pedido");

    if (!itensCarrinho || !valorTotal || !finalizarPedido) {
        atualizarResumoCarrinho();
        return;
    }

    let total = 0;

    // LIMPAR LISTA
    itensCarrinho.innerHTML = "";

    // SACOLA VAZIA
    if (carrinho.length === 0) {

        itensCarrinho.innerHTML = `
            <div class="carrinho-vazio">
                <span class="sacola-vazia-icone">🛒</span>
                <h3>Sua sacola está vazia!</h3>
                <p>Que tal escolher algo delicioso? 💕</p>
            </div>
        `;

        valorTotal.textContent = formatarMoeda(0);

        finalizarPedido.disabled = true;

        atualizarResumoCarrinho();

        return;
    }

    // LISTAR PRODUTOS
    carrinho.forEach((item, index) => {

        const subtotal = item.preco * item.quantidade;

        total += subtotal;

        itensCarrinho.innerHTML += `
            <div class="item-carrinho">

                <div class="item-carrinho-info">

                    <h3>${item.nome}</h3>

                    <p>${formatarMoeda(item.preco)} cada</p>

                    <strong>${formatarMoeda(subtotal)}</strong>

                </div>

                <div class="controles-quantidade">

                    <button type="button"
                        onclick="alterarQuantidade(${index}, -1)">
                        −
                    </button>

                    <span>${item.quantidade}</span>

                    <button type="button"
                        onclick="alterarQuantidade(${index}, 1)">
                        +
                    </button>

                </div>

                <button type="button"
                    class="remover-item"
                    onclick="removerProduto(${index})">

                    🗑️ Remover

                </button>

            </div>
        `;

    });

    // ATUALIZAR TOTAL
    valorTotal.textContent = formatarMoeda(total);

    // LIBERAR FINALIZAÇÃO
    finalizarPedido.disabled = false;

    // ATUALIZAR CABEÇALHO
    atualizarResumoCarrinho();

}


/* =========================================
   ALTERAR QUANTIDADE
========================================= */

function alterarQuantidade(index, quantidade) {

    if (!carrinho[index]) {
        return;
    }

    carrinho[index].quantidade += quantidade;

    // REMOVER SE CHEGAR A ZERO
    if (carrinho[index].quantidade <= 0) {

        carrinho.splice(index, 1);

    }

    atualizarCarrinho();

}


/* =========================================
   REMOVER PRODUTO
========================================= */

function removerProduto(index) {

    if (!carrinho[index]) {
        return;
    }

    carrinho.splice(index, 1);

    atualizarCarrinho();

}


/* =========================================
   FINALIZAR PEDIDO PELO WHATSAPP
========================================= */

function finalizarPedido() {

    if (carrinho.length === 0) {

        alert("Sua sacola está vazia!");

        return;

    }

    const total = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade,
        0
    );

    let mensagem = "🍔 *NOVO PEDIDO - DOCE AGRADO* 🍰\n\n";

    mensagem += "*🛍️ Produtos:*\n";

    carrinho.forEach(item => {

        mensagem += `• ${item.quantidade}x ${item.nome}`;

        mensagem += ` - ${formatarMoeda(item.preco * item.quantidade)}\n`;

    });

    mensagem += `\n*💰 Total: ${formatarMoeda(total)}*\n`;

    mensagem += "\nObrigado pelo pedido! ❤️";

    // TROQUE PELO NÚMERO REAL DA LOJA
    const telefone = "5588999999999";

    const link =
        `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(link, "_blank");

}


/* =========================================
   INICIALIZAÇÃO
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    atualizarCarrinho();

});