document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const backdrop = document.getElementById("backdrop");
  nav.classList.remove("toogle-show");
  backdrop.classList.remove("backdrop-show");
  backdrop.classList.remove("backdrop-dimmed");
});

function toggle() {
  const nav = document.getElementById("nav");

  if (nav?.classList.contains("toogle-show")) {
    hide();
  } else {
    show();
  }
}

function show() {
  const backdrop = document.getElementById("backdrop");
  const nav = document.getElementById("nav");

  nav?.classList.add("toogle-show");
  backdrop?.classList.add("backdrop-show");
  setTimeout(() => {
    backdrop?.classList.add("backdrop-dimmed");
  }, 150);
}

function hide() {
  const backdrop = document.getElementById("backdrop");
  const nav = document.getElementById("nav");

  nav?.classList.remove("toogle-show");
  backdrop?.classList.remove("backdrop-dimmed");
  setTimeout(() => {
    backdrop?.classList.remove("backdrop-show");
  }, 150);
}
