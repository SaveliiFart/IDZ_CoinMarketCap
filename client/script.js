async function getCrypto() {
    const symbol = document.getElementById('symbol').value.trim().toUpperCase();
    if (!/^[A-Z]{2,10}$/.test(symbol)) {
        resDiv.innerHTML = 'Введіть коректний символ криптовалюти (наприклад: BTC, ETH).';
        return;
    }
    const resDiv = document.getElementById('result');
    resDiv.innerHTML = 'Завантаження...';

    try {
        const response = await fetch(`http://192.168.31.102:3000/api/crypto/${symbol}`);
        
        if (!response.ok) {
            throw new Error("Cryptocurrency not found");
        }

        const data = await response.json();

        resDiv.innerHTML = `
            <img src="${data.logo}" width="50" onerror="this.src='default-logo.png'" />
            <h2>${data.symbol}</h2>
            <p><strong>Ціна:</strong> $${data.price}</p>
            <p><strong>Зміна за 24 год:</strong> ${data.change24h}%</p>
            <p>${data.description.slice(0, 300)}...</p>
            <p><a href="${data.website}" target="_blank">Офіційний сайт</a></p>
        `;
    } catch (err) {
        resDiv.innerHTML = '❌ Помилка при отриманні даних.';
    }
}
