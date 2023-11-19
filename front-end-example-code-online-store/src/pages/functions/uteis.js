export function setvibility(componente, text, focus) {
    // setando a mensagem no campo do elemento
    componente.setCustomValidity(text + "")

    if (focus) {
        // da visibilidade na hora
        componente.reportValidity();

    }


}

export function elementred(componente) {
    // Adiciona uma borda vermelha
    componente.style.border = "1px solid #FF0000";

    // Desabilita o foco no input
    componente.tabIndex = -1;

    // Habilite a visibilidade do .asterisk
    const asterisk = componente.parentNode.querySelector('.asterisk');
    if (asterisk) {
        asterisk.style.visibility = 'visible';
    }

}

export function resetborder(componente) {
    componente.style.border = "1px solid #ccc";
    componente.tabIndex = -1;

    // Desabilite a visibilidade do .asterisk
    const asterisk = componente.parentNode.querySelector('.asterisk');
    if (asterisk) {
        asterisk.style.visibility = 'hidden';
    }

}