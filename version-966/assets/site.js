(function () {
    var navButton = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (navButton && mobileNav) {
        navButton.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var index = 0;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });

            var active = slides[index];
            var bg = active.getAttribute("data-bg");
            if (bg) {
                hero.style.setProperty("--hero-bg", "url('" + bg + "')");
            }
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                showSlide(dotIndex);
            });
        });

        showSlide(0);

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }
    }

    var listings = document.querySelectorAll("[data-listing]");
    listings.forEach(function (listing) {
        var input = listing.querySelector("[data-movie-search]");
        var clear = listing.querySelector("[data-clear-search]");
        var cards = Array.prototype.slice.call(listing.querySelectorAll("[data-title]"));
        var empty = listing.querySelector("[data-empty-state]");

        function applySearch() {
            var query = input ? input.value.trim().toLowerCase() : "";
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-year") || "",
                    card.getAttribute("data-region") || "",
                    card.getAttribute("data-genre") || "",
                    card.getAttribute("data-tags") || ""
                ].join(" ").toLowerCase();

                var match = !query || haystack.indexOf(query) !== -1;
                card.classList.toggle("hidden-by-search", !match);

                if (match) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        if (input) {
            input.addEventListener("input", applySearch);
        }

        if (clear && input) {
            clear.addEventListener("click", function () {
                input.value = "";
                applySearch();
                input.focus();
            });
        }

        applySearch();
    });

    var players = document.querySelectorAll("[data-stream]");
    players.forEach(function (shell) {
        var video = shell.querySelector("video");
        var button = shell.querySelector("[data-play-toggle]");
        var status = shell.querySelector("[data-player-status]");
        var stream = shell.getAttribute("data-stream");

        if (!video || !stream) {
            return;
        }

        function setStatus(text) {
            if (status) {
                status.textContent = text;
            }
        }

        function bindSource() {
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                hls.loadSource(stream);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    setStatus("就绪");
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setStatus("播放失败");
                    }
                });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
                video.addEventListener("loadedmetadata", function () {
                    setStatus("就绪");
                });
            } else {
                setStatus("播放失败");
            }
        }

        function togglePlay() {
            if (video.paused) {
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function () {
                        setStatus("点击播放");
                    });
                }
            } else {
                video.pause();
            }
        }

        video.addEventListener("play", function () {
            shell.classList.add("is-playing");
            setStatus("播放中");
            if (button) {
                button.textContent = "❚❚";
            }
        });

        video.addEventListener("pause", function () {
            shell.classList.remove("is-playing");
            setStatus("暂停");
            if (button) {
                button.textContent = "▶";
            }
        });

        if (button) {
            button.addEventListener("click", togglePlay);
        }

        video.addEventListener("click", togglePlay);
        bindSource();
    });
})();
