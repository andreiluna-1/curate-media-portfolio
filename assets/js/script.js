$(function() {
    initProjectHeading();
    initNavLink();
    initSidebar();
    initSidebarDropdown();
    initCounter();
    initCustomDropdown();
    initSubmitContact();
    initSubmitNewsletter();
});


// ===============================================
// 🔹 9. Heading Project Animations
// ===============================================


function initProjectHeading() {
    const $heading = $(".project-section-heading");
    if (!$heading.length) return;

    let lastScrollTop = $(window).scrollTop();

    $(window).on("scroll", function () {
        const currentScroll = $(this).scrollTop();

        if (currentScroll > lastScrollTop) {
            $heading.addClass("is-hidden");
        } else {
            $heading.removeClass("is-hidden");
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
}


// ===============================================
// 🔹 10. Sidebar
// ===============================================

function initSidebar() {
    const $menu = $(".nav-btn");
    const $close = $(".close-btn");
    const $overlay = $(".sidebar-overlay");
    const $sidebar = $(".sidebar");

    $menu.on("click", function() {
        $overlay.addClass("active");
        setTimeout(() => $sidebar.addClass("active"), 200);
    });

    $close.on("click", closeSidebar);
    $overlay.on("click", closeSidebar);

    function closeSidebar() {
        $sidebar.removeClass("active");
        setTimeout(() => $overlay.removeClass("active"), 200);
    }
}


function initSidebarDropdown() {
    const $dropdownButtons = $(".sidebar-dropdown-btn");

    $dropdownButtons.each(function() {
        $(this).on("click", function() {
            const $dropdownMenu = $(this).parent().next(".sidebar-dropdown-menu");
            const isOpen = $dropdownMenu.hasClass("active");

            $(".sidebar-dropdown-menu").not($dropdownMenu).removeClass("active");

            $dropdownMenu.toggleClass("active", !isOpen);
        });
    });
}

// ===============================================
// 🔹 11. Counter Animation
// ===============================================

function initCounter() {
    var $counters = $(".counter");

    function formatCount(num) {
        if (num >= 1_000_000) 
            return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + "M";
        if (num >= 1_000) 
            return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + "K";
        return num;
    }

    function updateCount($counter) {
        var target = $counter.data("target");
        var current = $counter.data("current") || 0;

        var duration = 1500;
        var steps = 30;
        var increment = Math.max(1, Math.ceil(target / steps));

        var nextCount = Math.min(target, current + increment);
        $counter.data("current", nextCount);

        $counter.text(formatCount(nextCount));

        if (nextCount < target) {
            setTimeout(function () {
                updateCount($counter);
            }, duration / steps);
        }
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !$(entry.target).data("counted")) {
                var $counter = $(entry.target);
                $counter.data("counted", true);
                updateCount($counter);
            }
        });
    }, { threshold: 0.5 });

    $counters.each(function () {
        var $counter = $(this);

        $counter.data("counted", false);
        $counter.data("current", 0);

        observer.observe(this);
    });
}

// ===============================================
// 🔹 12. Nav Link
// ===============================================

function initNavLink() {
    const currentUrl = window.location.href;
    $(".navbar-nav .nav-link").each(function() {
        if (this.href === currentUrl) {
            $(this).addClass("active");
        }
    });
    $(".navbar-nav .dropdown-menu .dropdown-item").each(function() {
        if (this.href === currentUrl) {
            $(this).addClass("active");
            $(this).closest(".dropdown").find(".nav-link.dropdown-toggle").addClass("active");
        }
    });
}

// ===============================================
// 🔹 5. Custom Dropdown
// ===============================================

function initCustomDropdown() {
    $('.dropdown-select').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const $container = $(this).closest('.dropdown-container');
        const $caretIcon = $(this).find('.fa-caret-down');
        $('.dropdown-container').not($container).removeClass('active');
        $('.fa-caret-down').not($caretIcon).removeClass('rotate');
        $container.toggleClass('active');
        $caretIcon.toggleClass('rotate');
    });

    $('.dropdown-option').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const $option = $(this);
        const $container = $option.closest('.dropdown-container');
        const $selectedText = $container.find('.selected-text');
        const $hiddenInput = $container.find('.dropdown-value');
        const $allOptions = $container.find('.dropdown-option');
        const selectedValue = $option.data('value');
        const selectedText = $option.text().trim();
        $selectedText.text(selectedText);
        $selectedText.addClass('has-value');
        $hiddenInput.val(selectedValue);
        $allOptions.removeClass('selected');
        $option.addClass('selected');
        $container.removeClass('active');
        $container.find('.fa-caret-down').removeClass('rotate');
        $hiddenInput.trigger('change');
        console.log('Selected:', selectedValue, selectedText);
    });

    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dropdown-container').length) {
            $('.dropdown-container').removeClass('active');
            $('.fa-caret-down').removeClass('rotate');
        }
    });

    $('.dropdown-select').on('keydown', function(e) {
        const $container = $(this).closest('.dropdown-container');
        switch(e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                $(this).click();
                break;
            case 'Escape':
                $container.removeClass('active');
                $container.find('.fa-caret-down').removeClass('rotate');
                break;
            case 'ArrowDown':
            case 'ArrowUp':
                e.preventDefault();
                if (!$container.hasClass('active')) {
                    $container.addClass('active');
                    $container.find('.fa-caret-down').addClass('rotate');
                }
                const $options = $container.find('.dropdown-option');
                const $focused = $options.filter(':focus');
                let nextIndex;
                if ($focused.length === 0) {
                    nextIndex = e.key === 'ArrowDown' ? 0 : $options.length - 1;
                } else {
                    const currentIndex = $options.index($focused);
                    if (e.key === 'ArrowDown') {
                        nextIndex = currentIndex + 1 >= $options.length ? 0 : currentIndex + 1;
                    } else {
                        nextIndex = currentIndex - 1 < 0 ? $options.length - 1 : currentIndex - 1;
                    }
                }
                $options.eq(nextIndex).focus();
                break;
        }
    });

    $('.dropdown-option').attr('tabindex', '0');

    $('.dropdown-option').on('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
    });

    window.resetDropdown = function(containerId) {
        const $container = $('#' + containerId);
        if ($container.length) {
            $container.find('.selected-text').text('Project Type').removeClass('has-value');
            $container.find('.dropdown-value').val('');
            $container.find('.dropdown-option').removeClass('selected');
            $container.removeClass('active');
            $container.find('.fa-caret-down').removeClass('rotate');
        }
    };

    window.getDropdownValue = function(containerId) {
        const $container = $('#' + containerId);
        return $container.find('.dropdown-value').val();
    };

    window.setDropdownValue = function(containerId, value) {
        const $container = $('#' + containerId);
        const $option = $container.find('.dropdown-option[data-value="' + value + '"]');
        if ($option.length) {
            $option.click();
        }
    };
}