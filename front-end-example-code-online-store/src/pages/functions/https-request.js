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
        return ('msg: ', error)
    };
};

/*
export async function httpFetch(method, httpredirect, json) {

    await fetch(httpredirect, {
        method: method,
        headers: {
            'Content-Type': 'application/json', // ajuste o tipo de conteúdo conforme necessário
        },
        body: JSON.stringify(json),
    }).then(response => response.json()).then(data=>console.log(data)).catch(error => {
            return ('msg: ', error)
        });
};
 */