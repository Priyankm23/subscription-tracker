// admin.js

async function loadAdminDashboard() {
    try {
        const res = await fetch('/api/v1/admin/dashboard', {
            method: 'GET',
            credentials: 'include' // Send cookies (for authentication)
        });

        const result = await res.json();

        if (!res.ok) {
            alert(result.message || "Failed to load admin dashboard. You might not have admin privileges.");
            window.location.href = '/dashboard'; // Redirect to user dashboard or login
            return;
        }

        const {
            totalSubscriptions,
            totalUsers,
            subscriptionsByCategory,
            latestUpcomingRenewalPerUser, // Updated variable name
            maxSubscriptionPerUser,
            totalActiveSubscriptions,
            totalCancelledSubscriptions
        } = result.data;

        // Populate general stats cards
        document.getElementById('admin-total-subs').textContent = totalSubscriptions;
        document.getElementById('admin-total-users').textContent = totalUsers;
        document.getElementById('admin-active-subs').textContent = totalActiveSubscriptions; // New
        document.getElementById('admin-cancelled-subs').textContent = totalCancelledSubscriptions; // New

        // Chart: Category Distribution (All Subscriptions)
        const categoriesLabels = subscriptionsByCategory.map(item => item.category);
        const categoriesCounts = subscriptionsByCategory.map(item => item.count);

        const ctx = document.getElementById('adminCategoryChart').getContext('2d');
        if (window.adminCategoryChart && typeof window.adminCategoryChart.destroy === 'function') {
            window.adminCategoryChart.destroy();
        }
        window.adminCategoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categoriesLabels,
                datasets: [{
                    label: 'Total Subscriptions per Category',
                    data: categoriesCounts,
                    backgroundColor: '#ff3333' // Consistent color
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#000000',
                            font: { family: 'Share Tech Mono, monospace' }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#333333', font: { family: 'Share Tech Mono, monospace' } },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#333333', font: { family: 'Share Tech Mono, monospace' } },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    }
                }
            }
        });

        // Populate Maximum Subscription Per User List
        const maxSubsListContainer = document.getElementById('max-subs-list');
        maxSubsListContainer.innerHTML = ''; // Clear previous content

        if (maxSubscriptionPerUser.length === 0) {
            maxSubsListContainer.innerHTML = '<p style="margin-left: 10px;">No active subscriptions found for any user.</p>';
        } else {
            maxSubscriptionPerUser.forEach(sub => {
                const div = document.createElement('div');
                div.className = 'subscription-list-grid-item'; // Reuse existing card style
                div.innerHTML = `
                    <span><strong>User:</strong> ${sub.userName} (${sub.userEmail})</span>
                    <span><strong>Max Subscription:</strong> ${sub.subscriptionName}</span>
                    <span><strong>Price:</strong> ${sub.price} ${sub.currency}</span>
                `;
                maxSubsListContainer.appendChild(div);
            });
        }


        // Populate Latest Upcoming Renewals Per User List
        const upcomingRenewalsListContainer = document.getElementById('upcoming-renewals-list');
        upcomingRenewalsListContainer.innerHTML = ''; // Clear previous content

        if (latestUpcomingRenewalPerUser.length === 0) { // Updated variable name
            upcomingRenewalsListContainer.innerHTML = '<p style="margin-left: 10px;">No upcoming renewals for active subscriptions found.</p>';
        } else {
            latestUpcomingRenewalPerUser.forEach(renewal => { // Updated variable name
                const div = document.createElement('div');
                div.className = 'subscription-list-grid-item'; // Reuse existing card style
                div.innerHTML = `
                    <span><strong>User:</strong> ${renewal.userName} (${renewal.userEmail})</span>
                    <span><strong>Subscription:</strong> ${renewal.subscriptionName}</span>
                    <span><strong>Renewal Date:</strong> ${new Date(renewal.renewalDate).toLocaleDateString()}</span>
                    <span><strong>Price:</strong> ${renewal.price} ${renewal.currency}</span>
                    <span><strong>Category:</strong> ${renewal.category}</span>
                `;
                upcomingRenewalsListContainer.appendChild(div);
            });
        }

    } catch (error) {
        console.error("Error loading admin dashboard:", error);
        alert("An error occurred while loading the admin dashboard.");
        // Consider redirecting if there's a critical error
        // window.location.href = '/auth.html'; // Redirect to login
    }
}

// Load dashboard on page load
window.onload = loadAdminDashboard;