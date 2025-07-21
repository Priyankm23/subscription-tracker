async function loadDashboard() {
  const res = await fetch('/api/v1/subscriptions/user', {
    method: 'GET',
    credentials: 'include'
  });

  const result = await res.json();
  const subscriptions = result.data;

  // Cards & Chart Data
  const totalSubs = subscriptions.length;
  const totalSpend = subscriptions.reduce((acc, s) => acc + s.price, 0);
  const usdSpend = subscriptions.filter(s => s.currency === 'USD').reduce((a, b) => a + b.price, 0);
  const inrSpend = subscriptions.filter(s => s.currency === 'INR').reduce((a, b) => a + b.price, 0);

  document.getElementById('total-subs').textContent = totalSubs;
  document.getElementById('total-spend').textContent = totalSpend;
  document.getElementById('usd-spend').textContent = usdSpend;
  document.getElementById('inr-spend').textContent = inrSpend;

  // Chart 1: Category
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
        backgroundColor: '#6366f1'
      }]
    }
  });

  // Chart 2: Currency Distribution Pie
  // Assuming `subscriptions` is already fetched and contains all user subscriptions
  const frequencyCounts = {
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0
  };

  subscriptions.forEach(sub => {
    const freq = sub.frequency;
    if (frequencyCounts.hasOwnProperty(freq)) {
      frequencyCounts[freq]++;
    }
  });

  // Prepare chart data
  const freqLabels = Object.keys(frequencyCounts);
  const freqValues = Object.values(frequencyCounts);

  // Destroy existing chart if re-rendering
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
        backgroundColor: ['#4fc3f7', '#81c784', '#ffd54f', '#ba68c8'], // Daily, Weekly, Monthly, Yearly
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
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


  // List (Top 5)
  const listContainer = document.getElementById('subscription-list');
  listContainer.innerHTML = "";

  subscriptions.forEach(sub => {
    const div = document.createElement('div');
    div.className = 'subscription-item';
    div.innerHTML = `
    <span><strong>Name:</strong> ${sub.name}</span>
    <span><strong>Price:</strong> ${sub.price} ${sub.currency}</span>
    <span><strong>Category:</strong> ${sub.category}</span>
    <span><strong>Status:</strong> ${sub.status}</span>
    <span><strong>Payment Method:</strong> ${sub.paymentMethod}</span>
    <span><strong>Frequency:</strong> ${sub.frequency}</span>
    <span><strong>Start Date:</strong> ${new Date(sub.startDate).toLocaleDateString()}</span>
    <span><strong>Renewal Date:</strong> ${new Date(sub.renewalDate).toLocaleDateString()}</span>
  `;
    listContainer.appendChild(div);
  });
}

window.onload = loadDashboard;
