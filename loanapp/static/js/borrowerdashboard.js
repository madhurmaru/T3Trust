document.addEventListener('DOMContentLoaded', function() {
    const requestButtons = document.querySelectorAll('.request-loan');
    requestButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lenderPhone = this.getAttribute('data-lender');
            const amount = prompt('Enter loan amount:');
            const reason = prompt('Enter reason for loan:');
            const interestRate = prompt('Enter interest rate (%):');
            if (amount && reason && interestRate) {
                const formData = new FormData();
                formData.append('amount', amount);
                formData.append('reason', reason);
                formData.append('interest_rate', interestRate);
                fetch('/create_loan_request/', {
                    method: 'POST',
                    body: formData,
                    headers: { 'X-CSRFToken': getCookie('csrftoken') }
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    window.location.reload(); // Refresh to update dashboard
                })
                .catch(error => console.error('Error:', error));
            }
        });
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});