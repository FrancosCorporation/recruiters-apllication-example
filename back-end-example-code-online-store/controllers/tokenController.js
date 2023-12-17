const jwt = require('jsonwebtoken');

function gerarTokenWithExpireddataAndData(userId, meusegredo, dataExpiredHours) {
    try {
        // Crie um token JWT para o usuário autenticado
        const token = jwt.sign({ userId: userId }, meusegredo, { expiresIn: dataExpiredHours });
        console.log(token)
        return token;

    } catch (error) {
        console.log(error)
        return false;
    }
}
function gerarTokenSimple(meusegredo) {
    try {
        // Crie um token JWT para o usuário autenticado
        const token = jwt.sign({}, meusegredo, {});
        return token;

    } catch (error) {
        console.log(error)
        return false;
    }
}
function verifyTokenValid(token, secretKey) {
    try {
        // Verifica se o token é válido
        if (jwt.verify(token, secretKey)) {

            // Se chegou até aqui, o token é válido
            return true;
        }
        else {
            return false;
        }

    } catch (error) {
        // Se ocorrer algum erro ao verificar o token, ele é considerado inválido
        console.log('Alguem enviou um token ou secret key errada para validação.');
        return false;
    }
}


module.exports = {
    gerarTokenWithExpireddataAndData,
    gerarTokenSimple,
    verifyTokenValid,
};