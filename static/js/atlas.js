/**
 * India Data Atlas - Client Runtime & Interaction Engine
 * Global search, policy simulation, interactive weight sliders, and toast feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  initGlobalSearch();
  initPolicyCopilot();
  initVpiCalculator();
});

// Toast notification helper
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color: var(--gold-primary);">✨</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Copy text to clipboard
function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    });
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (err) {
      console.error('Copy failed', err);
    }
    textArea.remove();
  }
}

// Global search autocomplete
function initGlobalSearch() {
  const searchInputs = document.querySelectorAll('.search-input');
  searchInputs.forEach((input) => {
    const wrapper = input.closest('.search-container');
    if (!wrapper) return;
    const dropdown = wrapper.querySelector('.search-dropdown');
    if (!dropdown) return;

    let debounceTimer;

    input.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      clearTimeout(debounceTimer);

      if (q.length < 2) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
      }

      debounceTimer = setTimeout(() => {
        fetch(`/api/search?q=${encodeURIComponent(q)}`)
          .then((res) => res.json())
          .then((data) => {
            if (!data || data.length === 0) {
              dropdown.innerHTML = `
                <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
                  No matches found for "${q}"
                </div>
              `;
              dropdown.classList.add('active');
              return;
            }

            dropdown.innerHTML = data.map((item) => `
              <a href="${item.path}" class="search-item">
                <div>
                  <div style="font-weight: 600; color: var(--text-main); font-size: 0.875rem;">${item.label}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${item.sublabel}</div>
                </div>
                <span class="search-badge">${item.type.toUpperCase()}</span>
              </a>
            `).join('');

            dropdown.classList.add('active');
          })
          .catch((err) => {
            console.error('Search error:', err);
          });
      }, 250);
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  });
}

// Policy AI Copilot Interactive Sliders
function initPolicyCopilot() {
  const sliderHealth = document.getElementById('slider-health');
  const sliderEdu = document.getElementById('slider-edu');
  const sliderInfra = document.getElementById('slider-infra');
  const sliderWater = document.getElementById('slider-water');

  if (!sliderHealth) return;

  function updateSimulation() {
    const health = parseFloat(sliderHealth.value);
    const edu = parseFloat(sliderEdu.value);
    const infra = parseFloat(sliderInfra.value);
    const water = parseFloat(sliderWater.value);

    // Update label values
    const lblHealth = document.getElementById('val-health');
    const lblEdu = document.getElementById('val-edu');
    const lblInfra = document.getElementById('val-infra');
    const lblWater = document.getElementById('val-water');
    const lblTotal = document.getElementById('val-total');

    if (lblHealth) lblHealth.textContent = `₹${health} Cr`;
    if (lblEdu) lblEdu.textContent = `₹${edu} Cr`;
    if (lblInfra) lblInfra.textContent = `₹${infra} Cr`;
    if (lblWater) lblWater.textContent = `₹${water} Cr`;
    if (lblTotal) lblTotal.textContent = `₹${health + edu + infra + water} Cr`;

    // Fetch baseline values from data attributes
    const simStage = document.getElementById('simulation-stage');
    if (!simStage) return;

    const baseIMR = parseFloat(simStage.dataset.baseImr || '42');
    const baseLit = parseFloat(simStage.dataset.baseLit || '70');
    const baseWater = parseFloat(simStage.dataset.baseWater || '55');
    const baseRoads = parseFloat(simStage.dataset.baseRoads || '80');

    // Multipliers & Non-linear curves
    const waterMultiplier = Math.min(1.3, 1.0 + (water / 400.0));
    const infraMultiplier = Math.min(1.25, 1.0 + (infra / 600.0));

    const imrReduction = (Math.sqrt(Math.max(0, health)) / Math.sqrt(150.0)) * 8.5 * waterMultiplier;
    const litGain = (Math.sqrt(Math.max(0, edu)) / Math.sqrt(120.0)) * 5.2 * infraMultiplier;
    const waterGain = (Math.sqrt(Math.max(0, water)) / Math.sqrt(80.0)) * 14.0;
    const roadsGain = (Math.sqrt(Math.max(0, infra)) / Math.sqrt(200.0)) * 8.0;

    const projIMR = Math.max(12.0, (baseIMR - imrReduction)).toFixed(1);
    const projLit = Math.min(99.5, (baseLit + litGain)).toFixed(1);
    const projWater = Math.min(100.0, (baseWater + waterGain)).toFixed(1);
    const projRoads = Math.min(100.0, (baseRoads + roadsGain)).toFixed(1);

    const elIMR = document.getElementById('proj-imr');
    const elLit = document.getElementById('proj-lit');
    const elWater = document.getElementById('proj-water');
    const elRoads = document.getElementById('proj-roads');

    if (elIMR) elIMR.textContent = projIMR;
    if (elLit) elLit.textContent = `${projLit}%`;
    if (elWater) elWater.textContent = `${projWater}%`;
    if (elRoads) elRoads.textContent = `${projRoads}%`;
  }

  [sliderHealth, sliderEdu, sliderInfra, sliderWater].forEach((slider) => {
    slider.addEventListener('input', updateSimulation);
  });
}

// VPI Dynamic Matrix Calculator
function initVpiCalculator() {
  const vpiSliders = document.querySelectorAll('.vpi-weight-slider');
  if (vpiSliders.length === 0) return;

  vpiSliders.forEach((slider) => {
    slider.addEventListener('input', () => {
      const targetLabel = document.getElementById(`val-${slider.id}`);
      if (targetLabel) targetLabel.textContent = `${slider.value}%`;
    });
  });
}
