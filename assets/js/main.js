// Les Clés de la Réussite — scripts partagés (menu mobile + formulaire de contact)
(function () {
  "use strict";

  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !mobileNav) return;
    toggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initContactForm() {
    var form = document.querySelector("#contact-form");
    if (!form) return;

    // Pré-remplissage de la commune depuis l'URL (?commune=Guyancourt) en arrivant d'une page locale.
    var params = new URLSearchParams(window.location.search);
    var communeParam = params.get("commune");
    var communeField = form.querySelector("#commune");
    if (communeParam && communeField) {
      var normalized = communeParam.toLowerCase();
      Array.from(communeField.options).forEach(function (opt) {
        if (opt.value.toLowerCase() === normalized) {
          communeField.value = opt.value;
        }
      });
    }

    var statusBox = form.querySelector("[data-form-status]");
    var submitBtn = form.querySelector("[type=submit]");

    function setError(field, message) {
      var wrapper = field.closest(".field");
      var errorEl = wrapper ? wrapper.querySelector(".field-error") : null;
      if (wrapper) wrapper.classList.toggle("error", !!message);
      if (errorEl) errorEl.textContent = message || "";
    }

    function validate() {
      var valid = true;
      var required = form.querySelectorAll("[required]");
      required.forEach(function (field) {
        var value = (field.value || "").trim();
        if (!value) {
          setError(field, "Ce champ est requis.");
          valid = false;
        } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setError(field, "Merci d'indiquer une adresse e-mail valide.");
          valid = false;
        } else {
          setError(field, "");
        }
      });
      return valid;
    }

    form.querySelectorAll("[required]").forEach(function (field) {
      field.addEventListener("blur", function () {
        var value = (field.value || "").trim();
        if (!value) setError(field, "Ce champ est requis.");
        else setError(field, "");
      });
    });

    function showStatus(type, message) {
      if (!statusBox) return;
      statusBox.textContent = message;
      statusBox.className = "form-status visible " + type;
      statusBox.setAttribute("role", "status");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot anti-spam : champ invisible qui ne doit jamais être rempli par un humain.
      var honeypot = form.querySelector("#site-web");
      if (honeypot && honeypot.value) return;

      if (!validate()) {
        showStatus("error", "Merci de corriger les champs signalés ci-dessous.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi en cours…";

      var formData = new URLSearchParams(new FormData(form));

      fetch(form.getAttribute("action") || "/contact.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      })
        .then(function (res) {
          return res.json().catch(function () { return { success: false }; });
        })
        .then(function (data) {
          if (data && data.success) {
            form.reset();
            showStatus("success", "Merci, votre demande a bien été envoyée. Nous revenons vers vous rapidement.");
          } else {
            showStatus("error", (data && data.message) || "L'envoi n'a pas pu aboutir. Vous pouvez réessayer ou nous appeler directement.");
          }
        })
        .catch(function () {
          showStatus("error", "L'envoi n'a pas pu aboutir (connexion). Vous pouvez réessayer ou nous appeler directement au 07 46 28 69 10.");
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Envoyer ma demande";
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initContactForm();
  });
})();
