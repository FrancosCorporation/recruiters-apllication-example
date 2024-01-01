const jwt = require('jsonwebtoken');

function gerarTokenWithExpireddataAndData(userInfo, meusegredo, dataExpiredHours) {
    try {
        // Crie um token JWT para o usuário autenticado
        const token = jwt.sign(userInfo, meusegredo, { expiresIn: dataExpiredHours });
        return token;

    } catch (error) {
        console.log(error)
        return false;
    }
}
function verifyTokenValid(token, secretKey) {
    try {
        const internaltoken = jwt.verify(token, secretKey)
        // Verifica se o token é válido
        if (internaltoken !== null) {
            // Se chegou até aqui, o token é válido
            return { 'email': internaltoken.email };
        }
        else {
            return { 'email': null };
        }

    } catch (error) {
        // Se ocorrer algum erro ao verificar o token, ele é considerado inválido
        console.log('Alguem enviou um token errado para validação.');
        return { 'email': null };
    }
}


module.exports = {
    gerarTokenWithExpireddataAndData,
    verifyTokenValid,
};