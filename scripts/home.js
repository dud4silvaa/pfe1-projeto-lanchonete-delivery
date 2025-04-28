const produtos = [
    { id: 1, nome: "Hamburguer", ingredientes: ["Pão", "Carne", "Queijo", "Alface", "Tomate"], preco: 15.00 },
    { id: 2, nome: "X-Burguer", ingredientes: ["Pão", "Carne", "Queijo", "Bacon", "Alface", "Tomate"], preco: 18.00 },
    { id: 3, nome: "X-Salada", ingredientes: ["Pão", "Carne", "Queijo", "Alface", "Tomate", "Cebola"], preco: 20.00 },
    { id: 4, nome: "X-Bacon", ingredientes: ["Pão", "Carne", "Queijo", "Bacon", "Alface", "Tomate"], preco: 25.00 },
    { id: 5, nome: "X-Egg", ingredientes: ["Pão", "Carne", "Queijo", "Bacon", "Alface", "Tomate", "Ovo"], preco: 30.00 },
    { id: 6, nome: "X-Tudo", ingredientes: ["Pão", "Carne", "Queijo", "Bacon", "Alface", "Tomate", "Ovo", "Cebola"], preco: 35.00 }
];

let pedidosExecucao = [];
let pedidosCaminho = [];

window.onload = function() {
    carregarProdutos();
    renderPedidos();
    carregarPedidosFinalizados(); 
}

function carregarProdutos() {
    const select = document.getElementById('produto');
    if (!select) return; 
    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.id;
        option.textContent = `${produto.nome} - R$ ${produto.preco.toFixed(2)}`;
        select.appendChild(option);
    });
}

function gerarPedido() {
    const cliente = document.getElementById('cliente').value;
    const endereco = document.getElementById('endereco').value;
    const produtoId = document.getElementById('produto').value;
    const data = new Date();

    if (cliente && endereco && produtoId) {
        const produtoSelecionado = produtos.find(p => p.id == produtoId);

        const pedido = {
            id: Date.now(),
            cliente,
            endereco,
            produto: produtoSelecionado.nome,
            preco: produtoSelecionado.preco,
            ingredientes: produtoSelecionado.ingredientes,
            dataPedido: data.toLocaleDateString(),
            horaPedido: data.toLocaleTimeString().slice(0,5)
        };

        pedidosExecucao.push(pedido);
        renderPedidos();
        limparCampos();
    } else {
        alert('Preencha todos os campos!');
    }
}

function renderPedidos() {
    const execucaoDiv = document.getElementById('emExecucao');
    const caminhoDiv = document.getElementById('aCaminho');

    if (execucaoDiv) execucaoDiv.innerHTML = '';
    if (caminhoDiv) caminhoDiv.innerHTML = '';

    pedidosExecucao.forEach(pedido => {
        if (!execucaoDiv) return;
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <p><strong>Cliente:</strong> ${pedido.cliente}</p>
            <p><strong>Produto:</strong> ${pedido.produto}</p>
            <p><strong>Preço:</strong> R$ ${pedido.preco.toFixed(2)}</p>
            <p><strong>Ingredientes:</strong> ${pedido.ingredientes.join(', ')}</p>
            <p><strong>Data:</strong> ${pedido.dataPedido}</p>
            <p><strong>Hora:</strong> ${pedido.horaPedido}</p>
            <button onclick="enviarParaCaminho(${pedido.id})">
                <img src="../assets/icone.png" alt="Enviar Entrega" width="20" style="vertical-align: middle; margin-right: 5px;">
                Enviar Entrega
            </button>
        `;
        execucaoDiv.appendChild(div);
    });

    pedidosCaminho.forEach(pedido => {
        if (!caminhoDiv) return;
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <p><strong>Cliente:</strong> ${pedido.cliente}</p>
            <p><strong>Produto:</strong> ${pedido.produto}</p>
            <p><strong>Preço:</strong> R$ ${pedido.preco.toFixed(2)}</p>
            <p><strong>Ingredientes:</strong> ${pedido.ingredientes.join(', ')}</p>
            <p><strong>Data:</strong> ${pedido.dataPedido}</p>
            <p><strong>Hora:</strong> ${pedido.horaPedido}</p>
            <button onclick="finalizarPedido(${pedido.id})">
                <img src="../assets/check.png" alt="Pedido Entregue" width="20" style="vertical-align: middle; margin-right: 5px;">
                Pedido entregue
            </button>
        `;
        caminhoDiv.appendChild(div);
    });
}

function enviarParaCaminho(id) {
    const index = pedidosExecucao.findIndex(p => p.id === id);
    if (index !== -1) {
        const pedido = pedidosExecucao.splice(index, 1)[0];
        pedidosCaminho.push(pedido);
        renderPedidos();
    }
}

function finalizarPedido(id) {
    const index = pedidosCaminho.findIndex(p => p.id === id);
    if (index !== -1) {
        const pedido = pedidosCaminho.splice(index, 1)[0];
        let pedidosFinalizados = JSON.parse(localStorage.getItem('pedidosFinalizados')) || [];
        pedidosFinalizados.push(pedido);
        localStorage.setItem('pedidosFinalizados', JSON.stringify(pedidosFinalizados));
        renderPedidos();
    }
}

function limparCampos() {
    document.getElementById('cliente').value = '';
    document.getElementById('endereco').value = '';
    document.getElementById('produto').value = '';
}


function carregarPedidosFinalizados() {
    const tabela = document.getElementById('tabelaPedidos');
    if (!tabela) return; 
    const tbody = tabela.querySelector('tbody');
    const pedidosFinalizados = JSON.parse(localStorage.getItem('pedidosFinalizados')) || [];

    pedidosFinalizados.forEach(pedido => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="Id">${pedido.id}</td>
            <td data-label="Cliente">${pedido.cliente}</td>
            <td data-label="Endereço">${pedido.endereco}</td>
            <td data-label="Produto">${pedido.produto}</td>
            <td data-label="Preço">R$ ${pedido.preco.toFixed(2)}</td>
            <td data-label="Ingredientes">${pedido.ingredientes.join(', ')}</td>
            <td data-label="Data">${pedido.dataPedido}</td>
            <td data-label="Hora Pedido">${pedido.horaPedido}</td>
        `;
        tbody.appendChild(tr);
    });
}
