const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

function toggleSidebar() {
  sidebar.classList.toggle("-translate-x-full");
  sidebarOverlay.classList.toggle("hidden");
}

menuBtn.addEventListener("click", toggleSidebar);
sidebarOverlay.addEventListener("click", toggleSidebar);

let storedProfile = {};
try {
  storedProfile = JSON.parse(localStorage.getItem("scholar_profile")) || {};
} catch (error) {}

let profile = ["accueil", "inscription"].includes(storedProfile.source)
  ? storedProfile
  : {};
const headerProfile = document.querySelector("header > div:last-child");
if (headerProfile) {
  const profileLink = document.createElement("a");
  profileLink.href = "my_account.html";
  profileLink.setAttribute("aria-label", "Accéder à Mon Compte");
  profileLink.className = `${headerProfile.className} rounded-full focus:outline-none focus:ring-2 focus:ring-[#18184A] focus:ring-offset-2`;
  while (headerProfile.firstChild) {
    profileLink.appendChild(headerProfile.firstChild);
  }
  headerProfile.replaceWith(profileLink);
  const name = profileLink.querySelector("span");
  if (name) name.textContent = profile.name || "Mon compte";
}

const profileHeading = document.getElementById("profile-heading");
const profileNameInput = document.getElementById("profile-name");
const profilePhoneInput = document.getElementById("profile-phone");
const homeProfileForm = document.getElementById("home-profile-form");
const homeProfileName = document.getElementById("home-profile-name");
const homeProfilePhone = document.getElementById("home-profile-phone");
const welcomeName = document.getElementById("welcome-profile-name");

function renderProfile() {
  const profileName = profile.name || "";
  const headerName = document.querySelector(
    "header a[aria-label='Accéder à Mon Compte'] span",
  );
  if (headerName) headerName.textContent = profileName || "Mon compte";
  if (profileHeading) profileHeading.textContent = profileName || "Mon profil";
  if (profileNameInput) profileNameInput.value = profileName;
  if (profilePhoneInput) profilePhoneInput.value = profile.phone || "";
  if (homeProfileName) homeProfileName.value = profileName;
  if (homeProfilePhone) homeProfilePhone.value = profile.phone || "";
  if (welcomeName) welcomeName.textContent = profileName;

  const profileInitial = document.getElementById("profile-initial");
  if (profileInitial) profileInitial.textContent = profileName.charAt(0).toUpperCase() || "?";
}

renderProfile();

if (homeProfileForm) {
  homeProfileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    profile = {
      name: homeProfileName.value.trim(),
      phone: homeProfilePhone.value.trim(),
      source: "accueil",
    };
    localStorage.setItem("scholar_profile", JSON.stringify(profile));
    renderProfile();
  });
}
