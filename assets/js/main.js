document.querySelectorAll('.tab-tombol').forEach(btn=>{
    btn.addEventListener('click',()=>{
        const target = btn.dataset.target;

        document.querySelectorAll('.tab-konten').forEach(el=>{
            el.classList.remove('active');
        });

        document.getElementById(target).classList.add('active');
    });
});

document.addEventListener("DOMContentLoaded", function() {

  function waitForBootstrap(callback) {
      if (typeof bootstrap !== "undefined") {
          callback();
      } else {
          setTimeout(function() {
              waitForBootstrap(callback);
          }, 50);
      }
  }

  waitForBootstrap(function() {

      // =========================
      // BUKA MODAL DARI HASH
      // =========================
      function openModalFromHash() {

          const hash = window.location.hash.replace("#", "");

          if (!hash) return;

          const modalElement = document.getElementById(hash);

          if (modalElement && modalElement.classList.contains("modal")) {

              const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);

              modalInstance.show();
          }

      }

      // =========================
      // UPDATE HASH SAAT MODAL DIBUKA
      // =========================
      document.querySelectorAll('[data-bs-toggle="modal"]').forEach(trigger => {

          trigger.addEventListener("click", function() {

              const target = this.getAttribute("data-bs-target");

              if (!target) return;

              const modalId = target.replace("#", "");

              history.replaceState(null, null, "#" + modalId);

          });

      });

      // =========================
      // HAPUS HASH SAAT MODAL TUTUP
      // =========================
      document.querySelectorAll(".modal").forEach(modal => {

          modal.addEventListener("hidden.bs.modal", function() {

              if (window.location.hash === "#" + modal.id) {

                  history.replaceState(
                      "",
                      document.title,
                      window.location.pathname + window.location.search
                  );

              }

          });

      });

      // =========================
      // HASH CHANGE
      // =========================
      window.addEventListener("hashchange", openModalFromHash);

      // =========================
      // FIRST LOAD
      // =========================
      openModalFromHash();

  });

});
