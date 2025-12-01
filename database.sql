-- Script SQL para criar o banco de dados e tabela
-- Execute este script no phpMyAdmin ou via linha de comando MySQL

-- Criar banco de dados (se não existir)
CREATE DATABASE IF NOT EXISTS convite_formatura 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE convite_formatura;

-- Criar tabela de confirmações
CREATE TABLE IF NOT EXISTS rsvps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(255) NOT NULL,
    companions INT DEFAULT 0,
    attendance ENUM('sim', 'nao') NOT NULL,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_attendance (attendance),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

