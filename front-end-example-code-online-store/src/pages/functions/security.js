const CryptoJS = require('crypto-js');
export function encryptData(data, secretKey) {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encryptedData;
}

// Função para descriptografar os dados
export function decryptData(encryptedData, secretKey) {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
}