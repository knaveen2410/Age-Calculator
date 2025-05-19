document.addEventListener('DOMContentLoaded', function() {
    // Initialize flatpickr with better calendar UI
    const startDatePicker = flatpickr("#start-date", {
        dateFormat: "Y-m-d",
        defaultDate: new Date().setFullYear(new Date().getFullYear() - 30),
        maxDate: "today",
        onClose: function(selectedDates, dateStr, instance) {
            endDatePicker.set('minDate', dateStr);
        }
    });
    
    const endDatePicker = flatpickr("#end-date", {
        dateFormat: "Y-m-d",
        defaultDate: "today",
        minDate: startDatePicker.selectedDates[0]
    });
    
    // Calculate on button click
    document.getElementById('calculate-btn').addEventListener('click', calculateDuration);
});

function calculateDuration() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
        alert('Start date must be before end date');
        return;
    }
    
    // Calculate total difference in milliseconds
    const totalMs = end - start;
    
    // Convert to different units
    const totalSeconds = Math.floor(totalMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    
    // Calculate years, months, days
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    
    if (days < 0) {
        months--;
        const lastDayOfMonth = new Date(
            end.getFullYear(),
            end.getMonth(),
            0
        ).getDate();
        days += lastDayOfMonth;
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Format numbers with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Create output HTML
    const outputHTML = `
        <p><strong>Duration between dates:</strong></p>
        <p>${years} years ${months} months ${days} days</p>
        <p>or ${years * 12 + months} months ${days} days</p>
        <p>or ${totalWeeks} weeks ${remainingDays} days</p>
        <p>or ${formatNumber(totalDays)} days</p>
        <p>or ${formatNumber(totalHours)} hours</p>
        <p>or ${formatNumber(totalMinutes)} minutes</p>
        <p>or ${formatNumber(totalSeconds)} seconds</p>
    `;
    
    // Update the output container
    const outputElement = document.getElementById('duration-output');
    outputElement.innerHTML = outputHTML;
    outputElement.classList.add('animate');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        outputElement.classList.remove('animate');
    }, 500);
}