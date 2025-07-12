const repoOwner = 'iceinstitut';
const repoName = 'image';
const folderPath = 'aset';
const imagesPerPage = 12;
let currentPage = 1;
let allImages = [];

window.addEventListener('DOMContentLoaded', () => {
  fetch('metadata.json')
    .then(res => res.json())
    .then(data => {
      allImages = data;
      renderImages();
    });

  document.getElementById('search-input').addEventListener('input', () => {
    currentPage = 1;
    renderImages();
  });
});

function renderImages() {
  const container = document.getElementById('image-list');
  container.innerHTML = '';
  const query = document.getElementById('search-input').value.toLowerCase();
  const filtered = allImages.filter(img => img.name.toLowerCase().includes(query));

  const totalPages = Math.ceil(filtered.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = Math.min(startIndex + imagesPerPage, filtered.length);

  document.getElementById("total-count").textContent = 
    \`Menampilkan \${endIndex - startIndex} dari \${filtered.length} gambar (halaman \${currentPage} dari \${totalPages || 1})\`;

  const paginated = filtered.slice(startIndex, endIndex);

  paginated.forEach((file, index) => {
    const rawUrl = \`https://\${repoOwner}.github.io/\${repoName}/\${folderPath}/\${file.name}\`;
    const inputId = \`input-url-\${index}\`;
    const fileSize = formatSize(file.size);
    const date = new Date(file.date);
    const formattedDate = date.toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Jakarta'
    });

    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    col.innerHTML = \`
      <div class="card shadow-sm h-100">
        <div class="d-flex align-items-center justify-content-center p-3" style="height: 250px;">
          <img loading="lazy" src="\${rawUrl}" alt="\${file.name}" class="img-fluid mh-100">
        </div>
        <div class="card-body">
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>\${file.name}</strong></li>
            <li class="list-group-item"><strong>Ekstensi:</strong> .\${file.extension}</li>
            <li class="list-group-item"><strong>Ukuran:</strong> \${fileSize}</li>
            <li class="list-group-item"><strong>Update Terakhir:</strong> \${formattedDate}</li>
          </ul>
        </div>
        <div class="card-footer">
          <div class="input-group">
            <button class="btn btn-outline-primary" type="button" onclick="copyToClipboard('\${inputId}', this)" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Copy URL">
              <i class="bi bi-clipboard-fill"></i>
            </button>
            <input type="text" class="form-control" id="\${inputId}" value="\${rawUrl}" disabled readonly onclick="this.select()">
          </div>
        </div>
      </div>
    \`;
    container.appendChild(col);

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = 'page-item' + (i === currentPage ? ' active' : '');
    li.innerHTML = \`<button class="page-link" onclick="gotoPage(\${i})">\${i}</button>\`;
    pagination.appendChild(li);
  }
}

function gotoPage(page) {
  currentPage = page;
  renderImages();
}

function copyToClipboard(inputId, button) {
  const input = document.getElementById(inputId);
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand("copy");

  const original = button.innerHTML;
  button.innerHTML = "<i class='bi bi-check-lg'></i>";
  button.classList.remove("btn-outline-primary");
  button.classList.add("btn-success");

  setTimeout(() => {
    button.innerHTML = original;
    button.classList.add("btn-outline-primary");
    button.classList.remove("btn-success");
  }, 1500);
}

function formatSize(bytes) {
  if (bytes < 1024) return \`\${bytes} B\`;
  else if (bytes < 1024 * 1024) return \`\${(bytes / 1024).toFixed(1)} KB\`;
  else return \`\${(bytes / (1024 * 1024)).toFixed(1)} MB\`;
}
