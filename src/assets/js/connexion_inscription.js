document.querySelectorAll(".fa-eye").forEach((eye) => {
  eye.addEventListener("click", () => {
    const input = eye.parentElement.querySelector('input[type="password"], input[type="text"]');
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    eye.classList.toggle("fa-eye", !isHidden);
    eye.classList.toggle("fa-eye-slash", isHidden);
  });
});

const form = document.querySelector("form");
const firstNameInput = document.getElementById("prenom");

if (firstNameInput) {
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const validatePasswords = () => {
    const mismatch =
      confirmPasswordInput.value &&
      passwordInput.value !== confirmPasswordInput.value;
    confirmPasswordInput.setCustomValidity(
      mismatch ? "Les mots de passe ne correspondent pas." : "",
    );
  };

  passwordInput.addEventListener("input", validatePasswords);
  confirmPasswordInput.addEventListener("input", validatePasswords);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    validatePasswords();
    if (!form.reportValidity()) {
      confirmPasswordInput.reportValidity();
      return;
    }

    localStorage.setItem(
      "scholar_profile",
      JSON.stringify({
        name: `${document.getElementById("name").value.trim()} ${firstNameInput.value.trim()}`.trim(),
        phone: document.getElementById("number").value.trim(),
        source: "inscription",
      }),
    );
    window.location.href = "./accueil.html";
  });
} else {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = "./accueil.html";
  });
}
