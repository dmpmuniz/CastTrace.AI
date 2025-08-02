# Timeline de Atores - Aplicação Web

Uma aplicação web interativa que permite buscar filmes e visualizar uma timeline dos atores principais com suas datas de nascimento e morte, incluindo fotos de perfil.

## 🎬 Funcionalidades

### ✨ Novas Funcionalidades Adicionadas:

1. **Busca por Sinopse**: Digite uma sinopse e receba 3 sugestões de filmes correspondentes
2. **Fotos de Perfil dos Atores**: Cada ator na timeline agora possui uma foto de perfil
3. **Interface com Abas**: Alterne entre busca por nome do filme e busca por sinopse

### 📋 Funcionalidades Principais:

- **Busca de Filmes**: Digite o nome de um filme para obter informações detalhadas
- **Timeline Interativa**: Visualize os atores organizados cronologicamente por data de nascimento
- **Informações Detalhadas**: Veja dados como:
  - Nome completo do ator
  - Datas de nascimento e morte
  - Idade atual ou idade ao morrer
  - Personagem interpretado no filme
  - Foto de perfil do ator
- **Design Responsivo**: Interface adaptável para desktop e mobile
- **Tratamento de Erros**: Mensagens claras em caso de problemas

## 🚀 Como Usar

### Busca por Nome do Filme:
1. Clique na aba "Buscar por Nome"
2. Digite o nome do filme no campo de busca
3. Clique em "Buscar" ou pressione Enter
4. Visualize as informações do filme e a timeline dos atores

### Busca por Sinopse:
1. Clique na aba "Buscar por Sinopse"
2. Digite ou cole uma sinopse do filme no campo de texto
3. Clique em "Buscar Filmes"
4. Escolha um dos 3 filmes sugeridos clicando nele
5. A aplicação seguirá o fluxo normal exibindo a timeline

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: Groq Cloud (Llama 3) via Cloudflare Workers
- **Imagens**: UI Avatars API para fotos de perfil dos atores
- **Design**: CSS Grid, Flexbox, Gradientes, Animações

## 📁 Estrutura do Projeto

```
movie-timeline-app/
├── index.html          # Página principal
├── style.css           # Estilos da aplicação
├── script.js           # Lógica JavaScript
└── README.md           # Documentação
```

## 🔧 Configuração

### Pré-requisitos:
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com a internet (para acessar as APIs)

### Instalação:
1. Baixe ou clone os arquivos da aplicação
2. Abra o arquivo `index.html` em um navegador web
3. A aplicação estará pronta para uso!

## 🔐 Segurança

A aplicação utiliza um proxy (Cloudflare Workers) para proteger a chave da API Groq Cloud, seguindo as melhores práticas de segurança:

- ✅ Chave da API não exposta no código frontend
- ✅ Requisições passam por proxy seguro
- ✅ Proteção contra exposição acidental em repositórios

## 🎨 Interface

### Design Moderno:
- **Gradiente Roxo**: Visual atrativo e profissional
- **Timeline Alternada**: Atores organizados em lados alternados para melhor visualização
- **Fotos Circulares**: Imagens de perfil dos atores em formato circular
- **Animações Suaves**: Transições e efeitos hover para melhor experiência
- **Sistema de Abas**: Interface intuitiva para alternar entre tipos de busca

### Responsividade:
- Adaptável a diferentes tamanhos de tela
- Interface otimizada para dispositivos móveis
- Elementos redimensionáveis automaticamente

## 📊 Exemplo de Uso

### Busca por Nome:
```
Entrada: "Titanic"
Saída: Timeline com Leonardo DiCaprio, Kate Winslet, etc.
```

### Busca por Sinopse:
```
Entrada: "Um jovem casal se apaixona em um navio que está afundando"
Sugestões: Titanic (1997), A Night to Remember (1958), etc.
```

## 🐛 Solução de Problemas

### Erro "Failed to fetch":
- Verifique sua conexão com a internet
- Certifique-se de que o proxy Cloudflare Workers está funcionando

### Filme não encontrado:
- Tente variações do nome do filme
- Use nomes em inglês para filmes internacionais
- Verifique a ortografia

### Fotos não carregam:
- As fotos são geradas automaticamente baseadas no nome do ator
- Em caso de falha, um avatar padrão será exibido

## 📝 Notas Técnicas

### APIs Utilizadas:
- **Groq Cloud API**: Para processamento de linguagem natural e busca de informações de filmes
- **UI Avatars API**: Para geração de fotos de perfil dos atores

### Limitações:
- Dependente de conexão com internet
- Precisão dos dados depende da qualidade da resposta da API
- Fotos são avatares gerados, não fotos reais dos atores

## 🔄 Atualizações Recentes

**Versão 2.0** (Atual):
- ✅ Adicionada busca por sinopse com sugestões
- ✅ Implementadas fotos de perfil dos atores
- ✅ Interface com sistema de abas
- ✅ Melhorias no design e responsividade

**Versão 1.0**:
- ✅ Busca básica por nome do filme
- ✅ Timeline de atores
- ✅ Informações básicas dos filmes

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a seção "Solução de Problemas"
2. Confirme que todos os arquivos estão presentes
3. Teste em um navegador diferente

---

**Desenvolvido com ❤️ usando tecnologias web modernas**

