document.addEventListener('DOMContentLoaded', () => {
    const specialDates = ['11.16','5.17','5.18','5.19','6.9','6.10','6.22','6.23','11.17','11.2','11.3', 
         '7.19','7.20','7.21','7.28','7.29','7.30','7.31',
         '8.1','8.2','8.3','8.4','8.9','8.10','8.11','8.24','8.25',
         '9.7','9.8','9.14','9.15','9.16','9.17',
         '10.18','10.19','10.20','10.7','10.6', '6.7','6.8'];
  
    // 生成日历
    function generateCalendar(year) {
      const calendar = document.getElementById('calendar');
      if (!calendar) {
        console.error('Error: Element with id "calendar" not found!');
        return;
      }
      calendar.innerHTML = '';
  
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
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
          const th = document.createElement('th');
          th.textContent = day;
          header.appendChild(th);
        });
        table.appendChild(header);
  
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
  
        let day = 1;
        for (let row = 0; row < 6; row++) {
          const tr = document.createElement('tr');
          for (let col = 0; col < 7; col++) {
            const td = document.createElement('td');
            if (row === 0 && col < firstDay || day > daysInMonth) {
              td.className = 'empty';
            } else {
              const dateKey = `${month + 1}.${day}`;
              if (specialDates.includes(dateKey)) {
                td.className = 'special-date';
              }
              td.textContent = day++;
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
