document.addEventListener('DOMContentLoaded', () => {
    // 获取已保存的日期
    const savedDates = JSON.parse(localStorage.getItem('savedDates')) || {};
    // 生成日历
    function generateCalendar(year) {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        // 月份名称
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        for (let month = 0; month < 12; month++) {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'month';

            const monthName = document.createElement('div');
            monthName.className = 'month-name';
            monthName.textContent = `${monthNames[month]} ${year}`;
            monthDiv.appendChild(monthName);

            const table = document.createElement('table');
            const header = document.createElement('tr');
            ['S', 'M', 'T', 'W', 'R', 'F', 'X'].forEach(day => {
                const th = document.createElement('th');
                th.textContent = day;
                header.appendChild(th);
            });
            table.appendChild(header);

            // 获取该月的第一天和天数
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            let day = 1;
            for (let row = 0; row < 6; row++) { // 最多6行
                const tr = document.createElement('tr');
                for (let col = 0; col < 7; col++) { // 一周7天
                    const td = document.createElement('td');
                    if (row === 0 && col < firstDay || day > daysInMonth) {
                        td.className = 'empty'; // 空白单元格
                    } else {
                        td.textContent = day++;

                        const dateKey = `${month + 1}.${day - 1}`; // 获取日期 "MM.DD" 格式
                        // 如果该日期已经有心心覆盖，恢复显示
                        if (savedDates[dateKey]) {
                            const heartOverlay = document.createElement('div');
                            heartOverlay.className = 'heart-overlay';
                            heartOverlay.textContent = '❤';
                            td.appendChild(heartOverlay); // 添加心心覆盖
                        }

                        // 为每个日期单元格添加点击事件
                        td.addEventListener('click', function() {
                            // 如果该日期已经有心心覆盖，移除它，否则添加
                            if (td.querySelector('.heart-overlay')) {
                                td.removeChild(td.querySelector('.heart-overlay')); // 移除心心
                                delete savedDates[dateKey]; // 从localStorage中移除该日期
                            } else {
                                const heartOverlay = document.createElement('div');
                                heartOverlay.className = 'heart-overlay';
                                heartOverlay.textContent = '❤'; // 显示心心
                                td.appendChild(heartOverlay); // 添加心心覆盖
                                savedDates[dateKey] = true; // 在localStorage中保存该日期
                            }

                            // 更新localStorage中的日期数据
                            localStorage.setItem('savedDates', JSON.stringify(savedDates));
                        });
                    }
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }

            monthDiv.appendChild(table);
            calendar.appendChild(monthDiv);
        }
    }
  
    // 强制刷新页面
    function forcePageRefreshOnClick() {
        document.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function(event) {
                if (window.location.pathname === link.getAttribute('href')) {
                    event.preventDefault();  // 阻止默认行为
                    window.location.reload(); // 强制刷新页面
                }
            });
        });
    }

    generateCalendar(2024);
    forcePageRefreshOnClick(); // 添加强制刷新逻辑
});
