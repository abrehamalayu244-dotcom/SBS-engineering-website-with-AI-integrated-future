/* Optional engineering-themed motion layer.
   Loaded safely on pages that want it. */
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  hero.addEventListener("pointermove", event => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    hero.style.setProperty("--mx", `${x * 8}px`);
    hero.style.setProperty("--my", `${y * 5}px`);
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--mx", "0px");
    hero.style.setProperty("--my", "0px");
  });
});
