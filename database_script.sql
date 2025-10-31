-- =====================================================
-- SCRIPT DE BASE DE DATOS MYSQL PARA API REST
-- Generado basado en los modelos Sequelize existentes
-- =====================================================

-- Crear la base de datos (opcional, descomenta si necesitas crearla)
-- CREATE DATABASE IF NOT EXISTS tu_base_de_datos;
-- USE tu_base_de_datos;

-- =====================================================
-- TABLA: USERS (Usuarios)
-- =====================================================
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL COMMENT 'Nombre del usuario',
    `age` INT NULL COMMENT 'Edad del usuario (opcional)',
    `email` VARCHAR(255) NOT NULL COMMENT 'Email del usuario (único)',
    `password` VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada',
    `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user' COMMENT 'Rol del usuario',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`),
    INDEX `idx_users_role` (`role`),
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabla de usuarios del sistema';


-- =====================================================
-- TABLA: CITAS (Citas médicas)
-- =====================================================
CREATE TABLE IF NOT EXISTS `citas` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `paciente_id` VARCHAR(255) NOT NULL COMMENT 'ID del paciente',
    `fecha` VARCHAR(50) NOT NULL COMMENT 'Fecha de la cita',
    `hora` VARCHAR(20) NOT NULL COMMENT 'Hora de la cita',
    `especialidad` VARCHAR(100) NOT NULL COMMENT 'Especialidad médica',
    `estado` VARCHAR(50) NOT NULL DEFAULT 'confirmada' COMMENT 'Estado de la cita',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    PRIMARY KEY (`id`),
    INDEX `idx_citas_paciente_id` (`paciente_id`),
    INDEX `idx_citas_fecha` (`fecha`),
    INDEX `idx_citas_especialidad` (`especialidad`),
    INDEX `idx_citas_estado` (`estado`),
    INDEX `idx_citas_fecha_hora` (`fecha`, `hora`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabla de citas médicas';

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================

-- Insertar un usuario administrador de ejemplo
INSERT INTO `users` (`name`, `age`, `email`, `password`, `role`) VALUES 
('Administrador', 30, 'admin@example.com', '$2b$10$rQZ8k7X9Y2vL3mN4oP5qQe', 'admin'),
('Usuario Prueba', 25, 'user@example.com', '$2b$10$rQZ8k7X9Y2vL3mN4oP5qQe', 'user');

-- Insertar algunas citas de ejemplo
INSERT INTO `citas` (`paciente_id`, `fecha`, `hora`, `especialidad`, `estado`) VALUES 
('P001', '2024-01-15', '09:00', 'Cardiología', 'confirmada'),
('P002', '2024-01-15', '10:30', 'Dermatología', 'confirmada'),
('P003', '2024-01-16', '14:00', 'Pediatría', 'pendiente');

-- =====================================================
-- VISTAS ÚTILES (OPCIONAL)
-- =====================================================
-- Vista para citas con información del paciente (si tuvieras tabla de pacientes)
CREATE OR REPLACE VIEW `v_citas_info` AS
SELECT 
    c.id,
    c.paciente_id,
    c.fecha,
    c.hora,
    c.especialidad,
    c.estado,
    c.createdAt,
    c.updatedAt
FROM `citas` c;

-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX `idx_citas_fecha_estado` ON `citas` (`fecha`, `estado`);

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES (OPCIONAL)
-- =====================================================

DELIMITER //

-- Procedimiento para obtener estadísticas de citas por especialidad
CREATE PROCEDURE GetCitasStatsByEspecialidad()
BEGIN
    SELECT 
        especialidad,
        COUNT(*) as total_citas,
        SUM(CASE WHEN estado = 'confirmada' THEN 1 ELSE 0 END) as citas_confirmadas,
        SUM(CASE WHEN estado = 'cancelada' THEN 1 ELSE 0 END) as citas_canceladas,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as citas_pendientes
    FROM citas 
    GROUP BY especialidad
    ORDER BY total_citas DESC;
END //

DELIMITER ;

-- =====================================================
-- TABLA: PACIENTES (Sistema de Pacientes)
-- =====================================================
CREATE TABLE IF NOT EXISTS `pacientes` (
    `id` VARCHAR(50) NOT NULL COMMENT 'ID único del paciente',
    `nombre` VARCHAR(100) NOT NULL COMMENT 'Nombre completo del paciente',
    `fecha_nacimiento` DATE NULL COMMENT 'Fecha de nacimiento del paciente',
    `telefono` VARCHAR(15) NULL COMMENT 'Número de teléfono del paciente',
    `email` VARCHAR(100) NULL COMMENT 'Email del paciente',
    `direccion` TEXT NULL COMMENT 'Dirección del paciente',
    `activo` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Estado del paciente (activo/inactivo)',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    PRIMARY KEY (`id`),
    INDEX `idx_pacientes_nombre` (`nombre`),
    INDEX `idx_pacientes_activo` (`activo`),
    INDEX `idx_pacientes_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabla de pacientes del sistema';

-- =====================================================
-- TABLA: HISTORIA_CLINICA (Historia Clínica de Pacientes)
-- =====================================================
CREATE TABLE IF NOT EXISTS `historia_clinica` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `paciente_id` VARCHAR(50) NOT NULL COMMENT 'ID del paciente',
    `tipo_registro` ENUM('diagnostico', 'medicamento', 'procedimiento', 'nota') NOT NULL COMMENT 'Tipo de registro médico',
    `descripcion` TEXT NOT NULL COMMENT 'Descripción del diagnóstico, medicamento o procedimiento',
    `fecha` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha del registro',
    `medico` VARCHAR(100) NULL COMMENT 'Nombre del médico que realizó el registro',
    `observaciones` TEXT NULL COMMENT 'Observaciones adicionales',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    PRIMARY KEY (`id`),
    FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_historia_paciente` (`paciente_id`),
    INDEX `idx_historia_tipo` (`tipo_registro`),
    INDEX `idx_historia_fecha` (`fecha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Historia clínica de los pacientes';

-- =====================================================
-- DATOS DE EJEMPLO PARA PACIENTES
-- =====================================================
INSERT INTO `pacientes` (`id`, `nombre`, `fecha_nacimiento`, `telefono`, `email`, `direccion`) VALUES 
('12345', 'Carlos Gómez', '1985-03-15', '3001234567', 'carlos.gomez@email.com', 'Calle 123 #45-67, Bogotá'),
('67890', 'María Rodríguez', '1990-07-22', '3109876543', 'maria.rodriguez@email.com', 'Carrera 45 #78-90, Medellín'),
('11111', 'Ana García', '1978-11-08', '3155555555', 'ana.garcia@email.com', 'Avenida 5 #12-34, Cali');

-- =====================================================
-- DATOS DE EJEMPLO PARA HISTORIA CLÍNICA
-- =====================================================
INSERT INTO `historia_clinica` (`paciente_id`, `tipo_registro`, `descripcion`, `fecha`, `medico`, `observaciones`) VALUES 
('12345', 'diagnostico', 'Gripe', '2025-09-15', 'Dr. García', 'Paciente con síntomas leves'),
('12345', 'medicamento', 'Paracetamol', '2025-09-15', 'Dr. García', '500mg cada 8 horas por 5 días'),
('12345', 'diagnostico', 'Hipertensión controlada', '2025-09-22', 'Dr. López', 'Presión arterial estable'),
('12345', 'medicamento', 'Losartán', '2025-09-22', 'Dr. López', '50mg diarios'),
('67890', 'diagnostico', 'Migraña', '2025-09-20', 'Dr. Martínez', 'Episodios ocasionales'),
('67890', 'medicamento', 'Ibuprofeno', '2025-09-20', 'Dr. Martínez', '400mg cuando sea necesario');


