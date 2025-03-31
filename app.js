// Функция для парсинга CSV
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
            time: values[0], // Формат, например, 'YYYY-MM-DD'
            open: parseFloat(values[1]),
            high: parseFloat(values[2]),
            low: parseFloat(values[3]),
            close: parseFloat(values[4]),
        };
    });
    return data;
}

// Загрузка и отображение графика
async function loadChart() {
    try {
        const response = await fetch('data.csv');
        if (!response.ok) throw new Error('Ошибка загрузки data.csv');
        const csvText = await response.text();
        const candles = parseCSV(csvText);

        const chart = LightweightCharts.createChart(document.getElementById('chart'), {
            width: 800,
            height: 600
        });
        const candlestickSeries = chart.addCandlestickSeries();
        candlestickSeries.setData(candles);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

loadChart();
