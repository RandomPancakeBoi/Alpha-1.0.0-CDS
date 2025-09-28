document.addEventListener('DOMContentLoaded', () => {
	// Mobile nav toggle
	const navToggle = document.getElementById('navToggle');
	navToggle.addEventListener('click', () => {
		document.body.classList.toggle('nav-open');
		const expanded = navToggle.getAttribute('aria-expanded') === 'true';
		navToggle.setAttribute('aria-expanded', String(!expanded));
	});

	// Fade-up on scroll
	const faders = document.querySelectorAll('.fade-up');
	const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
	const appearOnScroll = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				observer.unobserve(entry.target);
			}
		});
	}, appearOptions);
	faders.forEach(fader => appearOnScroll.observe(fader));

	// Counter animation
	const counters = document.querySelectorAll('.count');
	counters.forEach(counter => {
		const target = counter.getAttribute('data-target') || counter.getAttribute('data-src') || 0;
		let count = 0;
		const increment = target / 120;
		const updateCount = () => {
			count += increment;
			if (count < target) {
				counter.textContent = Math.ceil(count);
				requestAnimationFrame(updateCount);
			} else {
				counter.textContent = target;
			}
		};
		updateCount();
	});

	// Dynamic year in footer
	document.getElementById('year').textContent = new Date().getFullYear();

	// Contact form handling
	const form = document.getElementById('contactForm');
	const status = document.getElementById('formStatus');

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		status.textContent = "Sending...";

		try {
			const response = await fetch(form.action, {
				method: "POST",
				body: new FormData(form),
				headers: { 'Accept': 'application/json' }
			});

			if (response.ok) {
				status.textContent = "Message sent! We'll get back to you shortly.";
				form.reset();
			} else {
				const data = await response.json();
				status.textContent = data.errors
					? data.errors.map(error => error.message).join(", ")
					: "Oops! There was a problem sending your message.";
			}
		} catch (error) {
			status.textContent = "Network error. Please try again.";
		}
	});
})