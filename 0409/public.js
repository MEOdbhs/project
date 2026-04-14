document.addEventListener('DOMContentLoaded', () => {
    
    const daysContainer = document.getElementById('days-container');
    const monthYearDisplay = document.getElementById('month-year-display');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');


    if (!daysContainer) return;

    let currentDate = new Date();

    function renderCalendar(date) {
     
        daysContainer.innerHTML = '';

        const year = date.getFullYear();
        const month = date.getMonth();

        // 设置表头标题
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

        // 获取当前月的第一天
        const firstDayOfMonth = new Date(year, month, 1);
        // 获取当前月的最后一天
        const lastDayOfMonth = new Date(year, month + 1, 0);
        // 获取上个月的最后一天
        const lastDayOfPrevMonth = new Date(year, month, 0);
        // 计算第一天是星期几 (0-6, 0 是周日)
        let firstDayIndex = firstDayOfMonth.getDay();
        // 当天日期 (用于高亮)
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

        // 填充上个月的尾部天数
        for (let i = firstDayIndex; i > 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day', 'other-month');
            dayElement.textContent = lastDayOfPrevMonth.getDate() - i + 1;
            daysContainer.appendChild(dayElement);
        }

        // 填充本月的天数
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = i;

            // 高亮今天
            if (isCurrentMonth && i === today.getDate()) {
                dayElement.classList.add('today');
            }

            // 添加点击事件，跳转至子页面并携带参数
            dayElement.addEventListener('click', () => {
                // 格式化日期参数，如: 2026-04-09
                const formattedMonth = String(month + 1).padStart(2, '0');
                const formattedDay = String(i).padStart(2, '0');
                const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
                // 跳转到 subpage.html
                window.location.href = `subpage.html?date=${dateStr}`;
            });

            daysContainer.appendChild(dayElement);
        }

        // 填充下个月的开头天数 
        const totalDaysRendered = firstDayIndex + lastDayOfMonth.getDate();
        const daysToFill = 42 - totalDaysRendered;

        for (let i = 1; i <= daysToFill; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day', 'other-month');
            dayElement.textContent = i;
            daysContainer.appendChild(dayElement);
        }
    }

    // 初始化渲染
    renderCalendar(currentDate);

    // 绑定翻页事件
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });
});
