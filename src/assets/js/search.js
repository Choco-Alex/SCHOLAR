(() => {
  const inputs = Array.from(document.querySelectorAll("[data-site-search]"));
  const navigationLinks = Array.from(
    document.querySelectorAll("#sidebar nav a[href]"),
  );
  const hasLocalSearch = Boolean(
    document.getElementById("establishment-select"),
  );

  if (!inputs.length) return;

  const normalize = (value) =>
    value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("fr");

  const resultLists = new Map();

  function closeResults() {
    resultLists.forEach((list) => list.classList.add("hidden"));
    inputs.forEach((input) => input.setAttribute("aria-expanded", "false"));
  }

  function renderResults(input, term) {
    const results = resultLists.get(input);
    results.replaceChildren();

    if (!term || hasLocalSearch) {
      results.classList.add("hidden");
      input.setAttribute("aria-expanded", "false");
      return;
    }

    const matches = navigationLinks.filter((link) =>
      normalize(link.textContent.trim()).includes(normalize(term)),
    );

    if (matches.length) {
      matches.forEach((link) => {
        const result = document.createElement("a");
        result.href = link.getAttribute("href");
        result.className =
          "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100";
        result.textContent = link.textContent.trim();
        results.append(result);
      });
    } else {
      const emptyState = document.createElement("p");
      emptyState.className = "px-4 py-2 text-sm text-gray-500";
      emptyState.textContent = "Aucun résultat";
      results.append(emptyState);
    }

    results.classList.remove("hidden");
    input.setAttribute("aria-expanded", "true");
  }

  inputs.forEach((input, index) => {
    const results = document.createElement("div");
    results.id = `site-search-results-${index}`;
    results.className =
      "absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg hidden";
    results.setAttribute("role", "listbox");
    input.parentElement.append(results);
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-controls", results.id);
    input.setAttribute("aria-expanded", "false");
    resultLists.set(input, results);

    input.addEventListener("input", () => {
      inputs.forEach((otherInput) => {
        if (otherInput !== input) otherInput.value = input.value;
      });

      const term = input.value.trim();
      renderResults(input, term);
      resultLists.forEach((otherResults, otherInput) => {
        if (otherInput !== input) renderResults(otherInput, term);
      });
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        closeResults();
      }

      if (event.key === "Enter") {
        const firstResult = results.querySelector("a");
        if (firstResult) {
          event.preventDefault();
          window.location.href = firstResult.href;
        }
      }
    });

    input.addEventListener("focus", () => {
      if (input.value.trim()) renderResults(input, input.value.trim());
    });
  });

  document.addEventListener("click", (event) => {
    if (!inputs.some((input) => input.parentElement.contains(event.target))) {
      closeResults();
    }
  });
})();
