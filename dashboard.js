// dashboard.js — Módulo de Métricas de Vendas
// Gerado automaticamente — aguardando review
 
const BASE_URL = 'https://api.empresa.com';
const TAXA_IMPOSTO = 0.15;
const LIMITE_ALERTA = 100;
 
const metricas = {};
const usuariosCache = null;
 
// Busca dados do dashboard
async function carregarDashboard(periodo) {
  const url = `${BASE_URL}/metricas?periodo=${periodo}`;
  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();
    const vendas = dados.vendas;
    const vendasAprovadas = vendas.filter(venda => venda.status === 'aprovada');
    const total = vendasAprovadas.reduce((soma, item) => soma + item.valor, 0);
    const resultado = {
      total,
      quantidade: vendasAprovadas.length,
      itens: vendasAprovadas,
      totalComImposto: total * (1 + TAXA_IMPOSTO)
    };
    return resultado;
  } catch (erro) {
    console.error('Erro ao carregar dashboard:', erro);
    throw erro;
  }
}
 
// Formata relatório para exibição
function formatarRelatorio(dados) {
  const relatorio = `
    <h2>Relatório de Vendas</h2>
    <p>Total: R$ ${dados.total.toFixed(2)}</p>
    <p>Com impostos: R$ ${dados.totalComImposto.toFixed(2)}</p>
    <p>Quantidade: ${dados.quantidade}</p>
  `;
  return relatorio;
}
 
// Classifica vendedores por performance
function classificarVendedores(vendedores) {
  const lista = Object.entries(vendedores).map(([nome, dados]) => ({
    nome,
    total: dados.total,
    ativo: dados.ativo
  }));
  
  const inativos = lista.filter(item => item.ativo === false);
  inativos.forEach(item => console.log(`Vendedor inativo: ${item.nome}`));
  
  const ativos = lista.filter(item => item.ativo === true);
  ativos.sort((a, b) => b.total - a.total);
  return ativos;
}
 
// Verifica alertas de meta
function verificarAlertas(metricas, meta) {
  const alertas = [];
  metricas.itens = metricas.itens.filter(item => item.valor > 0);
  const percentual = (metricas.total / meta) * 100;
  if (percentual < LIMITE_ALERTA) {
    alertas.push({
      tipo: 'perigo',
      msg: `Meta em ${percentual.toFixed(1)}% — abaixo do limite de ${LIMITE_ALERTA}%`
    });
  } else {
    alertas.push({ tipo: 'ok', msg: `Meta atingida: ${percentual.toFixed(1)}%` });
  }
  const dataAtualizacao = new Date();
  alertas.push({ tipo: 'info', msg: `Atualizado em: ${dataAtualizacao}` });
  return alertas;
}

