document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const backdrop = document.getElementById("backdrop");
  nav.classList.remove("toogle-show");
  backdrop.classList.remove("backdrop-show");
});

function toggle() {
  const backdrop = document.getElementById("backdrop");
  const nav = document.getElementById("nav");

  nav?.classList.toggle("toogle-show");
  backdrop?.classList.toggle("backdrop-show");
}

function hide() {
  const backdrop = document.getElementById("backdrop");
  const nav = document.getElementById("nav");

  nav?.classList.remove("toogle-show");
  backdrop?.classList.remove("backdrop-show");
}
