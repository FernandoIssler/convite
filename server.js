const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase, saveRSVP, getAllRSVPs, getRSVPStats } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Inicializar banco de dados
initDatabase();

// Rota para salvar confirmação de presença
app.post('/api/rsvp', async (req, res) => {
  try {
    const { guestName, companions, attendance, message } = req.body;

    // Validação básica
    if (!guestName || !guestName.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nome é obrigatório' 
      });
    }

    if (attendance !== 'sim' && attendance !== 'nao') {
      return res.status(400).json({ 
        success: false, 
        error: 'Confirmação de presença inválida' 
      });
    }

    const rsvp = await saveRSVP({
      guestName: guestName.trim(),
      companions: parseInt(companions) || 0,
      attendance: attendance,
      message: message ? message.trim() : null,
    });

    res.json({
      success: true,
      message: attendance === 'sim' 
        ? 'Presença confirmada com sucesso! 🎉' 
        : 'Registramos que você não poderá comparecer. Sentiremos sua falta! 😢',
      data: rsvp
    });
  } catch (error) {
    console.error('Erro ao salvar RSVP:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro ao processar confirmação. Tente novamente.' 
    });
  }
});

// Rota para listar todas as confirmações (para visualização)
app.get('/api/rsvps', async (req, res) => {
  try {
    const rsvps = await getAllRSVPs();
    res.json({ success: true, data: rsvps });
  } catch (error) {
    console.error('Erro ao buscar RSVPs:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro ao buscar confirmações' 
    });
  }
});

// Rota para estatísticas
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getRSVPStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro ao buscar estatísticas' 
    });
  }
});

// Rota para página admin (visualizar confirmações)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Rota raiz - servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Painel admin em http://localhost:${PORT}/admin`);
});

