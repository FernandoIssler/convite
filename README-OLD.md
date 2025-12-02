# 🎓 Convite de Formatura GTI

Convite tecnológico e interativo para cerimônia de formatura em Gestão da Tecnologia da Informação.

## ✨ Características

- 🎨 Design moderno e tecnológico com efeito Matrix
- 📱 Totalmente responsivo
- 💾 Sistema de confirmação de presença com banco de dados
- 📊 Painel admin para visualizar confirmações
- ⏱️ Contagem regressiva em tempo real
- 🎯 Interface intuitiva e interativa

## 🚀 Como usar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar informações pessoais

Edite o arquivo `main.js` e atualize as informações na constante `CONFIG`:

```javascript
const CONFIG = {
  graduateName: "Seu Nome",
  course: "Gestão da Tecnologia da Informação",
  eventDateTime: "2025-12-01T19:30:00",
  dateLabel: "01/12/2025",
  timeLabel: "19h30",
  place: "Nome do local da cerimônia",
  googleMapsUrl: "https://maps.google.com/...",
  uberUrl: "https://m.uber.com/...",
  photoSrc: "./foto.jpg",
  photoAlt: "Foto de Seu Nome, formando em GTI",
};
```

### 3. Adicionar sua foto

Coloque uma foto sua na pasta do projeto com o nome `foto.jpg` (ou atualize o caminho no `CONFIG`).

### 4. Iniciar o servidor

```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

### 5. Acessar o site

- **Site principal**: http://localhost:3000
- **Painel admin**: http://localhost:3000/admin

## 📋 Funcionalidades

### Confirmação de Presença

O sistema salva automaticamente todas as confirmações em um banco de dados SQLite (`rsvp.db`). Cada confirmação inclui:

- Nome do convidado
- Quantidade de acompanhantes
- Confirmação (sim/não)
- Mensagem opcional
- Data e hora da confirmação

### Painel Admin

Acesse `/admin` para visualizar:

- Estatísticas gerais (total de confirmações, confirmados, etc.)
- Lista completa de todas as confirmações
- Detalhes de cada confirmação

O painel atualiza automaticamente a cada 30 segundos.

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express
- **Banco de dados**: SQLite3
- **Fontes**: Space Grotesk, JetBrains Mono

## 📁 Estrutura de arquivos

```
invite/
├── index.html          # Página principal
├── admin.html          # Painel de administração
├── styles.css          # Estilos
├── main.js             # JavaScript principal
├── server.js           # Servidor Express
├── database.js         # Configuração do banco de dados
├── package.json        # Dependências
├── rsvp.db            # Banco de dados SQLite (criado automaticamente)
└── README.md          # Este arquivo
```

## 🔧 Personalização

### Cores e estilos

Edite `styles.css` para personalizar cores, fontes e estilos.

### Efeito Matrix

Ajuste a velocidade e transparência do efeito Matrix em `main.js`, função `initMatrixBackground()`.

### Textos e conteúdo

Todos os textos podem ser editados diretamente no `index.html`.

## 📝 Notas

- O banco de dados SQLite é criado automaticamente na primeira execução
- O arquivo `rsvp.db` contém todas as confirmações
- Para fazer backup, simplesmente copie o arquivo `rsvp.db`
- O servidor precisa estar rodando para o sistema de confirmação funcionar

## 🎉 Pronto!

Seu convite está pronto para ser compartilhado! Compartilhe o link do site com seus convidados e acompanhe as confirmações pelo painel admin.

