/* ============================================
   CORSIT — Application JavaScript
   Handles: Countdown, Forms, Admin, Animations
   ============================================ */

// ────────────────────────────────────────────
// 1. COUNTDOWN TIMER
// ────────────────────────────────────────────

// Set event date: March 15, 2026 10:00 AM IST
const EVENT_DATE = new Date('2026-03-15T10:00:00+05:30').getTime();

function updateCountdown() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  // Skip if elements don't exist (non-home pages)
  if (!daysEl) return;

  const now = Date.now();
  const diff = EVENT_DATE - now;

  if (diff <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Initialize countdown
updateCountdown();
setInterval(updateCountdown, 1000);


// ────────────────────────────────────────────
// 2. SCROLL ANIMATIONS (Intersection Observer)
// ────────────────────────────────────────────

function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach((el) => observer.observe(el));
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', initScrollAnimations);


// ────────────────────────────────────────────
// 3. MOBILE HAMBURGER MENU
// ────────────────────────────────────────────

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

document.addEventListener('DOMContentLoaded', initMobileMenu);


// ────────────────────────────────────────────
// 4. TOAST NOTIFICATION
// ────────────────────────────────────────────

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast toast-${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}


// ────────────────────────────────────────────
// 5. REGISTRATION FORM HANDLING
// ────────────────────────────────────────────

function initRegistrationForm() {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather form data
    const formData = {
      id: Date.now(),
      name: document.getElementById('reg-name').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      phone: document.getElementById('reg-phone').value.trim(),
      college: document.getElementById('reg-college').value.trim(),
      branch: document.getElementById('reg-branch').value,
      year: document.getElementById('reg-year').value,
      interest: document.getElementById('reg-interest').value.trim(),
      created_at: new Date().toISOString()
    };

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone ||
      !formData.college || !formData.branch || !formData.year ||
      !formData.interest) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // Validate phone (at least 10 digits)
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      showToast('Please enter a valid phone number.', 'error');
      return;
    }

    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitArrow = document.getElementById('submitArrow');
    const submitSpinner = document.getElementById('submitSpinner');

    submitBtn.disabled = true;
    submitText.textContent = 'Submitting...';
    submitArrow.style.display = 'none';
    submitSpinner.style.display = 'inline';

    // Save to localStorage (simulating database)
    setTimeout(() => {
      try {
        const registrations = JSON.parse(localStorage.getItem('corsit_registrations') || '[]');

        // Check for duplicate email
        if (registrations.some(r => r.email === formData.email)) {
          showToast('This email is already registered.', 'error');
          submitBtn.disabled = false;
          submitText.textContent = 'Register Now';
          submitArrow.style.display = 'inline';
          submitSpinner.style.display = 'none';
          return;
        }

        registrations.push(formData);
        localStorage.setItem('corsit_registrations', JSON.stringify(registrations));

        // Show success modal
        const modal = document.getElementById('successModal');
        if (modal) {
          modal.style.display = 'flex';
        }

        // Reset form
        form.reset();
      } catch (err) {
        showToast('Something went wrong. Please try again.', 'error');
      }

      // Reset button
      submitBtn.disabled = false;
      submitText.textContent = 'Register Now';
      submitArrow.style.display = 'inline';
      submitSpinner.style.display = 'none';
    }, 1200); // Simulate network delay
  });
}

document.addEventListener('DOMContentLoaded', initRegistrationForm);


// ────────────────────────────────────────────
// 6. ADMIN PANEL
// ────────────────────────────────────────────

// Admin credentials (in production, this would be server-side)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

let adminLoggedIn = false;

function initAdminPanel() {
  const loginForm = document.getElementById('adminLoginForm');
  if (!loginForm) return;

  // Check existing session
  if (sessionStorage.getItem('corsit_admin') === 'true') {
    adminLoggedIn = true;
    showDashboard();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('admin-user').value.trim();
    const password = document.getElementById('admin-pass').value;

    if (username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password) {
      adminLoggedIn = true;
      sessionStorage.setItem('corsit_admin', 'true');
      showDashboard();
      showToast('Welcome, Admin!', 'success');
    } else {
      showToast('Invalid credentials. Please try again.', 'error');
    }
  });
}

function showDashboard() {
  const loginView = document.getElementById('adminLogin');
  const dashView = document.getElementById('adminDashboard');

  if (loginView) loginView.style.display = 'none';
  if (dashView) dashView.style.display = 'block';

  loadRegistrations();
}

function adminLogout() {
  adminLoggedIn = false;
  sessionStorage.removeItem('corsit_admin');

  const loginView = document.getElementById('adminLogin');
  const dashView = document.getElementById('adminDashboard');

  if (dashView) dashView.style.display = 'none';
  if (loginView) loginView.style.display = 'flex';

  // Reset login form
  const form = document.getElementById('adminLoginForm');
  if (form) form.reset();

  showToast('Logged out successfully.', 'success');
}

function loadRegistrations() {
  const registrations = JSON.parse(localStorage.getItem('corsit_registrations') || '[]');
  renderRegistrations(registrations);
  updateStats(registrations);
}

function renderRegistrations(data) {
  const tbody = document.getElementById('registrationsBody');
  const emptyState = document.getElementById('emptyState');
  const totalCount = document.getElementById('totalCount');

  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    if (totalCount) totalCount.textContent = '0 records';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (totalCount) totalCount.textContent = `${data.length} record${data.length !== 1 ? 's' : ''}`;

  tbody.innerHTML = data.map((reg, index) => {
    const date = new Date(reg.created_at);
    const formattedDate = date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    return `
      <tr>
        <td style="color: var(--text-primary); font-weight: 600;">${index + 1}</td>
        <td style="color: var(--text-primary); font-weight: 500;">${escapeHtml(reg.name)}</td>
        <td>${escapeHtml(reg.email)}</td>
        <td>${escapeHtml(reg.phone)}</td>
        <td>${escapeHtml(reg.college)}</td>
        <td><span style="background:rgba(255,255,255,0.06); padding:0.2rem 0.6rem; border-radius:var(--radius-pill); font-size:0.8rem;">${escapeHtml(reg.branch)}</span></td>
        <td>${escapeHtml(reg.year)}</td>
        <td style="font-size:0.8rem;">${formattedDate}</td>
        <td>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="viewDetail(${reg.id})" style="padding:0.35rem 0.75rem; font-size:0.75rem;">View</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRegistration(${reg.id})" style="padding:0.35rem 0.75rem; font-size:0.75rem;">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function updateStats(registrations) {
  const statTotal = document.getElementById('stat-total');
  const statToday = document.getElementById('stat-today');
  const statBranch = document.getElementById('stat-branch');

  if (statTotal) statTotal.textContent = registrations.length;

  // Count today's registrations
  if (statToday) {
    const today = new Date().toDateString();
    const todayCount = registrations.filter(r => new Date(r.created_at).toDateString() === today).length;
    statToday.textContent = todayCount;
  }

  // Find top branch
  if (statBranch && registrations.length > 0) {
    const branchCount = {};
    registrations.forEach(r => {
      branchCount[r.branch] = (branchCount[r.branch] || 0) + 1;
    });
    const topBranch = Object.entries(branchCount).sort((a, b) => b[1] - a[1])[0];
    statBranch.textContent = topBranch ? topBranch[0] : '—';
  }
}

function filterRegistrations() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const registrations = JSON.parse(localStorage.getItem('corsit_registrations') || '[]');

  if (!query) {
    renderRegistrations(registrations);
    return;
  }

  const filtered = registrations.filter(r =>
    r.name.toLowerCase().includes(query) ||
    r.email.toLowerCase().includes(query)
  );

  renderRegistrations(filtered);
}

function viewDetail(id) {
  const registrations = JSON.parse(localStorage.getItem('corsit_registrations') || '[]');
  const reg = registrations.find(r => r.id === id);

  if (!reg) return;

  const content = document.getElementById('detailContent');
  if (!content) return;

  const date = new Date(reg.created_at);
  const formattedDate = date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  content.innerHTML = `
    <div style="display:grid; gap:1rem;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
        <div>
          <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Name</div>
          <div style="font-weight:600;">${escapeHtml(reg.name)}</div>
        </div>
        <div>
          <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Email</div>
          <div>${escapeHtml(reg.email)}</div>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
        <div>
          <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Phone</div>
          <div>${escapeHtml(reg.phone)}</div>
        </div>
        <div>
          <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">College</div>
          <div>${escapeHtml(reg.college)}</div>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
        <div>
          <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Branch</div>
          <div>${escapeHtml(reg.branch)}</div>
        </div>
        <div>
          <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Year</div>
          <div>${escapeHtml(reg.year)}</div>
        </div>
      </div>
      <div>
        <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Reason for Attending</div>
        <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--border-soft); margin-top:0.25rem; line-height:1.6; color:var(--text-secondary);">${escapeHtml(reg.interest)}</div>
      </div>
      <div style="font-size:0.8rem; color:var(--text-secondary); text-align:right;">
        Registered: ${formattedDate}
      </div>
    </div>
  `;

  const modal = document.getElementById('detailModal');
  if (modal) modal.style.display = 'flex';
}

function closeDetailModal() {
  const modal = document.getElementById('detailModal');
  if (modal) modal.style.display = 'none';
}

function deleteRegistration(id) {
  if (!confirm('Are you sure you want to delete this registration?')) return;

  let registrations = JSON.parse(localStorage.getItem('corsit_registrations') || '[]');
  registrations = registrations.filter(r => r.id !== id);
  localStorage.setItem('corsit_registrations', JSON.stringify(registrations));

  loadRegistrations();
  showToast('Registration deleted.', 'success');
}

function exportCSV() {
  const registrations = JSON.parse(localStorage.getItem('corsit_registrations') || '[]');

  if (registrations.length === 0) {
    showToast('No data to export.', 'error');
    return;
  }

  const headers = ['ID', 'Name', 'Email', 'Phone', 'College', 'Branch', 'Year', 'Reason', 'Registered At'];
  const rows = registrations.map(r => [
    r.id,
    `"${r.name}"`,
    `"${r.email}"`,
    `"${r.phone}"`,
    `"${r.college}"`,
    `"${r.branch}"`,
    r.year,
    `"${r.interest.replace(/"/g, '""')}"`,
    `"${r.created_at}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `corsit_registrations_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);

  showToast('CSV exported successfully!', 'success');
}

// XSS Protection
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', initAdminPanel);


// ────────────────────────────────────────────
// 7. NAVBAR SCROLL EFFECT
// ────────────────────────────────────────────

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      navbar.style.background = 'rgba(11, 11, 13, 0.9)';
    } else {
      navbar.style.background = 'rgba(15, 15, 18, 0.7)';
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initNavbarScroll);


// ────────────────────────────────────────────
// 8. SMOOTH SCROLL FOR ANCHOR LINKS
// ────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});


// ────────────────────────────────────────────
// 9. ACTIVE NAV LINK HIGHLIGHT
// ────────────────────────────────────────────

function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-links a:not(.btn)');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener('DOMContentLoaded', initActiveNavHighlight);


// ────────────────────────────────────────────
// 10. FADE-IN-UP KEYFRAME (for modals)
// ────────────────────────────────────────────

// Inject keyframe dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);
