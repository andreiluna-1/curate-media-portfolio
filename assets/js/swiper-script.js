document.addEventListener("DOMContentLoaded", function () {
	var swiperPartner = new Swiper(".swiperpartner", {
	slidesPerView: 2,
	spaceBetween: 100,
	loop: true,
	loopedSlides: 5,
	grabCursor: false,
	observer: true,
	observeParents: true,
	speed: 1000,
	autoplay: {
		delay: 2000,
		disableOnInteraction: false,
		pauseOnMouseEnter: true,
	},
	breakpoints: {
		0: { 
			slidesPerView: 3,
			spaceBetween: 30
		},
		768: {
			slidesPerView: 3,
			spaceBetween: 100
		},
		992: { 
			slidesPerView: 5
		},
	},
	});
});
