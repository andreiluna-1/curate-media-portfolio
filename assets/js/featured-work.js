/**
 * Featured Work — video showcase behavior
 *
 * What this file does, in order:
 *  1. Lazy-loads each video's real source only once its card is near the
 *     viewport (the <source> tag holds the real URL in data-src until then).
 *  2. Reveals cards with a fade/slide-up as they scroll into view.
 *  3. Gives every card a custom control bar: play/pause, seek, time,
 *     volume, and fullscreen — all keyboard accessible.
 *  4. Ensures only one video plays at a time.
 *  5. Remembers each video's playback position for the length of the tab
 *     session (sessionStorage), so switching cards and coming back resumes
 *     where the visitor left off.
 *  6. On non-touch devices, hovering a card that hasn't been played yet
 *     shows a quiet, muted preview loop — the same "hover to preview"
 *     pattern used on high-end reels. It never plays with sound; the
 *     visitor always has to click to hear anything.
 */
(function () {
    "use strict";

    const grid = document.querySelector(".fw-grid");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".fw-card"));
    const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const STORAGE_PREFIX = "fw-progress:";

    function formatTime(seconds) {
        if (!isFinite(seconds) || seconds < 0) seconds = 0;
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ":" + String(s).padStart(2, "0");
    }

    function pauseAllExcept(exceptVideo) {
        cards.forEach((card) => {
            const video = card.querySelector(".fw-video");
            if (video && video !== exceptVideo && !video.paused) {
                video.pause();
            }
        });
    }

    cards.forEach((card) => {
        const slug = card.getAttribute("data-fw-slug") || "";
        const media = card.querySelector(".fw-media");
        const video = card.querySelector(".fw-video");
        const source = video.querySelector("source[data-src]");
        const playOverlay = card.querySelector(".fw-play-overlay");
        const controls = card.querySelector(".fw-controls");
        const playBtn = card.querySelector(".fw-play-btn");
        const progress = card.querySelector(".fw-progress");
        const timeCurrent = card.querySelector(".fw-time-current");
        const timeDuration = card.querySelector(".fw-time-duration");
        const muteBtn = card.querySelector(".fw-mute-btn");
        const volume = card.querySelector(".fw-volume");
        const fullscreenBtn = card.querySelector(".fw-fullscreen-btn");

        let sourceLoaded = false;
        let engaged = false; // true once the visitor has clicked play at least once
        let isSeeking = false;

        function loadSourceIfNeeded() {
            if (sourceLoaded) return;
            source.src = source.getAttribute("data-src");
            video.load();
            sourceLoaded = true;

            video.addEventListener("loadedmetadata", () => {
                timeDuration.textContent = formatTime(video.duration);
                const saved = sessionStorage.getItem(STORAGE_PREFIX + slug);
                if (saved) {
                    const t = parseFloat(saved);
                    if (isFinite(t) && t > 0 && t < video.duration - 1) {
                        video.currentTime = t;
                    }
                }
            });
        }

        // Lazy-load: only fetch the real video once the card is close to view
        const lazyObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        loadSourceIfNeeded();
                        lazyObserver.unobserve(card);
                    }
                });
            },
            { rootMargin: "300px 0px" }
        );
        lazyObserver.observe(card);

        // Scroll reveal
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        card.classList.add("is-visible");
                        revealObserver.unobserve(card);
                    }
                });
            },
            { threshold: 0.15 }
        );
        revealObserver.observe(card);

        function setPlayIcon(isPlaying) {
            const icon = playBtn.querySelector("i");
            icon.classList.toggle("fa-play", !isPlaying);
            icon.classList.toggle("fa-pause", isPlaying);
        }

        function enterEngagedPlayback() {
            loadSourceIfNeeded();
            engaged = true;
            video.muted = false;
            video.loop = false;
            pauseAllExcept(video);
            card.classList.add("fw-card--playing");
            const playPromise = video.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(() => {
                    // Autoplay with sound can be blocked; fall back to muted play.
                    video.muted = true;
                    video.play();
                });
            }
        }

        playOverlay.addEventListener("click", enterEngagedPlayback);

        playBtn.addEventListener("click", () => {
            if (!engaged) {
                enterEngagedPlayback();
                return;
            }
            if (video.paused) {
                pauseAllExcept(video);
                video.play();
            } else {
                video.pause();
            }
        });

        video.addEventListener("play", () => setPlayIcon(true));
        video.addEventListener("pause", () => setPlayIcon(false));

        video.addEventListener("timeupdate", () => {
            if (!video.duration) return;
            if (!isSeeking) {
                progress.value = (video.currentTime / video.duration) * 100;
            }
            timeCurrent.textContent = formatTime(video.currentTime);
            if (engaged) {
                sessionStorage.setItem(STORAGE_PREFIX + slug, String(video.currentTime));
            }
        });

        progress.addEventListener("input", () => {
            isSeeking = true;
            if (video.duration) {
                timeCurrent.textContent = formatTime((progress.value / 100) * video.duration);
            }
        });
        progress.addEventListener("change", () => {
            if (video.duration) {
                video.currentTime = (progress.value / 100) * video.duration;
            }
            isSeeking = false;
        });

        muteBtn.addEventListener("click", () => {
            video.muted = !video.muted;
            const icon = muteBtn.querySelector("i");
            icon.classList.toggle("fa-volume-high", !video.muted);
            icon.classList.toggle("fa-volume-xmark", video.muted);
        });

        volume.addEventListener("input", () => {
            video.volume = parseFloat(volume.value);
            video.muted = video.volume === 0;
        });

        fullscreenBtn.addEventListener("click", () => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitEnterFullscreen) {
                // iOS Safari
                video.webkitEnterFullscreen();
            }
        });

        // Keyboard: space/enter on the media toggles play when focused
        media.setAttribute("tabindex", "0");
        media.addEventListener("keydown", (e) => {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                playBtn.click();
            }
        });

        video.addEventListener("ended", () => {
            if (engaged) {
                sessionStorage.removeItem(STORAGE_PREFIX + slug);
            }
            card.classList.remove("fw-card--playing");
        });

        // Quiet muted hover-preview, desktop only, before first real engagement
        if (!isTouchDevice) {
            card.addEventListener("mouseenter", () => {
                card.classList.add("fw-focused");
                grid.classList.add("fw-has-focus");
                if (!engaged) {
                    loadSourceIfNeeded();
                    video.muted = true;
                    video.loop = true;
                    video.play().catch(() => {});
                }
            });
            card.addEventListener("mouseleave", () => {
                card.classList.remove("fw-focused");
                grid.classList.remove("fw-has-focus");
                if (!engaged) {
                    video.pause();
                    video.currentTime = 0;
                    video.loop = false;
                }
            });
        }
    });
})();
