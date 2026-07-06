document.addEventListener('DOMContentLoaded', function () {
  const faqButtons = document.querySelectorAll('.faq-item button');

  faqButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const faqItem = button.closest('.faq-item');
      const isOpen = faqItem.classList.toggle('open');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  const navLinks = document.querySelectorAll('.page-nav a');
  const path = window.location.pathname.split('/').pop();
  navLinks.forEach(function (link) {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });

  loadCampaignSummary();

  const applicantCarousels = document.querySelectorAll('[data-applicant-carousel]');

  applicantCarousels.forEach(function (carousel) {
    const slides = Array.from(carousel.querySelectorAll('[data-applicant-slide]'));
    const previousButton = carousel.querySelector('[data-applicant-prev]');
    const nextButton = carousel.querySelector('[data-applicant-next]');
    const currentLabel = carousel.querySelector('[data-applicant-current]');
    const totalLabel = carousel.querySelector('[data-applicant-total]');
    const dotsContainer = carousel.querySelector('[data-applicant-dots]');

    if (!slides.length || !previousButton || !nextButton) {
      return;
    }

    let activeIndex = slides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    });

    if (activeIndex < 0) {
      activeIndex = 0;
    }

    if (totalLabel) {
      totalLabel.textContent = String(slides.length);
    }

    const dots = slides.map(function (slide, index) {
      const dot = document.createElement('button');
      const applicantName = slide.querySelector('h3') ? slide.querySelector('h3').textContent : 'applicant';
      dot.className = 'carousel-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show ' + applicantName);
      dot.addEventListener('click', function () {
        showSlide(index);
      });

      if (dotsContainer) {
        dotsContainer.appendChild(dot);
      }

      return dot;
    });

    function showSlide(index) {
      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        const isActive = slideIndex === activeIndex;
        slide.classList.toggle('is-active', isActive);
        slide.hidden = !isActive;
      });

      dots.forEach(function (dot, dotIndex) {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });

      if (currentLabel) {
        currentLabel.textContent = String(activeIndex + 1);
      }
    }

    previousButton.addEventListener('click', function () {
      showSlide(activeIndex - 1);
    });

    nextButton.addEventListener('click', function () {
      showSlide(activeIndex + 1);
    });

    carousel.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showSlide(activeIndex - 1);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showSlide(activeIndex + 1);
      }
    });

    showSlide(activeIndex);
  });
});

function loadCampaignSummary() {
  const summaryElement = document.querySelector('[data-campaign-summary]');

  if (!summaryElement) {
    return;
  }

  const sheetId = summaryElement.dataset.summarySheetId;
  const sheetName = summaryElement.dataset.summarySheetName || 'Summary';

  if (!sheetId) {
    return;
  }

  const callbackName = 'campaignSummaryCallback' + Date.now();
  const params = new URLSearchParams({
    sheet: sheetName,
    headers: '0',
    tqx: 'out:json;responseHandler:' + callbackName,
  });
  const script = document.createElement('script');

  function cleanup() {
    delete window[callbackName];

    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  }

  window[callbackName] = function (response) {
    cleanup();

    if (!response || response.status === 'error' || !response.table) {
      return;
    }

    const summary = readCampaignSummary(response.table);
    updateCampaignSummary(summaryElement, summary);
  };

  script.onerror = cleanup;
  script.src = 'https://docs.google.com/spreadsheets/d/' + encodeURIComponent(sheetId) + '/gviz/tq?' + params.toString();
  document.head.appendChild(script);
}

function readCampaignSummary(table) {
  const values = {};

  (table.rows || []).forEach(function (row) {
    const cells = row.c || [];
    const label = readSheetCell(cells[0]).trim().toLowerCase();
    const value = readSheetCell(cells[1]);

    if (label) {
      values[label] = value;
    }
  });

  const totalDonations = parseSheetNumber(values['total donations']);
  const totalDonors = parseSheetNumber(values['total donors']);
  const goal = parseSheetNumber(values.goal);
  let remaining = parseSheetNumber(values.remaining);
  let percentFunded = parseSheetPercent(values['% funded']);

  if (!Number.isFinite(remaining) && Number.isFinite(goal) && Number.isFinite(totalDonations)) {
    remaining = Math.max(goal - totalDonations, 0);
  }

  if (!Number.isFinite(percentFunded) && Number.isFinite(goal) && goal > 0 && Number.isFinite(totalDonations)) {
    percentFunded = (totalDonations / goal) * 100;
  }

  return {
    totalDonations: totalDonations,
    totalDonors: totalDonors,
    goal: goal,
    remaining: remaining,
    percentFunded: percentFunded,
  };
}

function updateCampaignSummary(summaryElement, summary) {
  if (!Number.isFinite(summary.totalDonations) || !Number.isFinite(summary.goal)) {
    return;
  }

  const percentFunded = clampPercent(Number.isFinite(summary.percentFunded) ? summary.percentFunded : 0);
  const remaining = Number.isFinite(summary.remaining) ? summary.remaining : Math.max(summary.goal - summary.totalDonations, 0);
  const remainingPercent = summary.goal > 0 ? clampPercent((remaining / summary.goal) * 100) : 0;
  const totalDonors = Number.isFinite(summary.totalDonors) ? summary.totalDonors : 0;

  setText(summaryElement, '[data-summary-total]', formatCurrency(summary.totalDonations));
  setText(summaryElement, '[data-summary-donors]', formatDonorCount(totalDonors));
  setText(summaryElement, '[data-summary-raised]', formatCurrency(summary.totalDonations));
  setText(summaryElement, '[data-summary-goal]', formatCurrency(summary.goal));
  setText(summaryElement, '[data-summary-remaining]', formatCurrency(remaining));
  setBarWidth(summaryElement, '[data-summary-raised-bar]', percentFunded);
  setBarWidth(summaryElement, '[data-summary-goal-bar]', 100);
  setBarWidth(summaryElement, '[data-summary-remaining-bar]', remainingPercent);
  setText(document, '[data-summary-hero-funded]', formatPercent(percentFunded) + ' funded');
}

function readSheetCell(cell) {
  if (!cell) {
    return '';
  }

  if (cell.f !== undefined && cell.f !== null && cell.f !== '') {
    return String(cell.f);
  }

  if (cell.v !== undefined && cell.v !== null) {
    return String(cell.v);
  }

  return '';
}

function parseSheetNumber(value) {
  const cleaned = String(value || '').replace(/,/g, '').replace(/[^\d.-]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function parseSheetPercent(value) {
  const text = String(value || '').trim();
  const parsed = parseSheetNumber(text);

  if (!Number.isFinite(parsed)) {
    return NaN;
  }

  if (!text.includes('%') && parsed > 0 && parsed <= 1) {
    return parsed * 100;
  }

  return parsed;
}

function formatCurrency(value) {
  const hasCentavos = Math.abs(value % 1) > 0;

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: hasCentavos ? 2 : 0,
    maximumFractionDigits: hasCentavos ? 2 : 0,
  }).format(value);
}

function formatDonorCount(value) {
  const count = Math.max(Math.round(value), 0);
  const formattedCount = new Intl.NumberFormat('en-PH').format(count);
  return formattedCount + (count === 1 ? ' donor' : ' donors');
}

function formatPercent(value) {
  return String(Math.round(clampPercent(value))) + '%';
}

function clampPercent(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 100);
}

function setText(root, selector, value) {
  const element = root.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function setBarWidth(root, selector, value) {
  const element = root.querySelector(selector);

  if (element) {
    element.style.width = formatPercent(value);
  }
}
