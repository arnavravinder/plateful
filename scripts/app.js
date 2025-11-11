const { createApp, ref, computed, onMounted, watch } = Vue;

const firebaseConfig = {
  apiKey: "AIzaSyBzme7aDxUAvWz1FG-8try_mVH4-ulJB50",
  authDomain: "plateful-firebase.firebaseapp.com",
  projectId: "plateful-firebase",
  storageBucket: "plateful-firebase.firebasestorage.app",
  messagingSenderId: "282607147046",
  appId: "1:282607147046:web:0f9cb2659e258393a8eee7"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const BENGALURU_CENTER = { lat: 12.9716, lng: 77.5946 };
const MAX_DISTANCE_KM = 5;

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

createApp({
  setup() {
    const currentPage = ref('home');
    const currentId = ref(null);
    const user = ref(null);
    const userLocation = ref(BENGALURU_CENTER);
    const plates = ref([]);
    const restaurants = ref([]);
    const loading = ref(true);

    const HomeView = {
      name: 'HomeView',
      props: ['plates', 'loading', 'userLocation'],
      setup(props, { emit }) {
        const vegFilter = ref('all');

        const filteredPlates = computed(() => {
          let result = props.plates;
          if (vegFilter.value === 'veg') {
            result = result.filter(p => p.veg);
          } else if (vegFilter.value === 'non-veg') {
            result = result.filter(p => !p.veg);
          }
          return result;
        });

        return { vegFilter, filteredPlates };
      },
      template: `
        <div>
          <div class="header">
            <h1 class="header__title">Plateful</h1>
            <p style="font-size: 0.875rem; color: #666; margin-top: 4px;">Surprise plates near you</p>
          </div>

          <div class="container">
            <div style="display: flex; gap: 8px; margin-bottom: 24px;">
              <button
                @click="vegFilter = 'all'"
                :class="['btn', vegFilter === 'all' ? 'btn--primary' : 'btn--secondary']"
                style="flex: 1;">
                All
              </button>
              <button
                @click="vegFilter = 'veg'"
                :class="['btn', vegFilter === 'veg' ? 'btn--primary' : 'btn--secondary']"
                style="flex: 1;">
                Veg
              </button>
              <button
                @click="vegFilter = 'non-veg'"
                :class="['btn', vegFilter === 'non-veg' ? 'btn--primary' : 'btn--secondary']"
                style="flex: 1;">
                Non-Veg
              </button>
            </div>

            <div v-if="loading" class="loading">
              <div class="loading__spinner"></div>
            </div>

            <div v-else-if="filteredPlates.length === 0" class="empty-state">
              <div class="empty-state__icon">🍽️</div>
              <h3 class="empty-state__title">No plates available</h3>
              <p class="empty-state__description">Check back soon for surprise plates near you</p>
            </div>

            <div v-else class="grid grid--2">
              <div
                v-for="plate in filteredPlates"
                :key="plate.id"
                @click="$emit('navigate', 'plate', plate.id)"
                class="card plate-card">
                <img :src="plate.photoUrl" :alt="plate.name" class="card__image">
                <div class="card__content">
                  <div class="card__header">
                    <div style="flex: 1; min-width: 0;">
                      <div class="card__title">{{plate.name}}</div>
                      <div class="card__subtitle">{{plate.restaurantName}}</div>
                    </div>
                    <div class="card__price">₹{{plate.price}}</div>
                  </div>
                  <div class="card__footer">
                    <span :class="['badge', plate.veg ? 'badge--veg' : 'badge--non-veg']">
                      {{plate.veg ? 'VEG' : 'NON-VEG'}}
                    </span>
                    <span v-if="plate.deliveryNow" class="badge badge--delivery">
                      READY IN 10 MINS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    };

    const PlateDetailView = {
      name: 'PlateDetailView',
      props: ['plateId', 'plates', 'restaurants'],
      setup(props, { emit }) {
        const plate = computed(() => props.plates.find(p => p.id === props.plateId));
        const restaurant = computed(() =>
          props.restaurants.find(r => r.id === plate.value?.restaurantId)
        );

        const handleReserve = async () => {
          if (!plate.value) return;

          const reservationCode = Math.random().toString(36).substr(2, 8).toUpperCase();
          await db.collection('reservations').add({
            userId: auth.currentUser?.uid || 'guest',
            plateId: plate.value.id,
            restaurantId: plate.value.restaurantId,
            code: reservationCode,
            status: 'active',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });

          emit('navigate', 'reserve', plate.value.id, reservationCode);
        };

        return { plate, restaurant, handleReserve };
      },
      template: `
        <div v-if="plate">
          <div class="plate-hero">
            <img :src="plate.photoUrl" :alt="plate.name" class="plate-hero__image">
            <span :class="['badge', 'plate-hero__badge', plate.veg ? 'badge--veg' : 'badge--non-veg']">
              {{plate.veg ? 'VEG' : 'NON-VEG'}}
            </span>
          </div>

          <div class="plate-detail">
            <div class="plate-detail__header">
              <h1 class="plate-detail__title">{{plate.name}}</h1>
              <div class="plate-detail__price">₹{{plate.price}}</div>
              <div class="plate-detail__badges">
                <span v-if="plate.deliveryNow" class="badge badge--delivery">
                  READY IN 10 MINS
                </span>
              </div>
            </div>

            <div v-if="restaurant" class="plate-detail__section">
              <h3 class="plate-detail__section-title">Restaurant</h3>
              <div
                @click="$emit('navigate', 'restaurant', restaurant.id)"
                class="restaurant-info"
                style="cursor: pointer;">
                <div class="restaurant-info__icon">
                  <i class="ph-fill ph-storefront" style="font-size: 24px;"></i>
                </div>
                <div class="restaurant-info__content">
                  <div class="restaurant-info__name">{{restaurant.name}}</div>
                  <div class="restaurant-info__address">{{restaurant.address}}</div>
                </div>
              </div>
            </div>

            <button @click="handleReserve" class="btn btn--primary btn--full mt-xl">
              Reserve Plate
            </button>
          </div>
        </div>
      `
    };

    const RestaurantView = {
      name: 'RestaurantView',
      props: ['restaurantId', 'restaurants', 'plates'],
      setup(props, { emit }) {
        const restaurant = computed(() =>
          props.restaurants.find(r => r.id === props.restaurantId)
        );
        const restaurantPlates = computed(() =>
          props.plates.filter(p => p.restaurantId === props.restaurantId)
        );

        return { restaurant, restaurantPlates };
      },
      template: `
        <div v-if="restaurant">
          <div class="header">
            <button @click="$emit('navigate', 'home')" class="header__back">
              <i class="ph-bold ph-caret-left" style="font-size: 24px;"></i>
            </button>
          </div>

          <div class="container">
            <h1 class="mb-sm">{{restaurant.name}}</h1>
            <p style="color: #666; margin-bottom: 32px;">{{restaurant.address}}</p>

            <h2 class="mb-md" style="font-size: 1.25rem;">Available Plates</h2>

            <div v-if="restaurantPlates.length === 0" class="empty-state">
              <div class="empty-state__icon">🍽️</div>
              <h3 class="empty-state__title">No plates available</h3>
            </div>

            <div v-else class="grid grid--2">
              <div
                v-for="plate in restaurantPlates"
                :key="plate.id"
                @click="$emit('navigate', 'plate', plate.id)"
                class="card plate-card">
                <img :src="plate.photoUrl" :alt="plate.name" class="card__image">
                <div class="card__content">
                  <div class="card__header">
                    <div class="card__title" style="flex: 1;">{{plate.name}}</div>
                    <div class="card__price">₹{{plate.price}}</div>
                  </div>
                  <div class="card__footer">
                    <span :class="['badge', plate.veg ? 'badge--veg' : 'badge--non-veg']">
                      {{plate.veg ? 'VEG' : 'NON-VEG'}}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    };

    const ReserveView = {
      name: 'ReserveView',
      props: ['plateId', 'code', 'plates', 'restaurants'],
      setup(props) {
        const plate = computed(() => props.plates.find(p => p.id === props.plateId));
        const restaurant = computed(() =>
          props.restaurants.find(r => r.id === plate.value?.restaurantId)
        );

        return { plate, restaurant };
      },
      template: `
        <div v-if="plate && restaurant" class="qr-screen">
          <h1 class="qr-screen__title">Show this to restaurant</h1>

          <div class="qr-screen__image">
            <img :src="restaurant.upiQrUrl" alt="UPI QR Code">
          </div>

          <div class="qr-screen__code">{{code}}</div>
          <p class="qr-screen__instruction">Scan the QR above to pay ₹{{plate.price}}</p>
          <p class="qr-screen__instruction" style="margin-top: 16px;">
            {{restaurant.name}}<br>
            {{restaurant.address}}
          </p>
        </div>
      `
    };

    const DashboardView = {
      name: 'DashboardView',
      setup(props, { emit }) {
        const isAuthenticated = ref(false);
        const phone = ref('');
        const verificationId = ref(null);
        const otp = ref('');
        const restaurantPlates = ref([]);
        const showModal = ref(false);
        const editingPlate = ref(null);
        const formData = ref({
          name: '',
          price: '',
          veg: true,
          deliveryNow: false,
          photoUrl: '',
          quantity: 1
        });

        const handleAuth = async () => {
          if (!phone.value) return;

          const appVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            size: 'invisible'
          });

          const confirmationResult = await auth.signInWithPhoneNumber('+91' + phone.value, appVerifier);
          verificationId.value = confirmationResult;
        };

        const verifyOtp = async () => {
          if (!verificationId.value || !otp.value) return;
          await verificationId.value.confirm(otp.value);
          isAuthenticated.value = true;
          loadPlates();
        };

        const loadPlates = async () => {
          const snapshot = await db.collection('plates')
            .where('restaurantId', '==', auth.currentUser?.uid || 'demo-restaurant-1')
            .get();
          restaurantPlates.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        };

        const openModal = (plate = null) => {
          if (plate) {
            editingPlate.value = plate;
            formData.value = { ...plate };
          } else {
            editingPlate.value = null;
            formData.value = {
              name: '',
              price: '',
              veg: true,
              deliveryNow: false,
              photoUrl: '',
              quantity: 1
            };
          }
          showModal.value = true;
        };

        const savePlate = async () => {
          const data = {
            ...formData.value,
            restaurantId: auth.currentUser?.uid || 'demo-restaurant-1',
            available: true
          };

          if (editingPlate.value) {
            await db.collection('plates').doc(editingPlate.value.id).update(data);
          } else {
            await db.collection('plates').add(data);
          }

          showModal.value = false;
          loadPlates();
        };

        const toggleAvailability = async (plate) => {
          await db.collection('plates').doc(plate.id).update({
            available: !plate.available
          });
          loadPlates();
        };

        onMounted(() => {
          auth.onAuthStateChanged(user => {
            if (user) {
              isAuthenticated.value = true;
              loadPlates();
            }
          });
        });

        return {
          isAuthenticated,
          phone,
          otp,
          handleAuth,
          verifyOtp,
          restaurantPlates,
          showModal,
          formData,
          openModal,
          savePlate,
          toggleAvailability
        };
      },
      template: `
        <div>
          <div v-if="!isAuthenticated" class="auth-screen">
            <h1 class="auth-screen__logo">Plateful</h1>
            <p class="auth-screen__tagline">Restaurant Dashboard</p>

            <div class="auth-screen__form">
              <div class="form-group">
                <label class="form-group__label">Phone Number</label>
                <input
                  v-model="phone"
                  type="tel"
                  placeholder="9876543210"
                  class="input">
              </div>

              <div v-if="!verificationId" id="sign-in-button">
                <button @click="handleAuth" class="btn btn--primary btn--full">
                  Send OTP
                </button>
              </div>

              <div v-else class="form-group">
                <label class="form-group__label">Enter OTP</label>
                <input
                  v-model="otp"
                  type="text"
                  placeholder="123456"
                  class="input">
                <button @click="verifyOtp" class="btn btn--primary btn--full mt-md">
                  Verify
                </button>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="dashboard-header">
              <h1 class="dashboard-header__title">Dashboard</h1>
              <p class="dashboard-header__subtitle">Manage your plates</p>
            </div>

            <div class="dashboard-section">
              <button @click="openModal()" class="btn btn--primary btn--full mb-lg">
                <i class="ph-bold ph-plus"></i> Add New Plate
              </button>

              <div v-if="restaurantPlates.length === 0" class="empty-state">
                <div class="empty-state__icon">🍽️</div>
                <h3 class="empty-state__title">No plates yet</h3>
                <p class="empty-state__description">Add your first surprise plate</p>
              </div>

              <div v-else>
                <div v-for="plate in restaurantPlates" :key="plate.id" class="list-item">
                  <img :src="plate.photoUrl" :alt="plate.name" class="list-item__image">
                  <div class="list-item__content">
                    <div class="list-item__title">{{plate.name}}</div>
                    <div class="list-item__subtitle">₹{{plate.price}} • {{plate.veg ? 'Veg' : 'Non-Veg'}}</div>
                  </div>
                  <div class="list-item__actions">
                    <button @click="openModal(plate)" class="icon-btn">
                      <i class="ph-bold ph-pencil-simple"></i>
                    </button>
                    <button @click="toggleAvailability(plate)" class="icon-btn">
                      <i :class="['ph-bold', plate.available ? 'ph-eye' : 'ph-eye-slash']"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="showModal" class="modal" @click.self="showModal = false">
              <div class="modal__content">
                <div class="modal__header">
                  <h2 class="modal__title">{{editingPlate ? 'Edit' : 'Add'}} Plate</h2>
                  <button @click="showModal = false" class="modal__close">
                    <i class="ph-bold ph-x" style="font-size: 24px;"></i>
                  </button>
                </div>

                <div class="form-group">
                  <label class="form-group__label">Plate Name</label>
                  <input v-model="formData.name" type="text" class="input">
                </div>

                <div class="form-group">
                  <label class="form-group__label">Price</label>
                  <input v-model="formData.price" type="number" class="input">
                </div>

                <div class="form-group">
                  <label class="form-group__label">Photo URL</label>
                  <input v-model="formData.photoUrl" type="url" class="input">
                </div>

                <div class="form-group">
                  <label class="toggle">
                    <input type="checkbox" v-model="formData.veg" style="display: none;">
                    <div :class="['toggle__switch', formData.veg && 'toggle__switch--active']">
                      <div class="toggle__slider"></div>
                    </div>
                    <span class="toggle__label">Vegetarian</span>
                  </label>
                </div>

                <div class="form-group">
                  <label class="toggle">
                    <input type="checkbox" v-model="formData.deliveryNow" style="display: none;">
                    <div :class="['toggle__switch', formData.deliveryNow && 'toggle__switch--active']">
                      <div class="toggle__slider"></div>
                    </div>
                    <span class="toggle__label">Ready in 10 mins</span>
                  </label>
                </div>

                <button @click="savePlate" class="btn btn--primary btn--full mt-lg">
                  Save Plate
                </button>
              </div>
            </div>
          </div>
        </div>
      `
    };

    const AdminView = {
      name: 'AdminView',
      setup() {
        const allRestaurants = ref([]);
        const allPlates = ref([]);
        const stats = ref({ restaurants: 0, plates: 0, reservations: 0 });

        const loadData = async () => {
          const restaurantsSnapshot = await db.collection('restaurants').get();
          allRestaurants.value = restaurantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          const platesSnapshot = await db.collection('plates').get();
          allPlates.value = platesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          const reservationsSnapshot = await db.collection('reservations').get();

          stats.value = {
            restaurants: allRestaurants.value.length,
            plates: allPlates.value.length,
            reservations: reservationsSnapshot.size
          };
        };

        const approveRestaurant = async (id) => {
          await db.collection('restaurants').doc(id).update({ approved: true });
          loadData();
        };

        const rejectRestaurant = async (id) => {
          await db.collection('restaurants').doc(id).update({ approved: false });
          loadData();
        };

        onMounted(loadData);

        return { allRestaurants, stats, approveRestaurant, rejectRestaurant };
      },
      template: `
        <div>
          <div class="dashboard-header">
            <h1 class="dashboard-header__title">Admin Panel</h1>
            <p class="dashboard-header__subtitle">System overview</p>
          </div>

          <div class="dashboard-section">
            <div class="grid grid--2" style="margin-bottom: 32px;">
              <div class="card">
                <div class="card__content">
                  <h3 style="font-size: 2rem; margin-bottom: 4px;">{{stats.restaurants}}</h3>
                  <p style="color: #666;">Restaurants</p>
                </div>
              </div>
              <div class="card">
                <div class="card__content">
                  <h3 style="font-size: 2rem; margin-bottom: 4px;">{{stats.plates}}</h3>
                  <p style="color: #666;">Plates</p>
                </div>
              </div>
              <div class="card">
                <div class="card__content">
                  <h3 style="font-size: 2rem; margin-bottom: 4px;">{{stats.reservations}}</h3>
                  <p style="color: #666;">Reservations</p>
                </div>
              </div>
            </div>

            <h2 class="mb-md" style="font-size: 1.25rem;">Restaurants</h2>
            <div v-for="restaurant in allRestaurants" :key="restaurant.id" class="list-item">
              <div class="list-item__content">
                <div class="list-item__title">{{restaurant.name}}</div>
                <div class="list-item__subtitle">{{restaurant.address}}</div>
              </div>
              <div class="list-item__actions">
                <button
                  v-if="!restaurant.approved"
                  @click="approveRestaurant(restaurant.id)"
                  class="btn btn--primary"
                  style="padding: 8px 16px; font-size: 0.875rem;">
                  Approve
                </button>
                <span v-else class="badge badge--veg">Approved</span>
              </div>
            </div>
          </div>
        </div>
      `
    };

    const navigate = (page, id = null, extra = null) => {
      currentPage.value = page;
      currentId.value = id;
      if (extra) {
        window.reservationCode = extra;
      }
      window.scrollTo(0, 0);
    };

    const loadData = async () => {
      loading.value = true;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            userLocation.value = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          },
          () => {
            userLocation.value = BENGALURU_CENTER;
          }
        );
      }

      const restaurantsSnapshot = await db.collection('restaurants')
        .where('approved', '==', true)
        .get();
      restaurants.value = restaurantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const platesSnapshot = await db.collection('plates')
        .where('available', '==', true)
        .get();

      const allPlates = platesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      plates.value = allPlates
        .map(plate => {
          const restaurant = restaurants.value.find(r => r.id === plate.restaurantId);
          if (!restaurant) return null;

          const distance = getDistance(
            userLocation.value.lat,
            userLocation.value.lng,
            restaurant.lat,
            restaurant.lng
          );

          if (distance > MAX_DISTANCE_KM) return null;

          return {
            ...plate,
            restaurantName: restaurant.name,
            distance
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance);

      loading.value = false;
    };

    onMounted(loadData);

    return {
      currentPage,
      currentId,
      plates,
      restaurants,
      loading,
      userLocation,
      navigate,
      HomeView,
      PlateDetailView,
      RestaurantView,
      ReserveView,
      DashboardView,
      AdminView
    };
  },
  template: `
    <div>
      <component
        :is="HomeView"
        v-if="currentPage === 'home'"
        :plates="plates"
        :loading="loading"
        :userLocation="userLocation"
        @navigate="navigate"
      />
      <component
        :is="PlateDetailView"
        v-else-if="currentPage === 'plate'"
        :plateId="currentId"
        :plates="plates"
        :restaurants="restaurants"
        @navigate="navigate"
      />
      <component
        :is="RestaurantView"
        v-else-if="currentPage === 'restaurant'"
        :restaurantId="currentId"
        :restaurants="restaurants"
        :plates="plates"
        @navigate="navigate"
      />
      <component
        :is="ReserveView"
        v-else-if="currentPage === 'reserve'"
        :plateId="currentId"
        :code="$root.reservationCode || 'XXXXX'"
        :plates="plates"
        :restaurants="restaurants"
      />
      <component
        :is="DashboardView"
        v-else-if="currentPage === 'dashboard'"
        @navigate="navigate"
      />
      <component
        :is="AdminView"
        v-else-if="currentPage === 'admin'"
      />
    </div>
  `
}).mount('#app');

const hash = window.location.hash.slice(1);
if (hash.startsWith('/dashboard')) {
  document.querySelector('#app').__vueParentComponent.ctx.currentPage = 'dashboard';
} else if (hash.startsWith('/admin')) {
  document.querySelector('#app').__vueParentComponent.ctx.currentPage = 'admin';
}
