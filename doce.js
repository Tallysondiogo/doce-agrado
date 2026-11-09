/* =========================================
   DOCE AGRADO - SACOLA DE COMPRAS
========================================= */

// SACOLA
let carrinho = [];


/* =========================================
   FORMATAR MOEDA
========================================= */

function formatarMoeda(valor) {

    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


/* =========================================
   BUSCAR IMAGEM DO PRODUTO
========================================= */

function buscarImagemProduto(nome) {

    const produtos = document.querySelectorAll(".produto");

    for (const produto of produtos) {

        const titulo = produto.querySelector("h3");
        const imagem = produto.querySelector("img");

        if (
            titulo &&
            imagem &&
            titulo.textContent.trim() === nome
        ) {

            return imagem.getAttribute("src");

        }

    }

    return "";

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

    if (!painel || !fundo) return;

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

    if (painel) {
        painel.classList.remove("aberto");
    }

    if (fundo) {
        fundo.classList.remove("aberto");
    }

    document.body.style.overflow = "";

}


/* =========================================
   ATUALIZAR RESUMO DO CABEÇALHO
========================================= */

function atualizarResumoCarrinho() {

    const quantidadeCabecalho =
        document.getElementById("quantidade-cabecalho");

    const totalCabecalho =
        document.getElementById("total-cabecalho");

    const quantidadePainel =
        document.getElementById("quantidade-painel");

    // QUANTIDADE
    const quantidade = carrinho.reduce(
        (total, item) => total + item.quantidade,
        0
    );

    // TOTAL
    const total = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade,
        0
    );

    // CABEÇALHO
    if (quantidadeCabecalho) {

        quantidadeCabecalho.textContent =
            quantidade +
            (quantidade === 1 ? " produto" : " produtos");

    }

    if (totalCabecalho) {

        totalCabecalho.textContent =
            formatarMoeda(total);

    }

    // PAINEL
    if (quantidadePainel) {

        quantidadePainel.textContent =
            quantidade +
            (quantidade === 1 ? " item" : " itens");

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

        const imagem = buscarImagemProduto(nome);

        carrinho.push({

            nome: nome,

            preco: Number(preco),

            quantidade: 1,

            imagem: imagem

        });

    }

    atualizarCarrinho();

}


/* =========================================
   ADICIONAR BOLO PERSONALIZADO
========================================= */

function adicionarBolo() {

    const tamanho =
        document.getElementById("tamanho-bolo").value;

    const massa =
        document.getElementById("massa-bolo").value;

    const recheio1 =
        document.getElementById("recheio-bolo-1").value;

    const recheio2 =
        document.getElementById("recheio-bolo-2").value;

    if (!tamanho || !massa || !recheio1) {

        alert(
            "Escolha o tamanho, a massa e o primeiro recheio do bolo!"
        );

        return;

    }

    const preco = Number(tamanho);

    const nome =
        `Bolo ${massa} - ${recheio1}` +
        (recheio2 ? ` + ${recheio2}` : "");

    carrinho.push({

        nome: nome,

        preco: preco,

        quantidade: 1,

        imagem: buscarImagemProduto(nome)

    });

    atualizarCarrinho();

    alert("Bolo adicionado à sua sacola! ❤️");

}


/* =========================================
   ATUALIZAR SACOLA
========================================= */

function atualizarCarrinho() {

    const itensCarrinho =
        document.getElementById("itens-carrinho");

    const valorTotal =
        document.getElementById("valor-total");

    const finalizarPedido =
        document.getElementById("finalizar-pedido");

    // TOTAL GERAL
    const total = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade,
        0
    );

    // ATUALIZAR CABEÇALHO
    atualizarResumoCarrinho();

    // SE NÃO EXISTIR SACOLA
    if (!itensCarrinho) {

        if (valorTotal) {
            valorTotal.textContent = formatarMoeda(total);
        }

        return;

    }

    // LIMPAR LISTA
    itensCarrinho.innerHTML = "";

    // SACOLA VAZIA
    if (carrinho.length === 0) {

        itensCarrinho.innerHTML = `

            <div class="carrinho-vazio">

                <span class="sacola-vazia-icone">
                    🛒
                </span>

                <h3>Sua sacola está vazia!</h3>

                <p>Que tal escolher algo delicioso? 💕</p>

            </div>

        `;

        if (valorTotal) {
            valorTotal.textContent = formatarMoeda(0);
        }

        if (finalizarPedido) {
            finalizarPedido.disabled = true;
        }

        return;

    }

    // LISTAR PRODUTOS
    carrinho.forEach((item, index) => {

        const subtotal =
            item.preco * item.quantidade;

        // IMAGEM
        const imagemHTML = item.imagem
            ? `
                <img
                    src="${item.imagem}"
                    alt="${item.nome}"
                    class="item-carrinho-imagem"
                >
            `
            : `
                <div class="item-carrinho-imagem-placeholder">
                    🍔
                </div>
            `;

        // CRIAR CARD
        const elemento = document.createElement("div");

        elemento.className = "item-carrinho";

        elemento.innerHTML = `

            ${imagemHTML}

            <div class="item-carrinho-info">

                <h3>${item.nome}</h3>

                <p>
                    ${formatarMoeda(item.preco)} cada
                </p>

                <strong>
                    ${formatarMoeda(subtotal)}
                </strong>

                <div class="controles-quantidade">

                    <button
                        type="button"
                        onclick="alterarQuantidade(${index}, -1)"
                        aria-label="Diminuir quantidade"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantidade}
                    </span>

                    <button
                        type="button"
                        onclick="alterarQuantidade(${index}, 1)"
                        aria-label="Aumentar quantidade"
                    >
                        +
                    </button>

                </div>

                <button
                    type="button"
                    class="remover-item"
                    onclick="removerProduto(${index})"
                >
                    🗑️ Remover
                </button>

            </div>

        `;

        itensCarrinho.appendChild(elemento);

    });

    // ATUALIZAR TOTAL
    if (valorTotal) {

        valorTotal.textContent =
            formatarMoeda(total);

    }

    // LIBERAR FINALIZAÇÃO
    if (finalizarPedido) {

        finalizarPedido.disabled = false;

    }

}


/* =========================================
   ALTERAR QUANTIDADE
========================================= */

function alterarQuantidade(index, quantidade) {

    if (!carrinho[index]) return;

    carrinho[index].quantidade += quantidade;

    // REMOVER QUANDO CHEGAR A ZERO
    if (carrinho[index].quantidade <= 0) {

        carrinho.splice(index, 1);

    }

    atualizarCarrinho();

}


/* =========================================
   REMOVER PRODUTO
========================================= */

function removerProduto(index) {

    if (!carrinho[index]) return;

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

    let mensagem =
        "🍔 *NOVO PEDIDO - DOCE AGRADO* 🍰\n\n";

    mensagem += "*🛍️ Produtos:*\n";

    carrinho.forEach(item => {

        mensagem +=
            `• ${item.quantidade}x ${item.nome}`;

        mensagem +=
            ` - ${formatarMoeda(item.preco * item.quantidade)}\n`;

    });

    mensagem +=
        `\n*💰 Total: ${formatarMoeda(total)}*\n`;

    mensagem +=
        "\nObrigado pelo pedido! ❤️";

    // NÚMERO DA LOJA
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