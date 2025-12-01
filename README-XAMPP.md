# 🎓 Convite de Formatura GTI - Versão XAMPP

Convite tecnológico e interativo para cerimônia de formatura em Gestão da Tecnologia da Informação.

**Versão adaptada para XAMPP (PHP + MySQL)**

## ✨ Características

- 🎨 Design moderno e tecnológico com efeito Matrix
- 📱 Totalmente responsivo
- 💾 Sistema de confirmação de presença com banco de dados MySQL
- 📊 Painel admin para visualizar confirmações
- ⏱️ Contagem regressiva em tempo real
- 🎯 Interface intuitiva e interativa

## 🚀 Como usar com XAMPP

### 1. Instalar e configurar XAMPP

1. Baixe e instale o XAMPP: https://www.apachefriends.org/
2. Inicie o XAMPP Control Panel
3. Inicie os serviços **Apache** e **MySQL**

### 2. Configurar o projeto

1. Copie a pasta `invite` para a pasta `htdocs` do XAMPP:
   - Windows: `C:\xampp\htdocs\invite`
   - Mac: `/Applications/XAMPP/htdocs/invite`
   - Linux: `/opt/lampp/htdocs/invite`

2. Abra o arquivo `config.php` e ajuste as configurações do banco de dados se necessário:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'convite_formatura');
   define('DB_USER', 'root');
   define('DB_PASS', ''); // XAMPP geralmente usa senha vazia
   ```

### 3. Criar o banco de dados

**Opção 1: Via phpMyAdmin (Recomendado)**

1. Abra o navegador e acesse: `http://localhost/phpmyadmin`
2. Clique em "Novo" no menu lateral para criar um novo banco
3. Nome do banco: `convite_formatura`
4. Collation: `utf8mb4_unicode_ci`
5. Clique em "Criar"
6. Selecione o banco `convite_formatura`
7. Clique na aba "SQL"
8. Cole o conteúdo do arquivo `database.sql` e clique em "Executar"

**Opção 2: Automático (o PHP cria automaticamente na primeira confirmação)**

O banco e a tabela serão criados automaticamente quando alguém fizer a primeira confirmação. Mas é recomendado criar manualmente via phpMyAdmin.

### 4. Configurar informações pessoais

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

### 5. Adicionar sua foto

Coloque uma foto sua na pasta do projeto com o nome `foto.jpg` (ou atualize o caminho no `CONFIG`).

### 6. Acessar o site

Abra o navegador e acesse:

- **Site principal**: `http://localhost/invite/`
- **Painel admin**: `http://localhost/invite/admin.html`

## 📋 Funcionalidades

### Confirmação de Presença

O sistema salva automaticamente todas as confirmações no banco de dados MySQL. Cada confirmação inclui:

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
- **Backend**: PHP 7.4+
- **Banco de dados**: MySQL/MariaDB
- **Servidor**: Apache (XAMPP)
- **Fontes**: Space Grotesk, JetBrains Mono

## 📁 Estrutura de arquivos

```
invite/
├── index.html          # Página principal
├── admin.html          # Painel de administração
├── styles.css          # Estilos
├── main.js             # JavaScript principal
├── config.php          # Configuração do banco de dados
├── api/
│   ├── rsvp.php       # Endpoint para salvar confirmação
│   ├── rsvps.php      # Endpoint para listar confirmações
│   └── stats.php      # Endpoint para estatísticas
├── database.sql       # Script SQL para criar tabela
└── README-XAMPP.md    # Este arquivo
```

## 🔧 Personalização

### Cores e estilos

Edite `styles.css` para personalizar cores, fontes e estilos.

### Efeito Matrix

Ajuste a velocidade e transparência do efeito Matrix em `main.js`, função `initMatrixBackground()`.

### Textos e conteúdo

Todos os textos podem ser editados diretamente no `index.html`.

### Configuração do banco de dados

Se você alterou a senha do MySQL no XAMPP, atualize o arquivo `config.php`:

```php
define('DB_PASS', 'sua_senha_aqui');
```

## 🐛 Solução de problemas

### Erro de conexão com banco de dados

1. Verifique se o MySQL está rodando no XAMPP Control Panel
2. Verifique as credenciais em `config.php`
3. Certifique-se de que o banco `convite_formatura` foi criado

### Erro 404 ao acessar a API

1. Verifique se o Apache está rodando
2. Certifique-se de que os arquivos estão em `htdocs/invite/`
3. Verifique se a URL está correta: `http://localhost/invite/`

### Permissões (Linux/Mac)

Se tiver problemas de permissão, execute:

```bash
chmod -R 755 /Applications/XAMPP/htdocs/invite
```

## 📝 Notas

- O banco de dados MySQL é criado automaticamente na primeira confirmação (mas é recomendado criar manualmente)
- Para fazer backup, exporte o banco `convite_formatura` via phpMyAdmin
- O Apache precisa estar rodando para o site funcionar
- O MySQL precisa estar rodando para o sistema de confirmação funcionar

## 🌐 Compartilhar o site

Para compartilhar o site com outras pessoas na mesma rede:

1. Descubra o IP do seu computador:
   - Windows: `ipconfig` no CMD
   - Mac/Linux: `ifconfig` no terminal
2. Acesse de outro dispositivo: `http://SEU_IP/invite/`

**Importante**: Para acesso externo (internet), você precisará configurar port forwarding no seu roteador ou usar um serviço como ngrok.

## 🎉 Pronto!

Seu convite está pronto para ser compartilhado! Compartilhe o link do site com seus convidados e acompanhe as confirmações pelo painel admin.

