// 日历初始化逻辑封装为函数
const initCalendar = () => {
    const savedDates = JSON.parse(localStorage.getItem('savedDates')) || {};

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
                    const cell = createDateCell(i, j, firstDay, daysInMonth, day, month, savedDates);
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

            cell.element.addEventListener('click', () => toggleHeart(cell.element, dateKey));
        }
        return cell;
    };

    const addHeartOverlay = (element) => {
        const overlay = document.createElement('div');
        overlay.className = 'heart-overlay';
        overlay.textContent = '❤';
        element.appendChild(overlay);
    };

    const toggleHeart = (element, dateKey) => {
        if (element.querySelector('.heart-overlay')) {
            element.removeChild(element.querySelector('.heart-overlay'));
            delete savedDates[dateKey];
        } else {
            addHeartOverlay(element);
            savedDates[dateKey] = true;
        }
        localStorage.setItem('savedDates', JSON.stringify(savedDates));
    };

    generateCalendar(2024);
};

// 初始化页面
document.addEventListener('DOMContentLoaded', initCalendar);

// 监听 Pjax 页面切换事件
document.addEventListener('pjax:complete', initCalendar);
