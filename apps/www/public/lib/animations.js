window.addEventListener("DOMContentLoaded", () => {
  const elementAnimated =
    document.querySelector(".animatedscroll2") ||
    document.querySelector(".animatedscroll1") ||
    document.querySelector(".animatedscroll0");
  if (!elementAnimated) return;

  let animationNumber =
    elementAnimated.className[
      elementAnimated.className.indexOf("animatedscroll") + 14
    ];
  if (animationNumber === 0) return;

  const boxes = document.querySelectorAll(".animatedscroll" + animationNumber);

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  };

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible" + animationNumber);
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);
  boxes.forEach((box) => observer.observe(box));
});
