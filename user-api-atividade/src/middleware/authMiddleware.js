const jwt = require('jsonwebtoken');

// Middleware -> Autenticação
export function authenticate(req, res, next) {
    // Capturando token da requisição
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({
            msg: "Token not provided"
        });

    }

    const [bearer, token] = authHeader.split(" ");

}