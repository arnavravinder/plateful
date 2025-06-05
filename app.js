const { createApp } = Vue;

const vueApp = createApp({
  data() {
    return {
      mobileMenuOpen: false,
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
          problemSolution: false,
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
      
      const mainContentCssDelay = 300; 
      const mainContentCssDuration = 800;
      const heroWordsBuffer = 1000; 
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
    handleResize() {
      if (window.innerWidth > 768) {
        this.mobileMenuOpen = false;
      }
      this.initializeCustomScrollEffects();
    },
    setupLenisAnchors() {
        if (!window.platefulLenis) return;
        const vueInstance = this;
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (vueInstance.mobileMenuOpen && !this.classList.contains('login-link')) {
                vueInstance.closeMobileMenu();
            }
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.platefulLenis.scrollTo(targetElement, { offset: -80, duration: 1.2 });
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
        this.scrollListenersAdded.problemSolution = false;


        const problemSolutionSection = document.querySelector('#about.problem-solution');
        if (problemSolutionSection && !this.scrollListenersAdded.problemSolution && !isMobile) {
            if ('IntersectionObserver' in window) {
                const problemObserver = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            obs.unobserve(entry.target); 
                        }
                    });
                }, { threshold: 0.25 });
                problemObserver.observe(problemSolutionSection);
                this.scrollListenersAdded.problemSolution = true;
            }
        } else if (problemSolutionSection && isMobile) {
             problemSolutionSection.classList.remove('is-visible');
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

                if (!isMobile) {
                    featuresStickyContainer.style.height = `${100 + (numFeatureCards * 75)}vh`;
                } else {
                    featuresStickyContainer.style.height = 'auto';
                }


                const featuresScrollHandler = (e) => {
                    if (isMobile) {
                        featuresGrid.style.transform = `translateX(0px)`;
                        featureCards.forEach(c => c.classList.add('is-active-scroll'));
                        return;
                    }
                    const viewportWidth = window.innerWidth;
                    const initialGridX = (viewportWidth / 2) - (featureCardWidth / 2) - featuresGridPadding;
                    const finalGridX = (viewportWidth / 2) - (totalFeaturesGridWidth - featuresGridPadding - (featureCardWidth / 2));
                    const scrollDistance = initialGridX - finalGridX;

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
                if(isMobile) featuresScrollHandler();
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
            
            if(!isMobile){
                howItWorksStickyContainer.style.height = `${100 + numStepCards * 185}vh`;
            } else {
                 howItWorksStickyContainer.style.height = 'auto';
            }


            const STACK_X_PER_LEVEL = -12; 
            const STACK_Y_PER_LEVEL = -8;  
            const SCALE_DOWN_PER_LEVEL = 0.04;
            const OPACITY_DOWN_PER_LEVEL = 0.20; 
            const MAX_STACK_VISIBLE = 3; 
            const ACTIVE_CARD_Z_INDEX = numStepCards + 5;


            const howItWorksScrollHandler = (e) => {
                if(isMobile) {
                    stepCards.forEach(card => {
                        card.style.opacity = 1;
                        card.style.transform = 'translate(-50%, -50%) translateX(0px) translateY(0px) scale(1) rotateY(0deg)';
                        card.style.position = 'relative';
                        card.style.top = 'auto';
                        card.style.left = 'auto';
                        card.style.marginBottom = '1.5rem';
                    });
                    if(stepsContainer.parentElement) stepsContainer.parentElement.style.height = 'auto';
                    return;
                }

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
                    card.style.position = 'absolute';
                    card.style.top = '50%';
                    card.style.left = '50%';
                    card.style.marginBottom = '0';

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
                 if(stepsContainer.parentElement) stepsContainer.parentElement.style.height = getComputedStyle(document.documentElement).getPropertyValue('--step-card-height');
            };
            window.platefulLenis.on('scroll', howItWorksScrollHandler);
            if(isMobile) howItWorksScrollHandler();
            this.scrollListenersAdded.howItWorksInstance = howItWorksScrollHandler;
            this.scrollListenersAdded.howItWorks = true;
        }
    },
    initializeScrollRevealAnimations() {
      const isMobile = window.innerWidth <= 768;
      if (!('IntersectionObserver' in window) || isMobile ) { 
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