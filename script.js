const repoOwner = 'iceinstitut';
const repoName = 'image';
const folderPath = 'aset';

const limit = 12;
let page = 1;
let allImages = [];
let filteredImages = [];
let isLoading = false;

window.addEventListener('DOMContentLoaded', () => {

  fetch('metadata.json')
    .then(res => res.json())
    .then(data => {
      allImages = data;
      filteredImages = data;
      document.getElementById('loading').style.display = 'none';
      renderImages();
      initObserver();
    });

  // debounce search
  let debounce;
  document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const q = e.target.value.toLowerCase();
      filteredImages = allImages.filter(img => img.name.toLowerCase().includes(q));
      page = 1;
      document.getElementById('image-list').innerHTML = '';
      renderImages();
    }, 300);
  });
});

function initObserver() {
  const trigger = document.getElementById('load-more-trigger');

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !isLoading) {
      renderImages();
    }
  }, {
    rootMargin: '200px'
  });

  observer.observe(trigger);
}

function renderImages() {
  if (isLoading) return;

  const start = (page - 1) * limit;
  const end = start + limit;

  if (start >= filteredImages.length) return;

  isLoading = true;

  const container = document.getElementById('image-list');
  const slice = filteredImages.slice(start, end);

  slice.forEach(file => {

    const url = `https://${repoOwner}.github.io/${repoName}/${folderPath}/${file.name}`;

    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg-3';

    col.innerHTML = `
      <div class="card shadow-sm border-0 h-100">
        <div class="position-relative">
          <img src="${url}" loading="lazy" class="card-img-top" onclick="openPreview('${url}')">
          <span class="badge bg-dark badge-ext">${file.extension}</span>
        </div>

        <div class="card-body p-2">
          <div class="small fw-bold text-truncate">${file.name}</div>
          <div class="small text-muted">${formatSize(file.size)}</div>
        </div>

        <div class="card-footer p-2">
          <button class="btn btn-sm btn-outline-primary w-100" onclick="copyURL('${url}', this)">
            <i class="bi bi-clipboard"></i>
          </button>
        </div>
      </div>
    `;

    container.appendChild(col);
  });

  page++;
  isLoading = false;
}

function openPreview(url) {
  document.getElementById('previewImage').src = url;
  new bootstrap.Modal(document.getElementById('previewModal')).show();
}

function copyURL(url, btn) {
  navigator.clipboard.writeText(url).then(() => {
    btn.innerHTML = '<i class="bi bi-check"></i>';
    btn.classList.remove('btn-outline-primary');
    btn.classList.add('btn-success');

    setTimeout(() => {
      btn.innerHTML = '<i class="bi bi-clipboard"></i>';
      btn.classList.add('btn-outline-primary');
      btn.classList.remove('btn-success');
    }, 1500);
  });
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
