const initCalendar = () => {
    const calendarElement = document.getElementById('calendar');
    const year = parseInt(calendarElement.dataset.year, 10);
    if (isNaN(year)) {
        console.error("Invalid year provided in #calendar data-year attribute");
        return;
    }

    const defaultHighlightedDates = JSON.parse(calendarElement.dataset.dates || '{}');

    const generateCalendar = (year) => {
        calendarElement.innerHTML = '';

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
            calendarElement.appendChild(monthDiv);
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

            const markType = savedDates[dateKey];
            if (markType) {
                if (markType === true) {
                    addOverlay(cell.element, 'heart-overlay', '❤');
                } else if (markType === "broken") {
                    addOverlay(cell.element, 'broken-overlay', '💔');
                }
            }
        }
        return cell;
    };

    const addOverlay = (element, className, symbol) => {
        const overlay = document.createElement('div');
        overlay.className = className;
        overlay.textContent = symbol;
        element.appendChild(overlay);
    };

    generateCalendar(year);
};

document.addEventListener('DOMContentLoaded', initCalendar);
document.addEventListener('pjax:complete', initCalendar);
