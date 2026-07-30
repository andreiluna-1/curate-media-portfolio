function initSubmitNewsletter() {
    $('#newsletter-form').on('submit', function(event) {
        event.preventDefault();

        var $email = $('#newsletter');
        var $successMessage = $('#newsletter-success');
        var $errorMessage = $('#newsletter-error');

        var isValid = true;

        function validateEmail(email) {
            var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(email);
        }

        if (isValid) {
            $successMessage.removeClass('hidden');
            $('#newsletter-form')[0].reset();
            setTimeout(function() {
                $successMessage.addClass('hidden');
            }, 3000);
        } else {
            $errorMessage.removeClass('hidden');
            $('#newsletter-form')[0].reset();
            setTimeout(function() {
                $errorMessage.addClass('hidden');
            }, 3000);
        }
    });
}

function initSubmitContact() {
    const $form = $('#contact-form');
    const $success = $('#success-message');
    const $error = $('#error-message');

    if (!$form.length) return;

    $form.on('submit', function (event) {
        event.preventDefault();

        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const phone = $('#phone').val().trim();
        const subject = $('#subject').val().trim();
        const projectType = $('#project-type').val().trim();
        const message = $('#Message').val().trim();

        let isValid = true;

        function validateEmail(email) {
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(email);
        }

        if (name === "" || email === "" || subject === "" || message === "") {
            isValid = false;
        }
        if (!validateEmail(email)) {
            isValid = false;
        }
        if (projectType === "") {
            isValid = false;
        }

        if (isValid) {
            $success.removeClass('hidden');
            $form[0].reset();
            $('.selected-text').text("Project Type");

            setTimeout(() => {
                $success.addClass('hidden');
            }, 3000);
        } else {
            $error.removeClass('hidden');

            setTimeout(() => {
                $error.addClass('hidden');
            }, 3000);
        }
    });
}
