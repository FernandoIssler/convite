const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'rsvp.db');

let db = null;

function initDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        reject(err);
        return;
      }

      // Criar tabela se não existir
      db.run(`
        CREATE TABLE IF NOT EXISTS rsvps (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          guest_name TEXT NOT NULL,
          companions INTEGER DEFAULT 0,
          attendance TEXT NOT NULL CHECK(attendance IN ('sim', 'nao')),
          message TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela:', err);
          reject(err);
        } else {
          console.log('✅ Banco de dados inicializado com sucesso');
          resolve();
        }
      });
    });
  });
}

function saveRSVP({ guestName, companions, attendance, message }) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO rsvps (guest_name, companions, attendance, message)
      VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [guestName, companions, attendance, message], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          id: this.lastID,
          guestName,
          companions,
          attendance,
          message,
          createdAt: new Date().toISOString()
        });
      }
    });
  });
}

function getAllRSVPs() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        id,
        guest_name as guestName,
        companions,
        attendance,
        message,
        created_at as createdAt
      FROM rsvps
      ORDER BY created_at DESC
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getRSVPStats() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN attendance = 'sim' THEN 1 ELSE 0 END) as confirmados,
        SUM(CASE WHEN attendance = 'nao' THEN 1 ELSE 0 END) as naoConfirmados,
        SUM(companions) as totalAcompanhantes,
        SUM(CASE WHEN attendance = 'sim' THEN companions ELSE 0 END) as acompanhantesConfirmados
      FROM rsvps
    `;

    db.get(sql, [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          total: row.total || 0,
          confirmados: row.confirmados || 0,
          naoConfirmados: row.naoConfirmados || 0,
          totalAcompanhantes: row.totalAcompanhantes || 0,
          acompanhantesConfirmados: row.acompanhantesConfirmados || 0,
          totalPessoas: (row.confirmados || 0) + (row.acompanhantesConfirmados || 0)
        });
      }
    });
  });
}

module.exports = {
  initDatabase,
  saveRSVP,
  getAllRSVPs,
  getRSVPStats
};

