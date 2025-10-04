/**
 * Controlador para información de contacto del desarrollador
 * Este controlador maneja la información de contacto y enlaces personales
 */

/**
 * Obtener información de contacto del desarrollador
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
const getContactInfo = (req, res) => {
    try {
        // Información de contacto del desarrollador
        const contactInfo = {
            developer: {
                name: "Andrés Felipe",
                email: "andres18160@gmail.com",
                github: "https://github.com/andres18160",
                linkedin: "https://linkedin.com/in/andres-felipe", // Opcional: puedes agregar tu LinkedIn
                portfolio: "https://andresfelipe.dev" // Opcional: tu sitio web personal
            },
            project: {
                name: "API REST PoliTest",
                version: "1.0.0",
                description: "API REST para gestión de pacientes y citas médicas",
                repository: "https://github.com/andres18160/ApirestPoliTEst",
                documentation: `${process.env.PUBLIC_URL || 'http://localhost:3000'}/documentacion`
            },
            api: {
                baseUrl: `${process.env.PUBLIC_URL || 'http://localhost:3000'}/api`,
                endpoints: {
                    auth: "/auth",
                    pacientes: "/pacientes", 
                    citas: "/citas"
                }
            }
        };

        // Respuesta exitosa
        res.status(200).json({
            success: true,
            message: "Información de contacto obtenida exitosamente",
            data: contactInfo
        });

    } catch (error) {
        // Manejo de errores
        console.error("Error al obtener información de contacto:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

/**
 * Obtener información básica del desarrollador (versión simplificada)
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
const getDeveloperInfo = (req, res) => {
    try {
        const developerInfo = {
            name: "Andrés Felipe",
            email: "andres18160@gmail.com",
            github: "https://github.com/andres18160",
            message: "Desarrollador de esta API REST para gestión médica"
        };

        res.status(200).json({
            success: true,
            data: developerInfo
        });

    } catch (error) {
        console.error("Error al obtener información del desarrollador:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
};

module.exports = {
    getContactInfo,
    getDeveloperInfo
};
