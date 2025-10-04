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
-- TABLA: STORAGES (Almacenamiento de archivos)
-- =====================================================
CREATE TABLE IF NOT EXISTS `storages` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(500) NOT NULL COMMENT 'URL del archivo almacenado',
    `filename` VARCHAR(255) NULL COMMENT 'Nombre original del archivo',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    PRIMARY KEY (`id`),
    INDEX `idx_storages_url` (`url`),
    INDEX `idx_storages_filename` (`filename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabla de archivos almacenados';

-- =====================================================
-- TABLA: TRACKS (Pistas musicales)
-- NOTA: mediaId debe ser INT para ser compatible con storages.id
-- =====================================================
CREATE TABLE IF NOT EXISTS `tracks` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL COMMENT 'Nombre de la pista',
    `album` VARCHAR(255) NULL COMMENT 'Nombre del álbum',
    `cover` VARCHAR(500) NULL COMMENT 'URL de la portada del álbum',
    `artist_name` VARCHAR(255) NULL COMMENT 'Nombre real del artista',
    `artist_nickname` VARCHAR(255) NULL COMMENT 'Nombre artístico',
    `artist_nationality` VARCHAR(100) NULL COMMENT 'Nacionalidad del artista',
    `duration_start` INT NULL COMMENT 'Duración de inicio en segundos',
    `duration_end` INT NULL COMMENT 'Duración de fin en segundos',
    `mediaId` INT NULL COMMENT 'ID del archivo de audio en storage',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    PRIMARY KEY (`id`),
    INDEX `idx_tracks_name` (`name`),
    INDEX `idx_tracks_album` (`album`),
    INDEX `idx_tracks_artist_name` (`artist_name`),
    INDEX `idx_tracks_mediaId` (`mediaId`),
    CONSTRAINT `fk_tracks_mediaId` FOREIGN KEY (`mediaId`) REFERENCES `storages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabla de pistas musicales';

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

-- Insertar algunos archivos de ejemplo
INSERT INTO `storages` (`url`, `filename`) VALUES 
('https://example.com/audio1.mp3', 'audio1.mp3'),
('https://example.com/audio2.mp3', 'audio2.mp3'),
('https://example.com/cover1.jpg', 'cover1.jpg');

-- Insertar algunas pistas de ejemplo
INSERT INTO `tracks` (`name`, `album`, `cover`, `artist_name`, `artist_nickname`, `artist_nationality`, `duration_start`, `duration_end`, `mediaId`) VALUES 
('Canción de Prueba 1', 'Álbum Demo', 'https://example.com/cover1.jpg', 'Juan Pérez', 'JuanP', 'Colombia', 0, 180, 1),
('Canción de Prueba 2', 'Álbum Demo', 'https://example.com/cover1.jpg', 'María García', 'MariaG', 'México', 0, 200, 2);

-- Insertar algunas citas de ejemplo
INSERT INTO `citas` (`paciente_id`, `fecha`, `hora`, `especialidad`, `estado`) VALUES 
('P001', '2024-01-15', '09:00', 'Cardiología', 'confirmada'),
('P002', '2024-01-15', '10:30', 'Dermatología', 'confirmada'),
('P003', '2024-01-16', '14:00', 'Pediatría', 'pendiente');

-- =====================================================
-- VISTAS ÚTILES (OPCIONAL)
-- =====================================================

-- Vista para tracks con información completa de audio
CREATE OR REPLACE VIEW `v_tracks_complete` AS
SELECT 
    t.id,
    t.name,
    t.album,
    t.cover,
    t.artist_name,
    t.artist_nickname,
    t.artist_nationality,
    t.duration_start,
    t.duration_end,
    s.url as audio_url,
    s.filename as audio_filename,
    t.createdAt,
    t.updatedAt
FROM `tracks` t
LEFT JOIN `storages` s ON t.mediaId = s.id;

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
CREATE INDEX `idx_tracks_artist_album` ON `tracks` (`artist_name`, `album`);
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

-- Procedimiento para limpiar archivos huérfanos en storage
CREATE PROCEDURE CleanOrphanedFiles()
BEGIN
    DELETE FROM storages 
    WHERE id NOT IN (
        SELECT DISTINCT mediaId 
        FROM tracks 
        WHERE mediaId IS NOT NULL
    );
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

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================

/*
INSTRUCCIONES DE USO:

1. Ejecuta este script en tu base de datos MySQL
2. Asegúrate de que las variables de entorno estén configuradas correctamente
3. Los datos de ejemplo son opcionales, puedes eliminarlos si no los necesitas
4. Las vistas y procedimientos almacenados son útiles pero opcionales
5. Ajusta los nombres de las columnas y tipos de datos según tus necesidades específicas

ESTRUCTURA DE TABLAS:
- users: Gestión de usuarios y autenticación
- storages: Almacenamiento de archivos multimedia
- tracks: Catálogo de pistas musicales
- citas: Sistema de citas médicas

RELACIONES:
- tracks.mediaId -> storages.id (relación opcional)
- Las citas están relacionadas con pacientes por paciente_id (tabla de pacientes no incluida)

CARACTERÍSTICAS:
- Todos los campos tienen comentarios descriptivos
- Índices optimizados para consultas frecuentes
- Timestamps automáticos (createdAt, updatedAt)
- Claves foráneas con restricciones apropiadas
- Codificación UTF-8 para soporte de caracteres especiales
*/
