// auth.js - Módulo de Autenticação (atualizado para o dashboard responsivo)

/**
 * Registra um novo usuário no sistema
 * @param {string} nome - Nome completo do usuário
 * @param {string} email - E-mail do usuário
 * @param {string} senha - Senha do usuário (em produção, isso deve ser criptografado)
 * @returns {boolean} - True se o cadastro foi bem-sucedido
 */
export function registerUser(nome, email, senha) {
  if (!nome || !email || !senha) {
    console.error('Todos os campos são obrigatórios');
    return false;
  }

  // Verifica se o usuário já existe
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuarioExistente = usuarios.find(u => u.email === email);

  if (usuarioExistente) {
    console.error('E-mail já cadastrado');
    return false;
  }

  // Armazena o novo usuário (EM PRODUÇÃO, CRIPTOGRAFAR A SENHA)
  const novoUsuario = {
    nome,
    email,
    senha, // ATENÇÃO: Em produção, usar biblioteca como bcrypt.js
    dataCadastro: new Date().toISOString(),
    pontos: 0,
    nivel: 'Iniciante',
    metaMensal: 100 // kg
  };

  usuarios.push(novoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  // Automaticamente loga o usuário após cadastro
  localStorage.setItem('usuarioLogado', 'true');
  localStorage.setItem('usuarioEmail', email);
  localStorage.setItem('usuarioNome', nome);

  return true;
}

/**
 * Realiza o login do usuário
 * @param {string} email - E-mail do usuário
 * @param {string} senha - Senha do usuário
 * @returns {boolean} - True se o login foi bem-sucedido
 */
export function login(email, senha) {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuario) {
    localStorage.setItem('usuarioLogado', 'true');
    localStorage.setItem('usuarioEmail', usuario.email);
    localStorage.setItem('usuarioNome', usuario.nome);
    return true;
  }

  console.error('E-mail ou senha incorretos');
  return false;
}

/**
 * Realiza o logout do usuário
 */
export function logout() {
  localStorage.removeItem('usuarioLogado');
  localStorage.removeItem('usuarioEmail');
  localStorage.removeItem('usuarioNome');
  window.location.href = 'index.html';
}

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean} - True se o usuário está logado
 */
export function isAuthenticated() {
  return localStorage.getItem('usuarioLogado') === 'true';
}

/**
 * Redireciona para login se não autenticado
 */
export function checkAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'index.html';
  }
}

/**
 * Obtém os dados do usuário logado
 * @returns {object|null} - Dados do usuário ou null se não logado
 */
export function getCurrentUser() {
  if (!isAuthenticated()) return null;

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const email = localStorage.getItem('usuarioEmail');
  return usuarios.find(u => u.email === email);
}

/**
 * Adiciona pontos ao usuário logado
 * @param {number} pontos - Pontos a serem adicionados
 */
export function addPontos(pontos) {
  if (!isAuthenticated()) return;

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const email = localStorage.getItem('usuarioEmail');
  const usuarioIndex = usuarios.findIndex(u => u.email === email);

  if (usuarioIndex !== -1) {
    usuarios[usuarioIndex].pontos = (usuarios[usuarioIndex].pontos || 0) + pontos;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }
}

/**
 * Atualiza a meta de reciclagem do usuário
 * @param {number} kg - Meta em quilogramas
 */
export function updateMetaMensal(kg) {
  if (!isAuthenticated()) return;

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const email = localStorage.getItem('usuarioEmail');
  const usuarioIndex = usuarios.findIndex(u => u.email === email);

  if (usuarioIndex !== -1) {
    usuarios[usuarioIndex].metaMensal = kg;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }
}