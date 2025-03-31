// Функция для парсинга CSV
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
            time: values[0]; // Формат, например, 'YYYY-MM-DD'
            open: parseFloat(values[1]);
            high: parseFloat(values[2]);
            low: parseFloat(values[3]);
            close: parseFloat(values[4]);
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
// Добавление линий и прямоугольников
async function addIndicatorData(chart, candlestickSeries) {
    try {
        const response = await fetch('indicator.json');
        if (!response.ok) throw new Error('Ошибка загрузки indicator.json');
        const indicatorData = await response.json();

        // Добавление горизонтальных линий
        indicatorData.lines.forEach(line => {
            candlestickSeries.createPriceLine({
                price: line.price,
                color: line.color,
                lineWidth: 2,
                lineStyle: LightweightCharts.LineStyle.Solid,
                axisLabelVisible: true,
                title: line.title || ''
            });
        });

        // Добавление прямоугольников
        const rectangleSeriesView = {
            draw: (context, options) => {
                const timeScale = options.timeScale;
                const priceScale = options.priceScale;
                indicatorData.rectangles.forEach(rect => {
                    const x1 = timeScale.timeToCoordinate(rect.startTime);
                    const x2 = timeScale.timeToCoordinate(rect.endTime);
                    const y1 = priceScale.priceToCoordinate(rect.startPrice);
                    const y2 = priceScale.priceToCoordinate(rect.endPrice);
                    if (x1 !== null && x2 !== null && y1 !== null && y2 !== null) {
                        context.fillStyle = rect.color;
                        context.fillRect(x1, y1, x2 - x1, y2 - y1);
                    }
                });
            }
        };
        chart.addCustomSeries(rectangleSeriesView, {});
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Обновление loadChart
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

        await addIndicatorData(chart, candlestickSeries);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

loadChart();
