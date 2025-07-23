// script.js

// Helper function to get an emoji icon for a category
function getCategoryIcon(category) {
  switch (category.toLowerCase()) {
    case 'entertainment':
      return '🎬'; // Movie clapperboard
    case 'education':
      return '📚'; // Books
    case 'sports':
      return '🏅'; // Sports medal
    case 'learning':
      return '🧠'; // Brain / knowledge
    case 'technology':
      return '💻'; // Laptop
    case 'finance':
      return '💸'; // Money with wings
    case 'health':
      return '🏥'; // Hospital
    case 'food':
      return '🍔'; // Hamburger
    case 'gaming':
      return '🎮'; // Video game controller
    default:
      return '🏷️'; // Generic tag
  }
}

// Helper function to categorize payment methods
function getPaymentMethodType(paymentMethod) {
  const lowerCaseMethod = paymentMethod.toLowerCase();
  if (lowerCaseMethod.includes('card') || lowerCaseMethod.includes('visa') || lowerCaseMethod.includes('mastercard') || lowerCaseMethod.includes('amex')) {
    return 'Card';
  } else if (lowerCaseMethod.includes('upi') || lowerCaseMethod.includes('gpay') || lowerCaseMethod.includes('phonepe') || lowerCaseMethod.includes('paytm')) {
    return 'UPI';
  } else {
    return 'Other';
  }
}

async function loadDashboard() {
  const res = await fetch('/api/v1/subscriptions/user', {
    method: 'GET',
    credentials: 'include'
  });

  const result = await res.json();
  const subscriptions = result.data;

  const USD_TO_INR = 86;

  const totalSubs = subscriptions.length;

  const totalSpend = subscriptions.reduce((acc, s) => {
    if (s.currency === 'USD') return acc + s.price * USD_TO_INR;
    if (s.currency === 'INR') return acc + s.price;
    return acc;
  }, 0);

  const usdSpend = subscriptions
    .filter(s => s.currency === 'USD')
    .reduce((a, b) => a + b.price, 0);

  const inrSpend = subscriptions
    .filter(s => s.currency === 'INR')
    .reduce((a, b) => a + b.price, 0);

  document.getElementById('total-subs').textContent = totalSubs;
  document.getElementById('total-spend').textContent = `₹ ${totalSpend.toFixed(2)}`;
  document.getElementById('usd-spend').textContent = `$ ${usdSpend.toFixed(2)}`;
  document.getElementById('inr-spend').textContent = `₹ ${inrSpend.toFixed(2)}`;

  // Chart: Category Bar
  const categories = {};
  subscriptions.forEach(s => {
    categories[s.category] = (categories[s.category] || 0) + 1;
  });

  const ctx1 = document.getElementById('categoryChart').getContext('2d');
  // Destroy existing chart instance before creating a new one
  if (window.categoryChart && typeof window.categoryChart.destroy === 'function') {
    window.categoryChart.destroy();
  }
  window.categoryChart = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        label: 'Subscriptions per Category',
        data: Object.values(categories),
        backgroundColor: '#df2935'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#000000',
            font: {
              family: 'Share Tech Mono, monospace'
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#333333',
            font: {
              family: 'Share Tech Mono, monospace'
            }
          },
          grid: {
            color: 'rgba(0,0,0,0.05)'
          }
        },
        y: {
          ticks: {
            color: '#333333',
            font: {
              family: 'Share Tech Mono, monospace'
            }
          },
          grid: {
            color: 'rgba(0,0,0,0.05)'
          }
        }
      }
    }
  });

  // Chart: Frequency Pie
  const frequencyCounts = {
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0
  };

  subscriptions.forEach(sub => {
    if (frequencyCounts.hasOwnProperty(sub.frequency)) {
      frequencyCounts[sub.frequency]++;
    }
  });

  const freqLabels = Object.keys(frequencyCounts);
  const freqValues = Object.values(frequencyCounts);

  if (window.frequencyChart && typeof window.frequencyChart.destroy === 'function') {
    window.frequencyChart.destroy();
  }

  const ctx = document.getElementById('frequencyChart').getContext('2d');
  window.frequencyChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: freqLabels,
      datasets: [{
        label: 'By Frequency',
        data: freqValues,
        backgroundColor: ['#3772ff', '#df2935', '#fdca40', '#7871aa'],
        borderWidth: 1,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#000000',
            font: {
              family: 'Share Tech Mono, monospace'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.parsed;
              return `${label}: ${value} subscription${value !== 1 ? 's' : ''}`;
            }
          }
        }
      }
    }
  });

  // Subscription List Cards
  const listContainer = document.getElementById('subscription-list');
  listContainer.innerHTML = "";

  subscriptions.forEach(sub => {
    const div = document.createElement('div');
    div.className = 'subscription-list-grid-item';

    const isCancelled = sub.status.toLowerCase() === 'cancelled';

    let actionButtonsHTML = '';
    if (isCancelled) {
      actionButtonsHTML = `
        <span class="cancelled-text">Cancelled</span>
        <button class="renew-btn" data-subscription-name="${sub.name}">Renew</button>
      `;
    } else {
      actionButtonsHTML = `
        <button class="edit-btn" data-subscription-name="${sub.name}">Edit</button>
        <button class="delete-btn" data-subscription-name="${sub.name}">Delete</button>
        <button class="cancel-btn" data-subscription-name="${sub.name}">Cancel</button>
      `;
    }


    div.innerHTML = `
      <span><strong>Name:</strong> ${sub.name}</span>
      <span><strong>Price:</strong> ${sub.price} ${sub.currency}</span>
      <span><strong>Category:</strong> ${sub.category}</span>
      <span><strong>Status:</strong> ${sub.status}</span>
      <span><strong>Payment Method:</strong> ${sub.paymentMethod}</span>
      <span><strong>Frequency:</strong> ${sub.frequency}</span>
      <span><strong>Start Date:</strong> ${new Date(sub.startDate).toLocaleDateString()}</span>
      <span><strong>Renewal Date:</strong> ${new Date(sub.renewalDate).toLocaleDateString()}</span>

      <div class="button-group">
        ${actionButtonsHTML}
      </div>
    `;
    listContainer.appendChild(div);

    // Add event listener to the Edit button (only if not cancelled)
    if (!isCancelled) {
        const editButton = div.querySelector('.edit-btn');
        editButton.addEventListener('click', () => {
            showEditModal(sub);
        });
    }


    // Add event listener to the Delete button (always available)
    const deleteButton = div.querySelector('.delete-btn');
    if (deleteButton) { // Ensure button exists before adding listener
        deleteButton.addEventListener('click', async () => {
            if (confirm(`Are you sure you want to delete the subscription "${sub.name}"?`)) {
                try {
                    const deleteRes = await fetch(`/api/v1/subscriptions/delete/${sub.name}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    const deleteResult = await deleteRes.json();

                    if (deleteRes.ok) {
                        alert(deleteResult.message);
                        location.href = "/dashboard" // Reload the dashboard to reflect changes
                    } else {
                        alert(`Failed to delete subscription: ${deleteResult.message || deleteRes.statusText}`);
                        console.error('Delete failed:', deleteResult);
                    }
                } catch (error) {
                    alert('An error occurred while deleting the subscription.');
                    console.error('Error deleting subscription:', error);
                }
            }
        });
    }

    // Add event listener to the Cancel button (only if not cancelled)
    const cancelButton = div.querySelector('.cancel-btn');
    if (cancelButton && !isCancelled) { // Ensure button exists and is not disabled
        cancelButton.addEventListener('click', async () => {
            if (confirm(`Are you sure you want to cancel the subscription "${sub.name}"? This will set its status to 'cancelled'.`)) {
                try {
                    const cancelRes = await fetch(`/api/v1/subscriptions/cancel/${sub.name}`, {
                        method: 'PUT',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });

                    const cancelResult = await cancelRes.json();

                    if (cancelRes.ok) {
                        alert(cancelResult.message);
                        location.href="/dashboard"; // Reload the dashboard to reflect changes
                    } else {
                        alert(`Failed to cancel subscription: ${cancelResult.message || cancelRes.statusText}`);
                        console.error('Cancel failed:', cancelResult);
                    }
                } catch (error) {
                    alert('An error occurred while canceling the subscription.');
                    console.error('Error canceling subscription:', error);
                }
            }
        });
    }

    // Add event listener to the Renew button (only if cancelled)
    const renewButton = div.querySelector('.renew-btn');
    if (renewButton && isCancelled) { // Ensure button exists and is for cancelled subscriptions
        renewButton.addEventListener('click', async () => {
            if (confirm(`Are you sure you want to renew the subscription "${sub.name}"? This will set its status to 'active'.`)) {
                try {
                    const renewRes = await fetch(`/api/v1/subscriptions/renew/${sub.name}`, {
                        method: 'PUT',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });

                    const renewResult = await renewRes.json();

                    if (renewRes.ok) {
                        alert(renewResult.message);
                        location.href="/dashboard"; // Reload the dashboard to reflect changes
                    } else {
                        alert(`Failed to renew subscription: ${renewResult.message || renewRes.statusText}`);
                        console.error('Renew failed:', renewResult);
                    }
                } catch (error) {
                    alert('An error occurred while renewing the subscription.');
                    console.error('Error renewing subscription:', error);
                }
            }
        });
    }
  });
}


// --- MODAL RELATED JAVASCRIPT ---
const editModal = document.getElementById('edit-subscription-modal');
const editForm = document.getElementById('edit-subscription-form');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// Input fields in the modal form
const editOriginalName = document.getElementById('edit-original-name');
const editName = document.getElementById('edit-name');
const editPrice = document.getElementById('edit-price');
const editCurrency = document.getElementById('edit-currency');
const editFrequency = document.getElementById('edit-frequency');
const editCategory = document.getElementById('edit-category');
const editPaymentMethod = document.getElementById('edit-paymentMethod');
const editStatus = document.getElementById('edit-status');
const editStartDate = document.getElementById('edit-startDate');
const editRenewalDate = document.getElementById('edit-renewalDate');


function showEditModal(subscription) {
  editOriginalName.value = subscription.name;
  editName.value = subscription.name;
  editPrice.value = subscription.price;
  editCurrency.value = subscription.currency;
  editFrequency.value = subscription.frequency;
  editCategory.value = subscription.category;
  editPaymentMethod.value = subscription.paymentMethod;
  editStatus.value = subscription.status;
  editStartDate.value = new Date(subscription.startDate).toISOString().split('T')[0];
  editRenewalDate.value = new Date(subscription.renewalDate).toISOString().split('T')[0];

  editModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideEditModal() {
  editModal.classList.remove('active');
  document.body.style.overflow = '';
  editForm.reset();
}

// Event listeners for modal actions
cancelEditBtn.addEventListener('click', hideEditModal);
editModal.addEventListener('click', (e) => {
  if (e.target === editModal) {
    hideEditModal();
  }
});

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const originalName = editOriginalName.value;

  const updatedData = {
    price: parseFloat(editPrice.value),
    currency: editCurrency.value,
    frequency: editFrequency.value,
    category: editCategory.value,
    paymentMethod: editPaymentMethod.value,
    status: editStatus.value,
    startDate: new Date(editStartDate.value),
    renewalDate: new Date(editRenewalDate.value)
  };

  try {
    const updateRes = await fetch(`/api/v1/subscriptions/edit/${originalName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updatedData)
    });

    const updateResult = await updateRes.json();

    if (updateRes.ok) {
      alert(`Subscription "${originalName}" updated successfully!`);
      hideEditModal();
      location.href = "/dashboard"
    } else {
      alert(`Failed to update subscription: ${updateResult.message || updateRes.statusText}`);
      console.error('Update failed:', updateResult);
    }
  } catch (error) {
    alert('An error occurred while updating the subscription.');
    console.error('Error updating subscription:', error);
  }
});

window.onload = loadDashboard;