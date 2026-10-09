// Page Paiement : établissement -> classe -> élève -> tranche -> mode -> téléphone -> paiement.
(() => {
  const $ = (id) => document.getElementById(id);
  const banner = $("no-establishment-banner");
  const summary = $("establishment-summary");
  const establishmentName = $("establishment-name");
  const classSelect = $("class-select");
  const studentSelect = $("student-select");
  const trancheSelect = $("tranche-select");
  const amountDisplay = $("amount-display");
  const amountValue = $("amount-value");
  const methodButtons = document.querySelectorAll(".payment-method");
  const phoneBlock = $("phone-block");
  const phoneInput = $("phone-input");
  const phoneError = $("phone-error");
  const phoneOperator = $("phone-operator");
  const paymentSummary = $("payment-summary");
  const submitButton = $("submit-button");
  const paymentSuccess = $("payment-success");
  const paymentForm = $("payment-form");

  // Élèves d'exemple par classe (à remplacer par vos vraies données).
  const STUDENTS = {
    "6eme": ["Brice Mballa", "Clarisse Ngo", "Daniel Fotso"],
    "5eme": ["Esther Nkoulou", "Franck Atangana"],
    "4eme": ["Grâce Essomba", "Hervé Kamga"],
    "3eme": ["Inès Tchoumi", "Joël Ndongo"],
    "2nde-a": ["Karine Bella", "Luc Abena"],
    "2nde-c": ["Marc Onana", "Nadège Owona"],
    "1ere-a": ["Olivia Manga", "Paul Eto'o"],
    "1ere-c": ["Quentin Nana", "Rose Ekambi"],
    "1ere-d": ["Sandrine Mvondo", "Thierry Biyik"],
    "tle-a": ["Ulrich Ze", "Vanessa Ateba"],
    "tle-c": ["Alexandre Tagne", "Willy Nguema"],
    "tle-d": ["Yannick Mbia", "Zoé Ndjock"],
  };

  // Préfixes Cameroun : MTN 67/650-654/68, Orange 69/655-659.
  const OPERATORS = {
    mtn: { label: "MTN Mobile Money", regex: /^6(7\d|5[0-4]|8\d)\d{6}$/ },
    orange: { label: "Orange Money", regex: /^6(9\d|5[5-9])\d{6}$/ },
  };

  let selectedMethod = null;
  const establishment = sessionStorage.getItem("selectedEstablishment");
  const formatFCFA = (n) => Number(n).toLocaleString("fr-FR") + " FCFA";

  const ACTIVE = [
    "border-2",
    "border-[#18184A]",
    "text-[#18184A]",
    "bg-indigo-50/50",
  ];
  const INACTIVE = ["border", "border-gray-300", "text-gray-600"];

  function resetFrom(step) {
    if (step <= 1) {
      studentSelect.innerHTML =
        '<option value="">-- Choisir d\'abord une classe --</option>';
      studentSelect.disabled = true;
    }
    if (step <= 2) {
      trancheSelect.value = "";
      trancheSelect.disabled = true;
      amountDisplay.classList.add("hidden");
    }
    if (step <= 3) {
      selectedMethod = null;
      methodButtons.forEach((b) => {
        b.disabled = true;
        b.classList.remove(...ACTIVE);
        b.classList.add(...INACTIVE);
      });
      phoneBlock.classList.add("hidden");
      phoneInput.value = "";
      phoneError.classList.add("hidden");
    }
    updateSubmit();
  }

  function phoneValid() {
    return (
      selectedMethod && OPERATORS[selectedMethod].regex.test(phoneInput.value)
    );
  }

  function updateSubmit() {
    const ok =
      establishment &&
      classSelect.value &&
      studentSelect.value &&
      trancheSelect.value &&
      phoneValid();
    submitButton.disabled = !ok;
    if (ok) {
      const opt = trancheSelect.selectedOptions[0];
      paymentSummary.innerHTML = `
        <p><strong>Établissement :</strong> ${escapeHtml(establishment)}</p>
        <p><strong>Classe :</strong> ${escapeHtml(classSelect.selectedOptions[0].text)}</p>
        <p><strong>Élève :</strong> ${escapeHtml(studentSelect.value)}</p>
        <p><strong>Tranche :</strong> ${escapeHtml(opt.text)} — ${formatFCFA(opt.dataset.amount)}</p>
        <p><strong>Paiement :</strong> ${OPERATORS[selectedMethod].label} (+237 ${phoneInput.value})</p>`;
      paymentSummary.classList.remove("hidden");
    } else {
      paymentSummary.classList.add("hidden");
    }
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  // Établissement
  if (establishment) {
    establishmentName.textContent = establishment;
    summary.classList.remove("hidden");
    banner.classList.add("hidden");
    classSelect.disabled = false;
  } else {
    banner.classList.remove("hidden");
    summary.classList.add("hidden");
    classSelect.disabled = true;
  }
  resetFrom(1);

  // 1. Classe -> liste des élèves
  classSelect.addEventListener("change", () => {
    resetFrom(1);
    const list = STUDENTS[classSelect.value];
    if (!list) return;
    studentSelect.innerHTML =
      '<option value="">-- Choisir l\'élève --</option>' +
      list
        .map(
          (n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`,
        )
        .join("");
    studentSelect.disabled = false;
  });

  // 2. Élève -> tranche
  studentSelect.addEventListener("change", () => {
    resetFrom(2);
    if (studentSelect.value) trancheSelect.disabled = false;
  });

  // 3. Tranche -> montant + modes de paiement
  trancheSelect.addEventListener("change", () => {
    resetFrom(3);
    const opt = trancheSelect.selectedOptions[0];
    if (!trancheSelect.value) return;
    amountValue.textContent = formatFCFA(opt.dataset.amount);
    amountDisplay.classList.remove("hidden");
    methodButtons.forEach((b) => (b.disabled = false));
  });

  // 4. Mode de paiement -> numéro
  methodButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedMethod = btn.dataset.method;
      methodButtons.forEach((b) => {
        const on = b === btn;
        b.classList.remove(...(on ? INACTIVE : ACTIVE));
        b.classList.add(...(on ? ACTIVE : INACTIVE));
      });
      phoneOperator.textContent = `(${OPERATORS[selectedMethod].label})`;
      phoneBlock.classList.remove("hidden");
      phoneInput.focus();
      phoneInput.dispatchEvent(new Event("input"));
    });
  });

  // 5. Numéro
  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 9);
    if (phoneInput.value.length === 9 && !phoneValid()) {
      phoneError.textContent = `Ce numéro n'est pas un numéro ${OPERATORS[selectedMethod].label} valide.`;
      phoneError.classList.remove("hidden");
    } else {
      phoneError.classList.add("hidden");
    }
    updateSubmit();
  });

  // Validation finale
  paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!establishment) {
      banner.classList.remove("hidden");
      banner.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (submitButton.disabled) return;
    const opt = trancheSelect.selectedOptions[0];
    const payload = {
      etablissement: establishment,
      classe: classSelect.value,
      eleve: studentSelect.value,
      tranche: trancheSelect.value,
      montant: Number(opt.dataset.amount),
      operateur: selectedMethod,
      telephone: "+237" + phoneInput.value,
    };
    // TODO : envoyer `payload` à votre API de paiement (MTN MoMo / Orange Money).
    console.log("Paiement :", payload);
    submitButton.disabled = true;
    submitButton.textContent = "Paiement en cours…";
    setTimeout(() => {
      paymentSuccess.textContent = `Demande de ${formatFCFA(payload.montant)} envoyée au ${payload.telephone}. Validez la transaction sur votre téléphone.`;
      paymentSuccess.classList.remove("hidden");
      submitButton.textContent = "Valider et procéder au paiement";
    }, 1200);
  });
})();
