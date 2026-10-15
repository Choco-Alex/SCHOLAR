const searchInputs = document.querySelectorAll(
  'input[placeholder="Recherche"]',
);
const establishmentSelect = document.getElementById("establishment-select");
const nextButton = document.getElementById("next-button");
const picker = document.getElementById("establishment-picker");
const pickerTrigger = document.getElementById("establishment-trigger");
const pickerLabel = document.getElementById("establishment-label");
const pickerOptions = document.getElementById("establishment-options");

function closePicker() {
  pickerOptions.classList.add("hidden");
  pickerTrigger.setAttribute("aria-expanded", "false");
  pickerTrigger.querySelector("i").classList.remove("rotate-180");
}

Array.from(establishmentSelect.options)
  .slice(1)
  .forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.type = "button";
    optionButton.setAttribute("role", "option");
    optionButton.setAttribute("aria-selected", "false");
    optionButton.dataset.value = option.value;
    optionButton.className =
      "flex w-full items-center gap-3 border-b border-gray-400 px-3 py-2.5 text-left text-sm text-gray-700 last:border-b-0 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none";
    optionButton.innerHTML =
      '<i class="fa-solid fa-chevron-right text-xs text-[#18184A]"></i>';
    optionButton.append(document.createTextNode(option.textContent));
    optionButton.addEventListener("click", () => {
      establishmentSelect.value = option.value;
      establishmentSelect.dispatchEvent(new Event("change", { bubbles: true }));
      closePicker();
    });
    pickerOptions.append(optionButton);
  });

pickerTrigger.addEventListener("click", () => {
  const isOpen = pickerTrigger.getAttribute("aria-expanded") === "true";
  pickerOptions.classList.toggle("hidden", isOpen);
  pickerTrigger.setAttribute("aria-expanded", String(!isOpen));
  pickerTrigger.querySelector("i").classList.toggle("rotate-180", !isOpen);
});

establishmentSelect.addEventListener("change", () => {
  const selectedOption = establishmentSelect.selectedOptions[0];
  pickerLabel.textContent = selectedOption.textContent;
  pickerOptions.querySelectorAll('[role="option"]').forEach((optionButton) => {
    optionButton.setAttribute(
      "aria-selected",
      String(optionButton.dataset.value === establishmentSelect.value),
    );
  });
});

document.addEventListener("click", (event) => {
  if (!picker.contains(event.target)) closePicker();
});

function updateNextButton() {
  const hasSelection = establishmentSelect.value !== "";
  nextButton.classList.toggle("bg-gray-400", !hasSelection);
  nextButton.classList.toggle("cursor-not-allowed", !hasSelection);
  nextButton.classList.toggle("bg-[#0D0E6D]", hasSelection);
  nextButton.classList.toggle("hover:bg-[#18184A]", hasSelection);
  nextButton.setAttribute("aria-disabled", String(!hasSelection));
}

establishmentSelect.addEventListener("change", () => {
  if (establishmentSelect.value) {
    sessionStorage.setItem("selectedEstablishment", establishmentSelect.value);
  } else {
    sessionStorage.removeItem("selectedEstablishment");
  }
  updateNextButton();
});

// Restaure la sélection précédente si l'utilisateur revient sur cette page
const savedEstablishment = sessionStorage.getItem("selectedEstablishment");
if (savedEstablishment) {
  establishmentSelect.value = savedEstablishment;
  establishmentSelect.dispatchEvent(new Event("change", { bubbles: true }));
}

searchInputs.forEach((searchInput) => {
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    searchInputs.forEach((otherInput) => {
      if (otherInput !== searchInput) otherInput.value = searchInput.value;
    });
    const options = Array.from(establishmentSelect.options).slice(1);
    const matchingOption = options.find((option) =>
      option.textContent.toLowerCase().includes(searchTerm),
    );

    options.forEach((option) => {
      option.hidden =
        searchTerm !== "" &&
        !option.textContent.toLowerCase().includes(searchTerm);
    });
    pickerOptions
      .querySelectorAll('[role="option"]')
      .forEach((optionButton) => {
        const option = options.find(
          (item) => item.value === optionButton.dataset.value,
        );
        optionButton.hidden =
          searchTerm !== "" &&
          !option.textContent.toLowerCase().includes(searchTerm);
      });

    if (searchTerm) {
      establishmentSelect.value = matchingOption ? matchingOption.value : "";
      establishmentSelect.dispatchEvent(new Event("change"));
    }
  });
});

nextButton.addEventListener("click", (event) => {
  if (nextButton.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
    return;
  }
  // S'assure que l'établissement choisi est bien enregistré avant
  // d'être redirigé vers la page de paiement.
  sessionStorage.setItem("selectedEstablishment", establishmentSelect.value);
});
