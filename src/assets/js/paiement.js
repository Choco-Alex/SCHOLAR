// Page Paiement : tant qu'aucun établissement n'a été choisi dans l'onglet
// Etablissement, on affiche un message d'information et on bloque la
// sélection de l'élève et de la tranche de paiement.
(() => {
  const banner = document.getElementById("no-establishment-banner");
  const summary = document.getElementById("establishment-summary");
  const establishmentName = document.getElementById("establishment-name");
  const studentSelect = document.getElementById("student-select");
  const trancheSelect = document.getElementById("tranche-select");
  const submitButton = document.getElementById("submit-button");
  const paymentForm = document.getElementById("payment-form");

  const selectedEstablishment = sessionStorage.getItem("selectedEstablishment");

  if (selectedEstablishment) {
    // Un établissement a été choisi : on affiche son nom au dessus du
    // formulaire et on débloque les sélections.
    establishmentName.textContent = selectedEstablishment;
    summary.classList.remove("hidden");
    banner.classList.add("hidden");

    studentSelect.disabled = false;
    trancheSelect.disabled = false;
    submitButton.disabled = false;
  } else {
    // Aucun établissement choisi : message d'avertissement et formulaire
    // bloqué.
    banner.classList.remove("hidden");
    summary.classList.add("hidden");

    studentSelect.disabled = true;
    trancheSelect.disabled = true;
    submitButton.disabled = true;
  }

  // Sécurité supplémentaire : empêche toute soumission du formulaire tant
  // qu'aucun établissement n'est enregistré.
  paymentForm.addEventListener("submit", (event) => {
    if (!sessionStorage.getItem("selectedEstablishment")) {
      event.preventDefault();
      banner.classList.remove("hidden");
      banner.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
})();
