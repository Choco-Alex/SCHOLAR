let input = document.querySelector("#password");
let eye = document.querySelector(".fa-eye");

eye.addEventListener("click", function () {
  if (input.type === "password") {
    input.type = "text";
    eye.classList.remove("fa-eye");
    eye.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    eye.classList.remove("fa-eye-slash");
    eye.classList.add("fa-eye");
  }
});
