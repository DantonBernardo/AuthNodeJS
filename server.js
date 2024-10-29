//Importando express
const express = require('express');

//Cookies e sessions
const session = require('express-session');
const cookieParser = require('cookie-parser');

//Iniciar o express
const app = express();

//Configurando o uso da biblioteca do cookie
app.use(cookieParser());

//Configurar a sessão
app.use(session({
  secret: 'd29ea5225f0bc450db1a56b1279ec507b8ed4f7be237d5443eb66ffa0744927c',
  resave: false, //evita regravar as sessões que não se alteram
  saveUninitialized: true,
}))

//Dados de exemplo
const produtos = [
  {
    id:1, 
    nome: 'Produto 1', 
    preco: 10
  },
  {
    id:2, 
    nome: 'Produto 2', 
    preco: 15
  },
  {
    id:3, 
    nome: 'Produto 3', 
    preco: 20
  }
];

//Rota de produtos
app.get('/produtos', (req, res) => {
  res.send(`
    <h1>Lista de Produtos</h1>
    <ul>
      ${produtos.map(
        (produto) =>
          `<li>
            ${produto.nome} 
            ${produto.preco}
            <a href="/adicionar/${produto.id}">Adicionar</a>
          </li>`
      ).join('')}
    </ul>
    <a href="/carrinho">Ver Carrinho</a>
  `);
});

//Rota de adicionar o produto
app.get('/adicionar/:id', (req, res)=>{
  const id = parseInt(req.params.id);
  const produto = produtos.find((p) => p.id === id);

  if(produto){
    if(!req.session.carrinho){
      req.session.carrinho = [];
    }
    req.session.carrinho.push(produto);
  }

  res.redirect('/produtos');
});

//Rota do carrinho
app.get('/carrinho', (req, res)=>{
  const carrinho = req.session.carrinho || [];

  res.send(`
    <h1>Carrinho de Compras</h1>
    <ul>
      ${carrinho.map(
        (produto)=>
          `<li>
            ${produto.nome} 
            ${produto.preco}
          </li>`
      ).join('')}
    </ul>

    <a href="/produtos">Continuar comprando</a>
  `);
})

//Servidor
app.listen(3000, ()=>{console.log(`Server listening at http://localhost:3000`)});