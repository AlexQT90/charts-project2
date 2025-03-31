const chart = LightweightCharts.createChart(document.getElementById('chart'), { width: 800, height: 600 });
const candlestickSeries = chart.addCandlestickSeries();

fetch('https://api.tradingview.com/v1/symbols/NASDAQ:AAPL/history?from=2022-01-01&to=2022-01-31&resolution=D', {
    headers: { 'Authorization': 'Bearer ваш_api_ключ' }  // Замените на ваш ключ
})
.then(response => response.json())
.then(data => {
    const candles = data.t.map((time, index) => ({
        time: time,
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index]
    }));
    candlestickSeries.setData(candles);

    // Пример добавления кастомных линий
    candlestickSeries.createPriceLine({
        price: 150,          // Цена для линии
        color: 'blue',       // Цвет линии
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Solid,
        axisLabelVisible: true,
        title: 'Уровень поддержки'
    });
})
.catch(error => console.error('Ошибка:', error));
