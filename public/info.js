// info.js

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

async function loadInsights() {
  const res = await fetch('/api/v1/subscriptions/user', {
    method: 'GET',
    credentials: 'include'
  });

  const result = await res.json();
  const subscriptions = result.data;

  // --- 1. Subscriptions by Category ---
  const categoryCounts = {};
  subscriptions.forEach(sub => {
    categoryCounts[sub.category] = (categoryCounts[sub.category] || 0) + 1;
  });

  const categoryBreakdownContainer = document.getElementById('category-breakdown');
  categoryBreakdownContainer.innerHTML = ''; // Clear previous content

  for (const category in categoryCounts) {
    const div = document.createElement('div');
    div.className = 'info-card';
    // Add category icon
    div.innerHTML = `
            <h3>${getCategoryIcon(category)} ${category}</h3>
            <p>${categoryCounts[category]}</p>
        `;
    categoryBreakdownContainer.appendChild(div);
  }

  // --- 2. Subscription Status Overview ---
  let activeCount = 0;
  let expiredCount = 0;
  let cancelledCount = 0;

  const today = new Date();

  subscriptions.forEach(sub => {
    if (sub.status === 'active') {
      activeCount++;
    } else if (sub.status === 'cancelled') {
      cancelledCount++;
    }
    // Check for expired status based on renewalDate if status is not explicitly 'expired' or 'cancelled'
    else if (new Date(sub.renewalDate) < today) {
      expiredCount++;
    }
  });

  document.getElementById('active-subs').textContent = activeCount;
  document.getElementById('expired-subs').textContent = expiredCount;
  document.getElementById('cancelled-subs').textContent = cancelledCount;

  // Add classes for styling based on status
  document.getElementById('active-subs').closest('.info-card').classList.add('active');
  document.getElementById('expired-subs').closest('.info-card').classList.add('expired');
  document.getElementById('cancelled-subs').closest('.info-card').classList.add('cancelled');


  const paymentMethodCounts = {};
  subscriptions.forEach(sub => {
    const type = getPaymentMethodType(sub.paymentMethod);
    paymentMethodCounts[type] = (paymentMethodCounts[type] || 0) + 1;
  });

  const paymentMethodBreakdownContainer = document.getElementById('payment-method-breakdown');
  paymentMethodBreakdownContainer.innerHTML = ''; // Clear previous content

  for (const methodType in paymentMethodCounts) {
    const div = document.createElement('div');
    div.className = 'info-card'; // Reusing info-card styling
    div.innerHTML = `
            <h3>${methodType}</h3>
            <p>${paymentMethodCounts[methodType]}</p>
        `;
    paymentMethodBreakdownContainer.appendChild(div);
  }

  // --- 3. Top 5 Upcoming Renewals ---
  // Filter active subscriptions and sort by renewal date
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');

  activeSubscriptions.sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));

  const upcomingRenewalsContainer = document.getElementById('upcoming-renewals');
  upcomingRenewalsContainer.innerHTML = ''; // Clear previous content

  const top5Renewals = activeSubscriptions.slice(0, 5);

  if (top5Renewals.length > 0) {
    top5Renewals.forEach(sub => {
      const div = document.createElement('div');
      div.className = 'info-list-item';
      const paymentMethodType = getPaymentMethodType(sub.paymentMethod); // Get categorized type
      div.innerHTML = `
                <span><strong>Name:</strong> ${sub.name}</span>
                <span><strong>Renewal Date:</strong> ${new Date(sub.renewalDate).toLocaleDateString()}</span>
                <span><strong>Price:</strong> ${sub.price} ${sub.currency}</span>
                <span><strong>Category:</strong> ${getCategoryIcon(sub.category)} ${sub.category}</span>
                <span><strong>Frequency:</strong> ${sub.frequency}</span>
                <span><strong>Payment Method Type:</strong> ${paymentMethodType}</span>
                <span><strong>Full Payment Method:</strong> ${sub.paymentMethod}</span>
            `;
      upcomingRenewalsContainer.appendChild(div);
    });
    document.getElementById('no-upcoming-renewals').style.display = 'none';
  } else {
    document.getElementById('no-upcoming-renewals').style.display = 'block';
  }
}

// Load insights when the page loads
window.onload = loadInsights;