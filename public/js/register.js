// simple password functionality (show/hide password)
const pswdBtn = document.querySelector("#pswdButton");
const pswdInput = document.querySelector("#account_password");

pswdBtn.addEventListener("click", function () {
  const type = pswdInput.getAttribute("type");
  if (type === "password") {
    pswdInput.setAttribute("type", "text");
    pswdBtn.innerHTML = "Hide Password";
  } else {
    pswdInput.setAttribute("type", "password"); // corrigido
    pswdBtn.innerHTML = "Show Password";
  }
});
