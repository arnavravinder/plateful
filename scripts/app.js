const { createApp } = Vue;

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

const vueApp = createApp({
    data() {
        return {
            mobileMenuOpen: false,
            userDropdownOpen: false,
            isLoggedIn: false,
            currentUser: null,
            loginModalOpen: false,
            showOtpInput: false,
            otpCode: '',
            loginError: '',
            phoneInput: null,
            recaptchaVerifier: null,
            confirmationResult: null,
            features: [
                { id: 1, icon: 'fas fa-map-marked-alt', title: 'Interactive Map', description: 'Find surplus food near you in real-time with our intuitive location-based discovery system.' },
                { id: 2, icon: 'fas fa-leaf', title: 'Sustainable Impact', description: 'Every meal saves 3.5kg CO2 emissions, contributing to a greener planet and sustainable future.' },
                { id: 3, icon: 'fas fa-shield-alt', title: 'Direct UPI Payments', description: 'Secure payments go directly to restaurants via UPI. Zero platform fees until Jan 2026 - we believe in supporting local businesses.' },
                { id: 4, icon: 'fas fa-chart-line', title: 'Live Updates', description: 'Restaurant dashboards with real-time order analytics and comprehensive impact reporting.' }
            ],
            steps: [
                { id: 1, title: 'Restaurants List Surplus', description: 'Partner restaurants upload available surplus meals with photos, descriptions, and pickup times through our easy-to-use dashboard.' },
                { id: 2, title: 'Users Browse & Order', description: 'Community members discover nearby surplus food through our platform, place orders, and make secure payments via UPI integration.' },
                { id: 3, title: 'Community Impact Dashboard', description: 'Track collective impact with real-time metrics showing meals saved, CO2 emissions reduced, and community members fed.' }
            ],
            scrollListenersAdded: {
                hero: false,
                features: false,
                howItWorks: false,
                heroInstance: null,
                featuresInstance: null,
                howItWorksInstance: null
            },
            heroTextAnimated: false
        };
    },
    mounted() {
        const htmlEl = document.documentElement;
        const pageLoader = document.getElementById('page-loader');
        const mainContent = document.getElementById('app');
        const loaderVideo = document.getElementById('loader-video');

        htmlEl.classList.add('loading-active');
        if (window.location.hash) {
            window.history.replaceState(null, null, window.location.pathname + window.location.search);
        }
        if (window.platefulLenis) {
            window.platefulLenis.stop();
        }

        if (loaderVideo) {
            loaderVideo.playbackRate = 1.5;
        }

        if (mainContent) mainContent.classList.remove('visible');

        const loadingDuration = 2500;

        setTimeout(() => {
            if (pageLoader) {
                pageLoader.classList.add('hidden');
            }
            if (mainContent) {
                mainContent.classList.add('visible');
            }
            htmlEl.classList.remove('loading-active');
            if (window.platefulLenis) {
                window.platefulLenis.start();
                window.platefulLenis.scrollTo(0, {immediate: true, force: true});
            }

            // Applying your requested timing values
            const mainContentCssDelay = 300;
            const mainContentCssDuration = 420;
            const heroWordsBuffer = 0;
            const heroWordsAnimationDelay = mainContentCssDelay + mainContentCssDuration + heroWordsBuffer;

            setTimeout(() => {
                this.animateHeroWords();
            }, heroWordsAnimationDelay);

            this.initializeScrollRevealAnimations();
            this.initializeCustomScrollEffects();
        }, loadingDuration);

        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        this.setupLenisAnchors();

        this.checkAuthState();
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.isLoggedIn = true;
                this.currentUser = {
                    uid: user.uid,
                    displayName: user.displayName || 'User',
                    email: user.email,
                    photoURL: user.photoURL
                };
                localStorage.setItem('platefulUser', JSON.stringify(this.currentUser));
            } else {
                this.isLoggedIn = false;
                this.currentUser = null;
                localStorage.removeItem('platefulUser');
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-dropdown')) {
                this.userDropdownOpen = false;
            }
        });
    },
    methods: {
        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
        },
        closeMobileMenu() {
            this.mobileMenuOpen = false;
        },
        closeMobileMenuAndScroll(targetSelector) {
            this.closeMobileMenu();
            const targetElement = document.querySelector(targetSelector);
            if (window.platefulLenis && targetElement) {
                window.platefulLenis.scrollTo(targetElement, { offset: -80, duration: 1.2 });
            } else if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        },
        toggleUserDropdown() {
            this.userDropdownOpen = !this.userDropdownOpen;
        },
        handleLoginClick() {
            this.openLoginModal();
        },
        openLoginModal() {
            this.loginModalOpen = true; 
            this.loginError = '';
            this.showOtpInput = false;
            this.otpCode = '';

            if (window.platefulLenis) {
                window.platefulLenis.stop();
            }
            
            // Using $nextTick to ensure the modal is in the DOM before we try to access its elements
            this.$nextTick(() => {
                const phoneInputField = document.querySelector("#modal-phone");
                if (phoneInputField) {
                    this.phoneInput = window.intlTelInput(phoneInputField, {
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
                    }, 50);
                }
            });
        },
        closeLoginModal() {
            this.loginModalOpen = false;

            if (window.platefulLenis) {
                window.platefulLenis.start();
            }
            if (this.phoneInput) {
                this.phoneInput.destroy();
                this.phoneInput = null;
            }
            if (this.recaptchaVerifier) {
                this.recaptchaVerifier.clear();
                this.recaptchaVerifier = null;
            }
        },
        async signInWithGoogle() {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                const result = await auth.signInWithPopup(provider);
                this.handleAuthSuccess(result.user);
            } catch (error) {
                if (error.code === 'auth/popup-closed-by-user') {
                    return;
                }
                this.loginError = 'Unable to sign in. Please try again.';
            }
        },
        async signInWithTwitter() {
            try {
                const provider = new firebase.auth.TwitterAuthProvider();
                const result = await auth.signInWithPopup(provider);
                this.handleAuthSuccess(result.user);
            } catch (error) {
                console.error("X/Twitter Sign-In Error:", error);
                if (error.code === 'auth/popup-closed-by-user') {
                    return;
                }
                this.loginError = `X sign-in failed: ${error.message}. This may be a temporary issue with the service. Please try another method.`;
            }
        },
        setupRecaptcha() {
            if (!this.recaptchaVerifier) {
                this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('modal-recaptcha', {
                    'size': 'invisible',
                    'callback': (response) => {},
                    'expired-callback': () => {
                        this.loginError = 'reCAPTCHA expired. Please try again.';
                    }
                });
                this.recaptchaVerifier.render();
            }
        },
        async sendOtp() {
            this.loginError = '';
            if (!this.phoneInput || !this.phoneInput.isValidNumber()) {
                this.loginError = 'Please enter a valid phone number.';
                return;
            }
            
            const phoneNumber = this.phoneInput.getNumber();
            this.setupRecaptcha();
            
            try {
                this.confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier);
                this.showOtpInput = true;
            } catch (error) {
                if (error.code === 'auth/billing-not-enabled') {
                    this.loginError = 'Phone authentication requires Firebase billing. Please use Google or Twitter sign-in for now.';
                } else if (error.code === 'auth/invalid-phone-number') {
                    this.loginError = 'Invalid phone number. Please check and try again.';
                } else if (error.code === 'auth/too-many-requests') {
                    this.loginError = 'Too many attempts. Please try again later.';
                } else {
                    console.error('Phone Auth Error:', error);
                    this.loginError = 'Unable to send verification code. Please try another sign-in method.';
                }
                if (this.recaptchaVerifier) {
                    this.recaptchaVerifier.clear();
                    this.recaptchaVerifier = null;
                }
            }
        },
        async verifyOtp() {
            if (!this.otpCode || this.otpCode.length < 6) {
                this.loginError = 'Please enter the 6-digit code.';
                return;
            }
            
            try {
                const result = await this.confirmationResult.confirm(this.otpCode);
                this.handleAuthSuccess(result.user);
            } catch (error) {
                this.loginError = 'Invalid code. Please try again.';
            }
        },
        async handleAuthSuccess(user) {
            try {
                if (firebase.firestore) {
                    const userRef = firebase.firestore().collection('users').doc(user.uid);
                    const doc = await userRef.get();
                    
                    if (!doc.exists) {
                        window.location.href = 'onboarding.html';
                        return;
                    }
                }
            } catch (error) {
                console.log('Firestore check skipped');
            }
            
            this.closeLoginModal();
        },
        checkAuthState() {
            const savedUser = localStorage.getItem('platefulUser');
            if (savedUser) {
                try {
                    const user = JSON.parse(savedUser);
                    this.isLoggedIn = true;
                    this.currentUser = user;
                } catch (error) {
                    console.error('Error parsing saved user:', error);
                }
            }
        },
        async logout() {
            try {
                await auth.signOut();
                this.isLoggedIn = false;
                this.currentUser = null;
                localStorage.removeItem('platefulUser');
                this.userDropdownOpen = false;
                this.closeMobileMenu();
            } catch (error) {
                console.error('Logout error:', error);
            }
        },
        handleResize() {
            if (window.innerWidth > 768) {
                this.mobileMenuOpen = false;
            }
            this.initializeCustomScrollEffects();
        },
        setupLenisAnchors() {
            if (!window.platefulLenis) return;
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId && targetId !== '#') {
                        e.preventDefault();
                        if (this.mobileMenuOpen) {
                            this.closeMobileMenu();
                        }
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            window.platefulLenis.scrollTo(targetElement, { offset: -80, duration: 1.2 });
                        }
                    }
                });
            });
        },
        initializeCustomScrollEffects() {
            if (!window.platefulLenis) return;

            const isMobile = window.innerWidth <= 768;

            if (this.scrollListenersAdded.heroInstance) {
                window.platefulLenis.off('scroll', this.scrollListenersAdded.heroInstance);
                this.scrollListenersAdded.heroInstance = null;
            }
            if (this.scrollListenersAdded.featuresInstance) {
                window.platefulLenis.off('scroll', this.scrollListenersAdded.featuresInstance);
                this.scrollListenersAdded.featuresInstance = null;
            }
            if (this.scrollListenersAdded.howItWorksInstance) {
                window.platefulLenis.off('scroll', this.scrollListenersAdded.howItWorksInstance);
                this.scrollListenersAdded.howItWorksInstance = null;
            }
            this.scrollListenersAdded.hero = false;
            this.scrollListenersAdded.features = false;
            this.scrollListenersAdded.howItWorks = false;

            if (isMobile) {
                 document.querySelectorAll('.features-grid-horizontal .feature-card').forEach(el => {
                    el.classList.add('is-active-scroll');
                 });
                 document.querySelectorAll('.features-grid-horizontal').forEach(el => {
                    if(el) el.style.transform = 'translateX(0px)';
                 });
                return;
            }

            const heroSection = document.querySelector('.hero');
            if (heroSection && !this.scrollListenersAdded.hero) {
                const heroGraphic = heroSection.querySelector('.hero-graphic');
                if (heroGraphic) {
                    const heroScrollHandler = (e) => {
                        const hRect = heroSection.getBoundingClientRect();
                        if (hRect.bottom > 0 && hRect.top < window.innerHeight) {
                            const progress = Math.max(0, Math.min(1, -hRect.top / (hRect.height > window.innerHeight ? hRect.height - window.innerHeight : window.innerHeight)));
                            const parallaxOffset = progress * -80;
                            heroGraphic.style.transform = `translateY(${parallaxOffset}px)`;
                        } else if (hRect.bottom <= 0 && heroGraphic.style.transform !== 'translateY(-80px)') {
                             heroGraphic.style.transform = `translateY(-80px)`;
                        } else if (hRect.top >= window.innerHeight && heroGraphic.style.transform !== 'translateY(0px)'){
                             heroGraphic.style.transform = `translateY(0px)`;
                        }
                    };
                    window.platefulLenis.on('scroll', heroScrollHandler);
                    this.scrollListenersAdded.heroInstance = heroScrollHandler;
                    this.scrollListenersAdded.hero = true;
                }
            }

            const featuresStickyContainer = document.querySelector('#features');
            const featuresGrid = document.querySelector('.features-grid-horizontal');
            if (featuresStickyContainer && featuresGrid && !this.scrollListenersAdded.features) {
                const featureCards = Array.from(featuresGrid.children);
                const numFeatureCards = featureCards.length;
                if (numFeatureCards > 0) {
                    const featureCardWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--feature-card-width'));
                    const featureCardGap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--feature-card-gap'));
                    const featuresGridPadding = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--features-grid-padding'));
                    
                    const totalFeaturesGridWidth = (numFeatureCards * featureCardWidth) + ((numFeatureCards - 1) * featureCardGap) + (2 * featuresGridPadding);
                    featuresStickyContainer.style.height = `${100 + (numFeatureCards * 75)}vh`;

                    const viewportWidth = window.innerWidth;
                    const initialGridX = (viewportWidth / 2) - (featureCardWidth / 2) - featuresGridPadding;
                    const finalGridX = (viewportWidth / 2) - (totalFeaturesGridWidth - featuresGridPadding - (featureCardWidth / 2));
                    const scrollDistance = initialGridX - finalGridX;

                    featuresGrid.style.transform = `translateX(${initialGridX}px)`;
                    if (featureCards[0]) featureCards[0].classList.add('is-active-scroll');

                    const featuresScrollHandler = (e) => {
                        const rect = featuresStickyContainer.getBoundingClientRect();
                        let progress = 0;
                        if (rect.height > window.innerHeight) {
                             progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
                        }

                        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                            const currentTranslateX = initialGridX - (progress * scrollDistance);
                            featuresGrid.style.transform = `translateX(${currentTranslateX}px)`;

                            featureCards.forEach((card) => {
                                const cardCenter = card.getBoundingClientRect().left + card.offsetWidth / 2;
                                const screenCenter = viewportWidth / 2;
                                const distance = Math.abs(cardCenter - screenCenter);
                                if (distance < card.offsetWidth / 2 + 30) {
                                    card.classList.add('is-active-scroll');
                                } else {
                                    card.classList.remove('is-active-scroll');
                                }
                            });
                        } else if (rect.top > 0) {
                            featuresGrid.style.transform = `translateX(${initialGridX}px)`;
                             if(featureCards.length > 0) {
                                featureCards[0].classList.add('is-active-scroll');
                                featureCards.slice(1).forEach(c => c.classList.remove('is-active-scroll'));
                             }
                        } else if (rect.bottom < window.innerHeight) {
                            featuresGrid.style.transform = `translateX(${finalGridX}px)`;
                            if(featureCards.length > 0) {
                                featureCards[numFeatureCards-1].classList.add('is-active-scroll');
                                featureCards.slice(0, -1).forEach(c => c.classList.remove('is-active-scroll'));
                            }
                        }
                    };
                    window.platefulLenis.on('scroll', featuresScrollHandler);
                    this.scrollListenersAdded.featuresInstance = featuresScrollHandler;
                    this.scrollListenersAdded.features = true;
                }
            }

            const howItWorksStickyContainer = document.querySelector('#how-it-works');
            const stepsContainer = document.querySelector('.steps-container-horizontal');
            if (howItWorksStickyContainer && stepsContainer && !this.scrollListenersAdded.howItWorks) {
                const stepCards = Array.from(stepsContainer.children);
                const numStepCards = stepCards.length;
                if (numStepCards === 0) return;
                
                howItWorksStickyContainer.style.height = `${100 + numStepCards * 185}vh`;

                const STACK_X_PER_LEVEL = -12; 
                const STACK_Y_PER_LEVEL = -8;  
                const SCALE_DOWN_PER_LEVEL = 0.04;
                const OPACITY_DOWN_PER_LEVEL = 0.20; 
                const MAX_STACK_VISIBLE = 3; 
                const ACTIVE_CARD_Z_INDEX = numStepCards + 5;

                const howItWorksScrollHandler = (e) => {
                    const rect = howItWorksStickyContainer.getBoundingClientRect();
                    const scrollableHeight = rect.height - window.innerHeight;
                    if (scrollableHeight <= 0) return;

                    const progress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
                    
                    let currentGlobalCardValue;
                    if (numStepCards <= 1) {
                        currentGlobalCardValue = 0;
                    } else {
                        const singleCardEquivalentProgress = 1 / (numStepCards -1 + 0.35); 
                        const dwellAbsoluteProgress = singleCardEquivalentProgress * 0.35;

                        if (progress < dwellAbsoluteProgress) { 
                            currentGlobalCardValue = 0; 
                        } else {
                            const progressAfterDwell = progress - dwellAbsoluteProgress;
                            const remainingProgressRange = 1 - dwellAbsoluteProgress;
                            if (remainingProgressRange <= 0) { 
                                 currentGlobalCardValue = numStepCards -1;
                            } else {
                                 currentGlobalCardValue = (progressAfterDwell / remainingProgressRange) * (numStepCards - 1);
                            }
                        }
                    }
                    currentGlobalCardValue = Math.max(0, Math.min(currentGlobalCardValue, numStepCards - 1));

                    stepCards.forEach((card, i) => {
                        const distanceToCurrentFloat = i - currentGlobalCardValue;

                        let tx = distanceToCurrentFloat * STACK_X_PER_LEVEL;
                        let ty = distanceToCurrentFloat * STACK_Y_PER_LEVEL;
                        let scale = 1.0 - Math.abs(distanceToCurrentFloat) * SCALE_DOWN_PER_LEVEL;
                        let opacity = 1.0 - Math.abs(distanceToCurrentFloat) * OPACITY_DOWN_PER_LEVEL;
                        let zIndex = ACTIVE_CARD_Z_INDEX - Math.ceil(Math.abs(distanceToCurrentFloat));
                        
                        if (Math.abs(distanceToCurrentFloat) < 0.5) { 
                            const activeFactor = 1 - (Math.abs(distanceToCurrentFloat) / 0.5); 
                            tx = distanceToCurrentFloat * STACK_X_PER_LEVEL * (1 - activeFactor) * 0.3; 
                            ty = distanceToCurrentFloat * STACK_Y_PER_LEVEL * (1 - activeFactor) * 0.3;
                            scale = 1.0 - (Math.abs(distanceToCurrentFloat) * SCALE_DOWN_PER_LEVEL * (1-activeFactor));
                            opacity = 1.0;
                            zIndex = ACTIVE_CARD_Z_INDEX + 1; 
                        }
                        
                        if (Math.abs(distanceToCurrentFloat) > MAX_STACK_VISIBLE + 0.5) {
                            opacity = 0;
                        }
                        
                        opacity = Math.max(0, Math.min(1, opacity));
                        scale = Math.max(0.3, Math.min(1, scale)); 
                        zIndex = Math.max(1, zIndex);

                        card.style.transform = `translate(-50%, -50%) translateX(${tx}px) translateY(${ty}px) scale(${scale}) rotateY(0deg)`;
                        card.style.opacity = opacity;
                        card.style.zIndex = zIndex;
                    });
                };
                window.platefulLenis.on('scroll', howItWorksScrollHandler);
                this.scrollListenersAdded.howItWorksInstance = howItWorksScrollHandler;
                this.scrollListenersAdded.howItWorks = true;
            }
        },
        initializeScrollRevealAnimations() {
            if (!('IntersectionObserver' in window) ) {
                document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
                    el.classList.add('is-visible');
                });
                return;
            }
            const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
                observer.observe(el);
            });
        },
        animateHeroWords() {
            if (this.heroTextAnimated) return;

            const words = document.querySelectorAll('.scroll-reveal-word');
            const baseDelay = 50;

            document.querySelectorAll('.hero-line-1 .scroll-reveal-word').forEach((word, index) => {
                word.style.transitionDelay = `${baseDelay + index * 150}ms`;
            });
            document.querySelectorAll('.hero-line-2 .scroll-reveal-word').forEach((word, index) => {
                word.style.transitionDelay = `${baseDelay + (document.querySelectorAll('.hero-line-1 .scroll-reveal-word').length * 100) + index * 150}ms`;
            });

            words.forEach((word) => {
                word.style.opacity = '1';
                word.style.transform = 'translateY(0) rotateX(0deg) skewY(0deg)';
            });
            this.heroTextAnimated = true;
        }
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
        if (window.platefulLenis) {
            window.platefulLenis.destroy();
        }
        if (this.scrollListenersAdded.heroInstance) {
            window.platefulLenis.off('scroll', this.scrollListenersAdded.heroInstance);
        }
        if (this.scrollListenersAdded.featuresInstance) {
            window.platefulLenis.off('scroll', this.scrollListenersAdded.featuresInstance);
        }
        if (this.scrollListenersAdded.howItWorksInstance) {
            window.platefulLenis.off('scroll', this.scrollListenersAdded.howItWorksInstance);
        }
    }
}).mount('#app');