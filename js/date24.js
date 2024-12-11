// GitHub API 配置
const GITHUB_API_URL = "https://github.com/wang-lixiang/wang-lixiang.github.io/contents/saved-dates.json";
const GITHUB_TOKEN = "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"; // 确保你的 Token 不会暴露在公共场合

// 日历初始化逻辑封装为函数
const initCalendar = async () => {
    let savedDates = await fetchSavedDatesFromGitHub();

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

    const toggleHeart = async (element, dateKey) => {
        if (element.querySelector('.heart-overlay')) {
            element.removeChild(element.querySelector('.heart-overlay'));
            delete savedDates[dateKey];
        } else {
            addHeartOverlay(element);
            savedDates[dateKey] = true;
        }

        await saveDatesToGitHub(savedDates);
    };

    generateCalendar(2024);
};

// 从 GitHub 获取保存的日期状态
const fetchSavedDatesFromGitHub = async () => {
    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            const content = atob(data.content); // 解码 Base64 内容
            return JSON.parse(content);
        }
    } catch (error) {
        console.error("Failed to fetch saved dates from GitHub", error);
    }

    return {}; // 返回空对象作为默认值
};

// 将日期状态保存到 GitHub
const saveDatesToGitHub = async (savedDates) => {
    try {
        // 首先获取文件的 SHA 值（GitHub API 需要此值来更新文件）
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
            },
        });

        const data = await response.json();
        const sha = data.sha;

        // 更新文件内容
        await fetch(GITHUB_API_URL, {
            method: 'PUT',
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Update saved dates',
                content: btoa(JSON.stringify(savedDates)), // 将 JSON 转为 Base64
                sha: sha,
            }),
        });
    } catch (error) {
        console.error("Failed to save dates to GitHub", error);
    }
};

// 初始化页面
document.addEventListener('DOMContentLoaded', initCalendar);

// 监听 Pjax 页面切换事件
document.addEventListener('pjax:complete', initCalendar);
