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
  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        label: 'Subscriptions per Category',
        data: Object.values(categories),
        backgroundColor: '#ff3333' /* Using Primary color for bar chart */
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#000000', // Foreground color for chart legends
            font: {
              family: 'Share Tech Mono, monospace' // Apply font-family
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#333333', // Muted color for x-axis labels
            font: {
              family: 'Share Tech Mono, monospace' // Apply font-family
            }
          },
          grid: {
            color: 'rgba(0,0,0,0.05)' // Light grid lines
          }
        },
        y: {
          ticks: {
            color: '#333333', // Muted color for y-axis labels
            font: {
              family: 'Share Tech Mono, monospace' // Apply font-family
            }
          },
          grid: {
            color: 'rgba(0,0,0,0.05)' // Light grid lines
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
        backgroundColor: ['#ff3333', '#ffff00', '#0066ff', '#00cc00'], // Chart 1, 2, 3, 4
        borderWidth: 1,
        borderColor: '#ffffff' // Card Background for border between segments
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#000000', // Foreground color for chart legends
            font: {
              family: 'Share Tech Mono, monospace' // Apply font-family
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
    // Change this line:
    div.className = 'subscription-list-grid-item'; // This was previously a Tailwind class
    // Make sure it's 'subscription-list-grid-item' to match styles.css

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
        <button class="edit-btn" data-subscription-name="${sub.name}">Edit</button>
        <button class="delete-btn" data-subscription-name="${sub.name}">Delete</button>
        <button class="cancel-btn" data-subscription-name="${sub.name}">Cancel</button>
      </div>
    `;
    listContainer.appendChild(div);

    // Add event listener to the Edit button
    const editButton = div.querySelector('.edit-btn');
    editButton.addEventListener('click', () => {
      showEditModal(sub); // Call the new modal function
    });
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
  // Store original name (used in URL for PUT request)
  editOriginalName.value = subscription.name;

  // Populate form fields with current subscription data
  editName.value = subscription.name; // Readonly field
  editPrice.value = subscription.price;
  editCurrency.value = subscription.currency;
  editFrequency.value = subscription.frequency;
  editCategory.value = subscription.category;
  editPaymentMethod.value = subscription.paymentMethod;
  editStatus.value = subscription.status;
  editStartDate.value = new Date(subscription.startDate).toISOString().split('T')[0]; // Format to YYYY-MM-DD
  editRenewalDate.value = new Date(subscription.renewalDate).toISOString().split('T')[0]; // Format to YYYY-MM-DD

  editModal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling background
}

function hideEditModal() {
  editModal.classList.remove('active');
  document.body.style.overflow = ''; // Restore scrolling
  editForm.reset(); // Clear form fields
}

// Event listeners for modal actions
cancelEditBtn.addEventListener('click', hideEditModal);
editModal.addEventListener('click', (e) => {
  // Close modal if clicked outside modal-content
  if (e.target === editModal) {
    hideEditModal();
  }
});

editForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent default form submission

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
      location.href="/dashboard" // Reload dashboard to reflect changes
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