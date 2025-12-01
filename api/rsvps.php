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
    
    // Buscar todas as confirmações ordenadas por data (mais recentes primeiro)
    $stmt = $pdo->query("
        SELECT 
            id,
            guest_name as guestName,
            companions,
            attendance,
            message,
            created_at as createdAt
        FROM rsvps
        ORDER BY created_at DESC
    ");
    
    $rsvps = $stmt->fetchAll();
    
    sendJSON([
        'success' => true,
        'data' => $rsvps
    ]);
    
} catch (PDOException $e) {
    error_log("Erro ao buscar RSVPs: " . $e->getMessage());
    sendError('Erro ao buscar confirmações', 500);
} catch (Exception $e) {
    error_log("Erro geral: " . $e->getMessage());
    sendError('Erro inesperado', 500);
}

