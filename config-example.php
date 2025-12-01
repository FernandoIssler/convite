<?php
/**
 * Configuração do banco de dados para XAMPP
 * Ajuste estas configurações conforme seu ambiente XAMPP
 */

// Configurações do banco de dados
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'convite_formatura');
define('DB_USER', 'root');
define('DB_PASS', ''); // XAMPP geralmente usa senha vazia por padrão
define('DB_CHARSET', 'utf8mb4');

/**
 * Função para conectar ao banco de dados
 */
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Se o banco não existir, tenta criar
        if ($e->getCode() == 1049) {
            createDatabase();
            return getDBConnection();
        }
        throw $e;
    }
}

/**
 * Cria o banco de dados se não existir
 */
function createDatabase() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS);
        $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    } catch (PDOException $e) {
        error_log("Erro ao criar banco de dados: " . $e->getMessage());
    }
}

/**
 * Função para enviar resposta JSON
 */
function sendJSON($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

/**
 * Função para enviar erro JSON
 */
function sendError($message, $statusCode = 400) {
    sendJSON([
        'success' => false,
        'error' => $message
    ], $statusCode);
}

