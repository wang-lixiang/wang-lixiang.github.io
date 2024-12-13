// 日历初始化逻辑封装为函数
const initCalendar = () => {
    // 设置默认点亮的日期
    const defaultHighlightedDates = {
        '5.17': true, '5.18': true, '5.19': true,
        '6.7': true, '6.8': true, '6.9': true, '6.10': true, '6.22': true, '6.23': true,
        '7.19': true, '7.20': true, '7.21': true, '7.28': true, '7.29': true, '7.30': true, '7.31': true,
        '8.1': true, '8.2': true, '8.3': true, '8.4': true, '8.9': true, '8.10': true, '8.11': true, '8.24': true, '8.25': true,
        '9.7': true, '9.8': true, '9.14': true, '9.15': true, '9.16': true, '9.17': true,
        '10.6': true, '10.7': true, '10.18': true, '10.19': true, '10.20': true,
        '11.2': true, '11.3': true, '11.16': true, '11.17': true, '11.23': true,
        '12.7': true, '12.8': true
    };
    localStorage.setItem('savedDates', JSON.stringify(defaultHighlightedDates));

    const generateCalendar = (year) => {
        const calendar = document.getElementById('calendar');
        if (!calendar) return; // 如果页面中没有 calendar 容器，直接返回
        calendar.innerHTML = '';

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        monthNames.forEach((name, month) => {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'month';

            const monthName = document.createElement('div');
            monthName.className = 'month-name';
            monthName.textContent = `${name} ${year}`;
            monthDiv.appendChild(monthName);

            const table = document.createElement('table');
            const headerRow = createTableHeader();
            table.appendChild(headerRow);

            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDay = new Date(year, month, 1).getDay();

            for (let i = 0, day = 1; i < 6; i++) {
                const row = document.createElement('tr');
                for (let j = 0; j < 7; j++) {
                    const cell = createDateCell(i, j, firstDay, daysInMonth, day, month, defaultHighlightedDates);
                    if (cell.day) day++;
                    row.appendChild(cell.element);
                }
                table.appendChild(row);
            }

            monthDiv.appendChild(table);
            calendar.appendChild(monthDiv);
        });
    };

    const createTableHeader = () => {
        const headerRow = document.createElement('tr');
        ['S', 'M', 'T', 'W', 'R', 'F', 'X'].forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            headerRow.appendChild(th);
        });
        return headerRow;
    };

    const createDateCell = (row, col, firstDay, daysInMonth, day, month, savedDates) => {
        const cell = { element: document.createElement('td'), day: false };
        const dateKey = `${month + 1}.${day}`;

        if ((row === 0 && col < firstDay) || day > daysInMonth) {
            cell.element.className = 'empty';
        } else {
            cell.day = true;
            cell.element.textContent = day;
            if (savedDates[dateKey]) addHeartOverlay(cell.element);
        }
        return cell;
    };

    const addHeartOverlay = (element) => {
        const overlay = document.createElement('div');
        overlay.className = 'heart-overlay';
        overlay.textContent = '❤';
        element.appendChild(overlay);
    };

    generateCalendar(2024);
};

// 初始化页面
document.addEventListener('DOMContentLoaded', initCalendar);

// 监听 Pjax 页面切换事件
document.addEventListener('pjax:complete', initCalendar);
