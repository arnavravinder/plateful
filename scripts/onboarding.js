document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 500,
        easing: 'ease-out-quad',
        once: true
    });

    const firebaseConfig = {
        apiKey: "AIzaSyBzme7aDxUAvWz1FG-8try_mVH4-ulJB50",
        authDomain: "plateful-firebase.firebaseapp.com",
        projectId: "plateful-firebase",
        storageBucket: "plateful-firebase.firebasestorage.app",
        messagingSenderId: "282607147046",
        appId: "1:282607147046:web:0f9cb2659e258393a8eee7",
        measurementId: "G-LBB13WHX9M"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    window.recaptchaVerifier = null;
    window.confirmationResult = null;

    const form = document.getElementById('onboarding-form');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const progressBar = document.querySelector('.progress-bar-inner');
    const nextButtons = document.querySelectorAll('.next-btn');
    const authError = document.getElementById('auth-error');

    const TOTAL_QUESTIONS = 4;
    let currentStep = 0;
    let userData = {};

    const phoneInputField = document.querySelector("#phone");
    const phoneInput = window.intlTelInput(phoneInputField, {
        initialCountry: "in",
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/19.2.16/js/utils.js",
        dropdownContainer: document.body,
        autoPlaceholder: "aggressive",
        formatOnDisplay: true,
        nationalMode: false,
        preferredCountries: ["in", "us", "gb"]
    });
    
    setTimeout(() => {
        const countryList = document.querySelector('.iti__country-list');
        if (countryList) {
            countryList.style.display = 'none';
            countryList.classList.remove('iti--active');
        }
    }, 100);

    const updateProgressBar = () => {
        const progress = currentStep > 0 ? ((currentStep - 1) / (TOTAL_QUESTIONS - 1)) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    };

    const showStep = (stepIndex) => {
        steps.forEach((step, index) => {
            const isActive = index === stepIndex;
            step.classList.toggle('active', isActive);
        });
        currentStep = stepIndex;
        updateProgressBar();
        setTimeout(() => AOS.refresh(), 100);
        
        if (stepIndex === 4) {
            setTimeout(() => {
                const checkmarkOverlay = document.querySelector('.checkmark-overlay');
                if (checkmarkOverlay) {
                    checkmarkOverlay.classList.add('show');
                }
            }, 800);
        }
    };

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@(([[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const validateStep = (stepIndex) => {
        const currentStepEl = steps[stepIndex];
        const input = currentStepEl.querySelector('input, textarea');
        const errorEl = currentStepEl.querySelector('.error-message');
        if (errorEl) errorEl.textContent = '';

        if (!input || !input.required) return true;

        if (!input.value.trim()) {
            if (errorEl) errorEl.textContent = 'This field is required.';
            return false;
        }

        if (input.type === 'email' && !validateEmail(input.value)) {
            if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
            return false;
        }

        userData[input.name] = input.value;
        return true;
    };

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    showStep(currentStep + 1);
                    if (currentStep === 4) {
                        document.getElementById('final-name').textContent = userData.fullname ? userData.fullname.split(' ')[0] : 'there';
                    }
                }
            }
        });
    });

    const handleAuthSuccess = (user) => {
        userData.uid = user.uid;
        if (user.displayName) {
            document.getElementById('full-name').value = user.displayName;
            userData.fullname = user.displayName;
        }
        if (user.email) {
            document.getElementById('email').value = user.email;
            userData.email = user.email;
        }
        if (user.phoneNumber) {
            phoneInput.setNumber(user.phoneNumber);
            userData.phone = user.phoneNumber;
        }
        
        localStorage.setItem('platefulUser', JSON.stringify({
            uid: user.uid,
            displayName: user.displayName || userData.fullname,
            email: user.email || userData.email,
            photoURL: user.photoURL || null
        }));
        
        showStep(1);
    };

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {},
                'expired-callback': () => {
                    authError.textContent = 'reCAPTCHA expired. Please try again.';
                    if (grecaptcha && window.recaptchaWidgetId) {
                        grecaptcha.reset(window.recaptchaWidgetId);
                    }
                }
            });
            window.recaptchaVerifier.render().then(widgetId => {
                window.recaptchaWidgetId = widgetId;
            });
        }
    };

    document.getElementById('google-signin').addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(result => handleAuthSuccess(result.user))
            .catch(error => {
                if (error.code === 'auth/popup-closed-by-user') {
                    return;
                }
                authError.textContent = 'Unable to sign in. Please try again.';
            });
    });

    document.getElementById('twitter-signin').addEventListener('click', () => {
        const provider = new firebase.auth.TwitterAuthProvider();
        auth.signInWithPopup(provider)
            .then(result => handleAuthSuccess(result.user))
            .catch(error => {
                console.error("X/Twitter Sign-In Error:", error);
                if (error.code === 'auth/popup-closed-by-user') {
                    return;
                }
                authError.textContent = `X sign-in failed: ${error.message}. This may be a temporary issue with the service. Please try another method.`;
            });
    });

    document.getElementById('send-otp-btn').addEventListener('click', () => {
        authError.textContent = '';
        if (!phoneInput.isValidNumber()) {
            authError.textContent = 'Please enter a valid phone number.';
            return;
        }
        const phoneNumber = phoneInput.getNumber();
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;

        auth.signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(confirmationResult => {
                window.confirmationResult = confirmationResult;
                document.getElementById('phone-input-group').classList.add('hidden');
                document.getElementById('otp-input-group').classList.remove('hidden');
            }).catch(error => {
                if (error.code === 'auth/billing-not-enabled') {
                    authError.textContent = 'Phone authentication requires Firebase billing. Please use Google or Twitter sign-in for now.';
                } else if (error.code === 'auth/invalid-phone-number') {
                    authError.textContent = 'Invalid phone number. Please check and try again.';
                } else if (error.code === 'auth/too-many-requests') {
                    authError.textContent = 'Too many attempts. Please try again later.';
                } else {
                    console.error('Phone Auth Error:', error);
                    authError.textContent = 'Unable to send verification code. Please try another sign-in method.';
                }
                if (grecaptcha && window.recaptchaWidgetId) {
                    grecaptcha.reset(window.recaptchaWidgetId);
                }
            });
    });

    document.getElementById('verify-otp-btn').addEventListener('click', () => {
        const code = document.getElementById('otp').value;
        if (!code || code.length < 6) {
            authError.textContent = 'Please enter the 6-digit code.';
            return;
        }
        authError.textContent = '';
        window.confirmationResult.confirm(code)
            .then(result => handleAuthSuccess(result.user))
            .catch(error => authError.textContent = 'Invalid code. Please try again.');
    });

    form.addEventListener('submit', (e) => e.preventDefault());

    const checkTestMode = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('test') === 'true') {
            const testUser = {
                uid: 'test-user-123',
                displayName: 'Test User',
                email: 'test@example.com',
                phoneNumber: '+919876543210'
            };
            handleAuthSuccess(testUser);
        } else {
            showStep(0);
        }
    };

    checkTestMode();
});