export async function httpFetch(method, httpredirect, json, token, contentType) {
    try {
        if (!token) {
            const response = await fetch(httpredirect, {
                method: method,
                headers: {
                    'Content-Type': 'application/json', // ajuste o tipo de conteúdo conforme necessário
                },
                body: JSON.stringify(json),
            });
            return response.json();
        }
        if(contentType){
            const response = await fetch(httpredirect, {
                method: method,
                body: JSON.stringify(json),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Substitua pelo token de autenticação do usuário
                },
                
            });
            return response.json();
        }
        else {
            const response = await fetch(httpredirect, {
                method: method,
                body: json,
                headers: {
                    Authorization: `Bearer ${token}`, // Substitua pelo token de autenticação do usuário
                },
                
            });
            return response.json();
        }

    } catch (error) {
        return ({ 'msg': 'Servidor indisponivel,\n tente novamente mais tarde' })
    };
};

/*
export async function httpFetch(method, httpredirect, json) {
    try {
        const response = await fetch(httpredirect, {
            method: method,
            headers: {
                'Content-Type': 'application/json', // ajuste o tipo de conteúdo conforme necessário
            },
            body: JSON.stringify(json),
        });
        return response.json();
    } catch (error) {
        return ({ 'msg': 'Servidor indisponivel,\n tente novamente mais tarde' })
    };
};
 */