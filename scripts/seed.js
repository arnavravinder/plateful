const seedData = {
  restaurants: [
    {
      id: 'rest-1',
      name: 'Truffles',
      address: '75, 5th Block, Koramangala, Bengaluru',
      lat: 12.9352,
      lng: 77.6245,
      phone: '+919876543210',
      upiQrUrl: 'https://via.placeholder.com/400x400/4ADE80/ffffff?text=Truffles+UPI',
      approved: true,
      veg: false
    },
    {
      id: 'rest-2',
      name: 'Vidyarthi Bhavan',
      address: 'Gandhi Bazaar, Basavanagudi, Bengaluru',
      lat: 12.9423,
      lng: 77.5742,
      phone: '+919876543211',
      upiQrUrl: 'https://via.placeholder.com/400x400/4ADE80/ffffff?text=Vidyarthi+Bhavan+UPI',
      approved: true,
      veg: true
    },
    {
      id: 'rest-3',
      name: 'Koshy\'s',
      address: '39, St Marks Road, Bengaluru',
      lat: 12.9759,
      lng: 77.6032,
      phone: '+919876543212',
      upiQrUrl: 'https://via.placeholder.com/400x400/4ADE80/ffffff?text=Koshys+UPI',
      approved: true,
      veg: false
    },
    {
      id: 'rest-4',
      name: 'CTR',
      address: 'Malleswaram, Bengaluru',
      lat: 13.0067,
      lng: 77.5697,
      phone: '+919876543213',
      upiQrUrl: 'https://via.placeholder.com/400x400/4ADE80/ffffff?text=CTR+UPI',
      approved: true,
      veg: true
    },
    {
      id: 'rest-5',
      name: 'Toit',
      address: '298, 100 Feet Road, Indiranagar, Bengaluru',
      lat: 12.9716,
      lng: 77.6412,
      phone: '+919876543214',
      upiQrUrl: 'https://via.placeholder.com/400x400/4ADE80/ffffff?text=Toit+UPI',
      approved: true,
      veg: false
    },
    {
      id: 'rest-6',
      name: 'MTR',
      address: 'Lalbagh Road, Bengaluru',
      lat: 12.9539,
      lng: 77.5850,
      phone: '+919876543215',
      upiQrUrl: 'https://via.placeholder.com/400x400/4ADE80/ffffff?text=MTR+UPI',
      approved: true,
      veg: true
    },
    {
      id: 'rest-7',
      name: 'The Fatty Bao',
      address: '4th Block, Koramangala, Bengaluru',
      lat: 12.9352,
      lng: 77.6191,
      phone: '+919876543216',
      upiQrUrl: 'https://via.placeholder.com/400x400/4ADE80/ffffff?text=Fatty+Bao+UPI',
      approved: true,
      veg: false
    },
    {
      id: 'rest-8',
      name: 'Brahmin\'s Coffee Bar',
      address: 'Basavanagudi, Bengaluru',
      lat: 12.9423,
      lng: 77.5742,
      phone: '+919876543217',
      upiQrUrl: 'https://via.placeholder.com/400x400/4ADE80/ffffff?text=Brahmins+UPI',
      approved: true,
      veg: true
    }
  ],
  plates: [
    {
      restaurantId: 'rest-1',
      name: 'Surprise Burger Box',
      price: 149,
      photoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
      veg: false,
      deliveryNow: true,
      available: true,
      quantity: 5
    },
    {
      restaurantId: 'rest-1',
      name: 'Mystery Pasta Plate',
      price: 199,
      photoUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop',
      veg: false,
      deliveryNow: false,
      available: true,
      quantity: 3
    },
    {
      restaurantId: 'rest-2',
      name: 'Classic Masala Dosa',
      price: 89,
      photoUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=400&fit=crop',
      veg: true,
      deliveryNow: true,
      available: true,
      quantity: 10
    },
    {
      restaurantId: 'rest-2',
      name: 'Filter Coffee & Vada',
      price: 69,
      photoUrl: 'https://images.unsplash.com/photo-1571168314030-6e7c4db97de9?w=400&h=400&fit=crop',
      veg: true,
      deliveryNow: true,
      available: true,
      quantity: 8
    },
    {
      restaurantId: 'rest-3',
      name: 'Breakfast Surprise',
      price: 179,
      photoUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=400&fit=crop',
      veg: false,
      deliveryNow: false,
      available: true,
      quantity: 4
    },
    {
      restaurantId: 'rest-4',
      name: 'Benne Masala Dosa',
      price: 99,
      photoUrl: 'https://images.unsplash.com/photo-1694672595424-20ff9772c07d?w=400&h=400&fit=crop',
      veg: true,
      deliveryNow: true,
      available: true,
      quantity: 12
    },
    {
      restaurantId: 'rest-5',
      name: 'Beer & Pizza Deal',
      price: 299,
      photoUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
      veg: false,
      deliveryNow: false,
      available: true,
      quantity: 6
    },
    {
      restaurantId: 'rest-5',
      name: 'Wings & Fries Box',
      price: 249,
      photoUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=400&fit=crop',
      veg: false,
      deliveryNow: true,
      available: true,
      quantity: 5
    },
    {
      restaurantId: 'rest-6',
      name: 'South Indian Thali',
      price: 129,
      photoUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=400&fit=crop',
      veg: true,
      deliveryNow: true,
      available: true,
      quantity: 15
    },
    {
      restaurantId: 'rest-6',
      name: 'Rava Idli Set',
      price: 79,
      photoUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=400&fit=crop',
      veg: true,
      deliveryNow: false,
      available: true,
      quantity: 10
    },
    {
      restaurantId: 'rest-7',
      name: 'Asian Bowl Surprise',
      price: 329,
      photoUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop',
      veg: false,
      deliveryNow: false,
      available: true,
      quantity: 4
    },
    {
      restaurantId: 'rest-7',
      name: 'Dim Sum Platter',
      price: 279,
      photoUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=400&fit=crop',
      veg: false,
      deliveryNow: true,
      available: true,
      quantity: 5
    },
    {
      restaurantId: 'rest-8',
      name: 'Idli Vada Combo',
      price: 59,
      photoUrl: 'https://images.unsplash.com/photo-1626074353765-517a65edd3c8?w=400&h=400&fit=crop',
      veg: true,
      deliveryNow: true,
      available: true,
      quantity: 20
    },
    {
      restaurantId: 'rest-8',
      name: 'Coffee & Snack Box',
      price: 49,
      photoUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop',
      veg: true,
      deliveryNow: true,
      available: true,
      quantity: 15
    }
  ]
};

console.log('Seed data ready. Run this in Firebase console to populate Firestore:');
console.log(JSON.stringify(seedData, null, 2));
