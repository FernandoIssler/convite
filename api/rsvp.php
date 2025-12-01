<?php
require_once '../config.php';

// Permitir requisições de qualquer origem (CORS)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Apenas aceitar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Método não permitido', 405);
}

// Ler dados JSON do corpo da requisição
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    sendError('Dados inválidos');
}

// Validar dados obrigatórios
$guestName = trim($data['guestName'] ?? '');
$companions = isset($data['companions']) ? (int)$data['companions'] : 0;
$attendance = $data['attendance'] ?? '';
$message = isset($data['message']) ? trim($data['message']) : null;

if (empty($guestName)) {
    sendError('Nome é obrigatório');
}

if ($attendance !== 'sim' && $attendance !== 'nao') {
    sendError('Confirmação de presença inválida');
}

try {
    $pdo = getDBConnection();
    
    // Criar tabela se não existir
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS rsvps (
            id INT AUTO_INCREMENT PRIMARY KEY,
            guest_name VARCHAR(255) NOT NULL,
            companions INT DEFAULT 0,
            attendance ENUM('sim', 'nao') NOT NULL,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    
    // Inserir confirmação
    $stmt = $pdo->prepare("
        INSERT INTO rsvps (guest_name, companions, attendance, message)
        VALUES (:guest_name, :companions, :attendance, :message)
    ");
    
    $stmt->execute([
        ':guest_name' => $guestName,
        ':companions' => $companions,
        ':attendance' => $attendance,
        ':message' => $message ?: null
    ]);
    
    $rsvpId = $pdo->lastInsertId();
    
    $totalPeople = ($attendance === 'sim') ? (1 + $companions) : 0;
    
    if ($attendance === 'sim') {
        if ($companions === 0) {
            $messageText = 'Presença confirmada com sucesso! 🎉 (Você: 1 pessoa)';
        } else if ($companions === 1) {
            $messageText = "Presença confirmada com sucesso! 🎉 (Você: 1 pessoa + {$companions} acompanhante = {$totalPeople} pessoas no total)";
        } else {
            $messageText = "Presença confirmada com sucesso! 🎉 (Você: 1 pessoa + {$companions} acompanhantes = {$totalPeople} pessoas no total)";
        }
    } else {
        $messageText = 'Registramos que você não poderá comparecer. Sentiremos sua falta! 😢';
    }
    
    sendJSON([
        'success' => true,
        'message' => $messageText,
        'data' => [
            'id' => $rsvpId,
            'guestName' => $guestName,
            'companions' => $companions,
            'attendance' => $attendance,
            'message' => $message,
            'createdAt' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Erro ao salvar RSVP: " . $e->getMessage());
    sendError('Erro ao processar confirmação. Tente novamente.', 500);
} catch (Exception $e) {
    error_log("Erro geral: " . $e->getMessage());
    sendError('Erro inesperado. Tente novamente.', 500);
}

