# Timeline de Atores - Aplicação Web

Esta é uma aplicação web que permite buscar informações sobre filmes e visualizar uma timeline dos atores principais com suas datas de nascimento e morte.

## Funcionalidades

- 🎬 Busca de filmes por nome
- 👥 Exibição dos atores principais do filme
- 📅 Timeline visual com datas de nascimento e morte dos atores
- 🎨 Interface moderna e responsiva
- 🤖 Integração com API Groq Cloud (Llama 3)

## Tecnologias Utilizadas

- **HTML5** - Estrutura da página
- **CSS3** - Estilização e layout responsivo
- **JavaScript ES6+** - Lógica da aplicação
- **API Groq Cloud** - Busca de informações sobre filmes e atores
- **Fetch API** - Requisições HTTP

## Como Usar

1. Abra o arquivo `index.html` em seu navegador
2. Digite o nome de um filme no campo de busca
3. Clique no botão "Buscar" ou pressione Enter
4. Aguarde o carregamento das informações
5. Visualize a timeline dos atores principais

## Estrutura do Projeto

```
movie-timeline-app/
├── index.html          # Página principal
├── style.css           # Estilos da aplicação
├── script.js           # Lógica JavaScript
└── README.md           # Documentação
```

## Recursos da Interface

### Design
- Gradiente roxo moderno
- Cards com sombras e bordas arredondadas
- Timeline vertical com alternância esquerda/direita
- Indicadores visuais para cada ator na timeline
- Layout totalmente responsivo para mobile

### Timeline
- Ordenação cronológica por data de nascimento
- Informações de idade atual ou idade ao morrer
- Personagens interpretados pelos atores
- Design alternado (esquerda/direita) para melhor visualização

## Configuração da API

A aplicação está configurada para usar a API Groq Cloud com o modelo Llama 3. A chave da API está integrada no código para facilitar o uso.

## Exemplos de Filmes para Testar

- Titanic
- Matrix
- Forrest Gump
- Pulp Fiction
- The Godfather
- Star Wars
- Avatar
- Inception

## Compatibilidade

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Dispositivos móveis (iOS/Android)

## Limitações

- Requer conexão com a internet para funcionar
- Dependente da disponibilidade da API Groq Cloud
- Informações limitadas ao conhecimento do modelo de IA
- Algumas datas podem não estar disponíveis para atores menos conhecidos

## Desenvolvido por

Esta aplicação foi desenvolvida como demonstração de integração entre frontend moderno e APIs de IA generativa.

