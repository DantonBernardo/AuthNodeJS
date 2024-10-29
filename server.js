// Importando as dependências
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');

// Inicializando o Express
const app = express();

// Configurações de Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'd29ea5225f0bc450db1a56b1279ec507b8ed4f7be237d5443eb66ffa0744927c', // Troque por uma chave segura em produção
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 } // Timer para expirar os cookies registrados no navegador do usuário (10 minutos)
}));

// Função para carregar dados dos usuários registrados no arquivo JSON usando 'fs'
function loadUsers() {
  const data = fs.readFileSync('users.json');
  return JSON.parse(data);
}

// Página de Login
app.get('/login', (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form method="POST" action="/login"> 
      <!-- 
      Método POST serve para enviar dados do formulário de login.
      Se for removido, o formulário usará GET, fato que resulta em:
      - Enviar dados como parâmetros na URL (visíveis).
      - Expor senhas e nomes de usuário.
      - Não ser seguro para informações sensíveis.
      - Login não funcionando corretamente, pois a rota de login espera dados no corpo da requisição (POST).
      -->

      <label>Usuário: 
        <input type="text" name="username" required/>
      </label>

      <br>

      <label>Senha: 
        <input type="password" name="password" required/>
      </label>

      <br>

      <button type="submit">Entrar</button>
    </form>
  `);
});

// Rota de Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password); 

  if (user) {
    req.session.user = user.nome; //Armazenando nome do usuário logado
    res.redirect('/home');
  } else {
    res.send('Usuário ou senha inválidos. <a href="/login">Tente novamente</a>');
  }
});

// Rota de Home
app.get('/home', (req, res) => {
  if (req.session.user) {
    res.send(`
      <h2>Bem-vindo, ${req.session.user}!</h2>
      <p>Você está autenticado.</p>
      <a href="/logout">Sair</a>
    `);
  } else {
    res.redirect('/login');
  }
});

// Rota de Logout 
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid'); // Removendo o cookie da sessão
    res.redirect('/login');
  });
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});