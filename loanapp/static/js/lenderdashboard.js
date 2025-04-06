document.addEventListener('DOMContentLoaded', function() {
    const requestList = document.getElementById('request-list');
    fetchLoanRequests();

    function fetchLoanRequests() {
        fetch('/get_loan_requests/', {
            headers: { 'X-CSRFToken': getCookie('csrftoken') }
        })
        .then(response => response.json())
        .then(data => {
            if (data.requests) {
                requestList.innerHTML = '';
                data.requests.forEach(request => {
                    const div = document.createElement('div');
                    div.className = 'flex justify-between items-center border rounded-lg p-3 mb-3';
                    div.innerHTML = `
                        <div>
                            <p class="font-semibold">${request.borrower__phone_number}</p>
                            <p class="text-gray-500 text-sm">Amount: ₹${request.amount} at ${request.interest_rate}%</p>
                            <p class="text-gray-400 text-sm">${request.reason}</p>
                        </div>
                        <button class="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 accept-loan" data-loan-id="${request.id}">Accept</button>
                    `;
                    requestList.appendChild(div);
                });

                document.querySelectorAll('.accept-loan').forEach(button => {
                    button.addEventListener('click', function() {
                        const loanId = this.getAttribute('data-loan-id');
                        const formData = new FormData();
                        formData.append('loan_id', loanId);
                        fetch('/lend_money/', {
                            method: 'POST',
                            body: formData,
                            headers: { 'X-CSRFToken': getCookie('csrftoken') }
                        })
                        .then(response => response.json())
                        .then(data => {
                            alert(data.message);
                            fetchLoanRequests();
                            window.location.reload(); // Refresh to update dashboard
                        })
                        .catch(error => console.error('Error:', error));
                    });
                });
            } else {
                requestList.innerHTML = '<p class="text-gray-500">No pending loan requests</p>';
            }
        })
        .catch(error => console.error('Error fetching requests:', error));
    }

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