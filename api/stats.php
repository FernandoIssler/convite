<?php
require_once '../config.php';

// Permitir requisições de qualquer origem (CORS)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Apenas aceitar GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Método não permitido', 405);
}

try {
    $pdo = getDBConnection();
    // Garantir colunas de eventos existem
    try { $pdo->exec("ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS ceremony TINYINT(1) DEFAULT 0"); } catch (Exception $e) {}
    try { $pdo->exec("ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS culto TINYINT(1) DEFAULT 0"); } catch (Exception $e) {}
    
    // Buscar estatísticas
    $stmt = $pdo->query("
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN attendance = 'sim' THEN 1 ELSE 0 END) as confirmados,
                SUM(CASE WHEN attendance = 'nao' THEN 1 ELSE 0 END) as naoConfirmados,
                SUM(companions) as totalAcompanhantes,
                SUM(CASE WHEN attendance = 'sim' THEN companions ELSE 0 END) as acompanhantesConfirmados,
                SUM(CASE WHEN attendance = 'sim' AND ceremony = 1 THEN 1 ELSE 0 END) as ceremonyConfirmados,
                SUM(CASE WHEN attendance = 'sim' AND culto = 1 THEN 1 ELSE 0 END) as cultoConfirmados,
                SUM(CASE WHEN attendance = 'sim' AND ceremony = 1 THEN 1 + companions ELSE 0 END) as ceremonyPessoas,
                SUM(CASE WHEN attendance = 'sim' AND culto = 1 THEN 1 + companions ELSE 0 END) as cultoPessoas
        FROM rsvps
    ");
    
    $row = $stmt->fetch();
    
    sendJSON([
        'success' => true,
        'data' => [
            'total' => (int)($row['total'] ?? 0),
            'confirmados' => (int)($row['confirmados'] ?? 0),
            'naoConfirmados' => (int)($row['naoConfirmados'] ?? 0),
            'totalAcompanhantes' => (int)($row['totalAcompanhantes'] ?? 0),
            'acompanhantesConfirmados' => (int)($row['acompanhantesConfirmados'] ?? 0),
                'totalPessoas' => (int)($row['confirmados'] ?? 0) + (int)($row['acompanhantesConfirmados'] ?? 0),
                'ceremonyConfirmados' => (int)($row['ceremonyConfirmados'] ?? 0),
                'cultoConfirmados' => (int)($row['cultoConfirmados'] ?? 0),
                'ceremonyPessoas' => (int)($row['ceremonyPessoas'] ?? 0),
                'cultoPessoas' => (int)($row['cultoPessoas'] ?? 0)
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Erro ao buscar estatísticas: " . $e->getMessage());
    sendError('Erro ao buscar estatísticas', 500);
} catch (Exception $e) {
    error_log("Erro geral: " . $e->getMessage());
    sendError('Erro inesperado', 500);
}

