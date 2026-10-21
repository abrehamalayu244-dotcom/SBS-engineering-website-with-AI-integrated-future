document.addEventListener("DOMContentLoaded", () => {
  const testimonials = [...document.querySelectorAll(".testimonial")];
  const dots = [...document.querySelectorAll(".dot")];

  if (!testimonials.length) return;

  let current = Math.max(
    0,
    testimonials.findIndex(item => item.classList.contains("active"))
  );

  const showSlide = index => {
    current = (index + testimonials.length) % testimonials.length;

    testimonials.forEach((item, i) => {
      item.classList.toggle("active", i === current);
      item.setAttribute("aria-hidden", i === current ? "false" : "true");
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
      dot.setAttribute("aria-current", i === current ? "true" : "false");
    });
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  showSlide(current);

  if (testimonials.length > 1) {
    setInterval(() => showSlide(current + 1), 5000);
  }
});
