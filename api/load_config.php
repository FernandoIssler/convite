<?php
// Tenta carregar o arquivo config.php de vários locais comuns.
// Se não encontrar, envia um erro JSON e encerra (útil para as APIs).

$possible = [
    __DIR__ . '/../config.php',          // padrão: config.php na raiz do site
    __DIR__ . '/config.php',             // caso esteja dentro da pasta api
    __DIR__ . '/../../config.php',       // um nível acima (deploys com estrutura diferente)
];

// Tenta também um caminho dentro do HOME (Hostinger às vezes usa /home/username)
if (!empty(getenv('HOME'))) {
    $possible[] = getenv('HOME') . '/config.php';
}

$loaded = false;
foreach ($possible as $path) {
    if (file_exists($path)) {
        require_once $path;
        $loaded = true;
        break;
    }
}

if (!$loaded) {
    // Se estivermos em ambiente CLI, não enviar JSON
    if (php_sapi_name() === 'cli') {
        fwrite(STDERR, "config.php not found. Tried: \n" . implode("\n", $possible) . "\n");
        exit(1);
    }

    // Responder com JSON de erro para APIs
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'config.php not found on server. Please place config.php in project root or update api/load_config.php.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
