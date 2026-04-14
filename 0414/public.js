document.addEventListener('DOMContentLoaded', () => {
    const daysContainer = document.getElementById('days-container');
    const monthYearDisplay = document.getElementById('month-year-display');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    const projectBtn = document.getElementById('project-btn');
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-btn');

    if (projectBtn && modal && closeBtn) {
        projectBtn.addEventListener('click', () => {
            modal.classList.add('show');
        });
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    if (!daysContainer) return;

    // Force initial date to April 2026 for the demo
    let currentDate = new Date(2026, 3, 1);

    function renderCalendar(date) {
        daysContainer.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth();

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const lastDayOfPrevMonth = new Date(year, month, 0);
        let firstDayIndex = firstDayOfMonth.getDay();

        for (let i = firstDayIndex; i > 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day', 'other-month');
            dayElement.textContent = lastDayOfPrevMonth.getDate() - i + 1;
            daysContainer.appendChild(dayElement);
        }

        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = i;

            // Highlight and link only April 1-7
            if (month === 3 && i >= 1 && i <= 7) {
                dayElement.classList.add('has-record');
                dayElement.addEventListener('click', () => {
                    window.location.href = `subpage.html?day=${i}`;
                });
            } else {
                dayElement.classList.add('no-record');
            }

            daysContainer.appendChild(dayElement);
        }

        const totalDaysRendered = firstDayIndex + lastDayOfMonth.getDate();
        const daysToFill = 42 - totalDaysRendered;

        for (let i = 1; i <= daysToFill; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day', 'other-month');
            dayElement.textContent = i;
            daysContainer.appendChild(dayElement);
        }
    }

    renderCalendar(currentDate);

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });
});
