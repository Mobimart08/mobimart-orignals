// Import local premium image assets
import brandAppleIphone from '../assets/brand_apple_iphone.png';
import brandSamsungPhone from '../assets/brand_samsung_phone.png';
import brandGooglePhone from '../assets/brand_google_phone.png';
import collectionIphone from '../assets/collection_iphone.png';

// central dataset containing detailed specifications for MobiMart devices
// Classified into conditionType: 'New' or 'Used'
export const products = [
  {
    id: '1',
    slug: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    price: '₹89,999',
    originalPrice: '₹99,999',
    discount: '10% OFF',
    category: 'Apple',
    image: brandAppleIphone,
    gallery: [
      brandAppleIphone,
      collectionIphone,
      brandAppleIphone
    ],
    rating: 4.8,
    reviewCount: 421,
    conditionType: 'Used',
    condition: 'Certified Like New',
    certified: true,
    batteryHealth: 96,
    storageOptions: ['128GB', '256GB', '512GB', '1TB'],
    colorOptions: [
      { name: 'Natural Titanium', value: '#C5A880' },
      { name: 'Blue Titanium', value: '#2E3541' },
      { name: 'White Titanium', value: '#E5E7EB' },
      { name: 'Black Titanium', value: '#2A2B2E' }
    ],
    description: 'Featuring a strong and light titanium design, the new Action button, a powerful iPhone camera system, and the groundbreaking A17 Pro chip for next-level mobile gaming and performance.',
    specifications: [
      { name: 'Display', value: '6.1" Super Retina XDR OLED' },
      { name: 'Processor', value: 'A17 Pro Chip' },
      { name: 'Camera', value: '48MP + 12MP + 12MP / 12MP Front' },
      { name: 'RAM', value: '8GB' },
      { name: 'Storage', value: '128GB' },
      { name: 'Battery', value: 'Up to 23 hrs video playback' },
      { name: 'OS', value: 'iOS 17' },
      { name: 'SIM', value: 'Dual SIM (nano-SIM + eSIM)' },
      { name: 'Connectivity', value: '5G, Wi-Fi 6E, Bluetooth 5.3' },
      { name: 'Weight', value: '187 g' }
    ],
    inspectionReport: [
      { name: 'Display', desc: 'No scratches or cracks', status: 'Pass' },
      { name: 'Face ID', desc: 'Fully functional', status: 'Pass' },
      { name: 'Battery', desc: 'Health > 90%', status: 'Pass' },
      { name: 'Camera', desc: 'All cameras working perfectly', status: 'Pass' },
      { name: 'Buttons', desc: 'All buttons responsive', status: 'Pass' },
      { name: 'Speakers', desc: 'Clear and loud', status: 'Pass' },
      { name: 'Microphone', desc: 'No issues found', status: 'Pass' },
      { name: 'Sensors', desc: 'All sensors working', status: 'Pass' },
      { name: 'WiFi & Bluetooth', desc: 'Stable connection', status: 'Pass' },
      { name: 'Ports', desc: 'Clean and functional', status: 'Pass' },
      { name: 'Back Panel', desc: 'No scratches', status: 'Pass' },
      { name: 'IMEI & Functionality', desc: 'Device fully functional', status: 'Pass' }
    ],
    warranty: '12 Months Warranty',
    boxContents: ['iPhone 15 Pro', 'USB-C to USB-C Cable', 'Documentation', 'SIM Ejector Tool'],
    reviews: [
      { name: 'Arjun Mehta', rating: 5, date: '12 May 2024', verified: true, content: 'Excellent condition and battery health is as described. Delivery was super fast!', helpful: 24 },
      { name: 'Neha Kapoor', rating: 5, date: '10 May 2024', verified: true, content: 'Amazing experience. Phone looks and works like new. Totally worth it!', helpful: 18 },
      { name: 'Rohit Sharma', rating: 5, date: '8 May 2024', verified: true, content: 'Smooth purchase and genuine product. Highly recommended.', helpful: 12 }
    ]
  },
  {
    id: '2',
    slug: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    price: '₹1,09,999',
    originalPrice: '₹1,19,999',
    discount: '8% OFF',
    category: 'Apple',
    image: collectionIphone,
    gallery: [
      collectionIphone,
      brandAppleIphone
    ],
    rating: 4.9,
    reviewCount: 312,
    conditionType: 'New',
    condition: 'Brand New - Sealed',
    certified: false,
    storageOptions: ['256GB', '512GB', '1TB'],
    colorOptions: [
      { name: 'Blue Titanium', value: '#2E3541' },
      { name: 'Natural Titanium', value: '#C5A880' }
    ],
    description: 'The ultimate iPhone. Unopened factory sealed retail box. Featuring a strong and light titanium design, a powerful 5x Telephoto camera system, and the revolutionary A17 Pro processor.',
    specifications: [
      { name: 'Display', value: '6.7" Super Retina XDR OLED' },
      { name: 'Processor', value: 'A17 Pro Chip' },
      { name: 'Camera', value: '48MP + 12MP + 12MP / 12MP Front' },
      { name: 'RAM', value: '8GB' },
      { name: 'Storage', value: '256GB' },
      { name: 'Battery', value: 'Up to 29 hrs video playback' },
      { name: 'OS', value: 'iOS 17' },
      { name: 'SIM', value: 'Dual SIM' }
    ],
    inspectionReport: [],
    warranty: '1 Year Apple Brand Warranty',
    boxContents: ['iPhone 15 Pro Max', 'USB-C to USB-C Cable', 'Apples Retail Packaging'],
    reviews: [
      { name: 'Kabir Dev', rating: 5, date: '14 May 2024', verified: true, content: 'Brand new item sealed in original box. Truly authentic.', helpful: 8 }
    ]
  },
  {
    id: '3',
    slug: 'iphone-14',
    name: 'iPhone 14',
    brand: 'Apple',
    price: '₹59,999',
    originalPrice: '₹69,999',
    discount: '14% OFF',
    category: 'Apple',
    image: 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=400&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=400&auto=format&fit=crop&q=80'
    ],
    rating: 4.6,
    reviewCount: 154,
    conditionType: 'Used',
    condition: 'Very Good',
    certified: true,
    batteryHealth: 88,
    storageOptions: ['128GB', '256GB'],
    colorOptions: [
      { name: 'Starlight', value: '#F9F6EF' },
      { name: 'Midnight', value: '#1F2022' }
    ],
    description: 'Super-bright Super Retina XDR display, advanced dual-camera system for better photos in any light, Action mode for smooth handheld videos, and all-day battery life.',
    specifications: [
      { name: 'Display', value: '6.1" OLED' },
      { name: 'Processor', value: 'A15 Bionic' }
    ],
    inspectionReport: [
      { name: 'Display', desc: 'Minor cosmetic scratches', status: 'Pass' },
      { name: 'Face ID', desc: 'Fully functional', status: 'Pass' },
      { name: 'Battery', desc: 'Health 88%', status: 'Pass' }
    ],
    warranty: '6 Months Warranty',
    boxContents: ['iPhone 14', 'USB-C to Lightning Cable'],
    reviews: []
  },
  {
    id: '4',
    slug: 'samsung-s24-ultra',
    name: 'Samsung S24 Ultra',
    brand: 'Samsung',
    price: '₹1,24,999',
    originalPrice: '₹1,39,999',
    discount: '10% OFF',
    category: 'Samsung',
    image: brandSamsungPhone,
    gallery: [
      brandSamsungPhone
    ],
    rating: 4.9,
    reviewCount: 512,
    conditionType: 'Used',
    condition: 'Certified Like New',
    certified: true,
    batteryHealth: 98,
    storageOptions: ['256GB', '512GB', '1TB'],
    colorOptions: [
      { name: 'Titanium Black', value: '#2A2B2E' },
      { name: 'Titanium Grey', value: '#79797A' }
    ],
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.',
    specifications: [
      { name: 'Display', value: '6.8" Dynamic AMOLED 2X' },
      { name: 'Processor', value: 'Snapdragon 8 Gen 3' }
    ],
    inspectionReport: [
      { name: 'Display', desc: 'Perfect condition', status: 'Pass' },
      { name: 'S-Pen Slot', desc: 'Clean and functional', status: 'Pass' },
      { name: 'Battery', desc: 'Health 98%', status: 'Pass' }
    ],
    warranty: '12 Months Warranty',
    boxContents: ['Galaxy S24 Ultra', 'USB-C Cable', 'S-Pen'],
    reviews: []
  },
  {
    id: '5',
    slug: 'iphone-15',
    name: 'iPhone 15',
    brand: 'Apple',
    price: '₹69,999',
    originalPrice: '₹79,999',
    discount: '12% OFF',
    category: 'Apple',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviewCount: 220,
    conditionType: 'Used',
    condition: 'Excellent',
    certified: true,
    batteryHealth: 92,
    storageOptions: ['128GB', '256GB', '512GB'],
    colorOptions: [
      { name: 'Pink', value: '#F3D4D6' },
      { name: 'Black', value: '#222222' }
    ],
    description: 'Dynamic Island bubbles up alerts and Live Activities, so you don\'t miss them while you\'re doing something else. Plus, a durable color-infused glass and aluminum design.',
    specifications: [
      { name: 'Display', value: '6.1" OLED' }
    ],
    inspectionReport: [
      { name: 'Display', desc: 'No issues', status: 'Pass' },
      { name: 'Battery', desc: 'Health 92%', status: 'Pass' }
    ],
    warranty: '12 Months Warranty',
    boxContents: ['iPhone 15', 'USB-C Cable'],
    reviews: []
  },
  {
    id: '6',
    slug: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    brand: 'Apple',
    price: '₹79,999',
    originalPrice: '₹89,999',
    discount: '11% OFF',
    category: 'Apple',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviewCount: 189,
    conditionType: 'Used',
    condition: 'Excellent',
    certified: true,
    batteryHealth: 91,
    storageOptions: ['128GB', '256GB', '512GB'],
    colorOptions: [
      { name: 'Deep Purple', value: '#3E3446' },
      { name: 'Space Black', value: '#1E1E1E' }
    ],
    description: 'Dynamic Island, a new way to interact with iPhone. 48MP camera for up to 4x greater resolution. Action mode for smooth handheld videos. Always-on display.',
    specifications: [
      { name: 'Display', value: '6.1" OLED' }
    ],
    inspectionReport: [
      { name: 'Display', desc: 'Excellent shape', status: 'Pass' },
      { name: 'Battery', desc: 'Health 91%', status: 'Pass' }
    ],
    warranty: '12 Months Warranty',
    boxContents: ['iPhone 14 Pro', 'USB-C to Lightning Cable'],
    reviews: []
  },
  {
    id: '7',
    slug: 'iphone-13',
    name: 'iPhone 13',
    brand: 'Apple',
    price: '₹49,999',
    originalPrice: '₹59,999',
    discount: '16% OFF',
    category: 'Apple',
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&auto=format&fit=crop&q=80'
    ],
    rating: 4.5,
    reviewCount: 88,
    conditionType: 'Used',
    condition: 'Good',
    certified: true,
    batteryHealth: 86,
    storageOptions: ['128GB', '256GB'],
    colorOptions: [
      { name: 'Blue', value: '#3F617E' },
      { name: 'Red', value: '#A5181E' }
    ],
    description: 'A lightning-fast A15 Bionic chip, a giant leap in battery life, a durable design, and a cinematic mode that puts professional focus capabilities in your hands.',
    specifications: [],
    inspectionReport: [
      { name: 'Display', desc: 'Minor outline scratches', status: 'Pass' },
      { name: 'Battery', desc: 'Health 86%', status: 'Pass' }
    ],
    warranty: '6 Months Warranty',
    boxContents: ['iPhone 13', 'USB-C to Lightning Cable'],
    reviews: []
  },
  {
    id: '8',
    slug: 'google-pixel-8-pro',
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    price: '₹59,999',
    originalPrice: '₹74,999',
    discount: '20% OFF',
    category: 'Google',
    image: brandGooglePhone,
    gallery: [
      brandGooglePhone
    ],
    rating: 4.8,
    reviewCount: 204,
    conditionType: 'New',
    condition: 'Brand New - Sealed',
    certified: false,
    storageOptions: ['128GB', '256GB'],
    colorOptions: [
      { name: 'Bay Blue', value: '#AACAE6' },
      { name: 'Obsidian', value: '#2D2D2D' }
    ],
    description: 'Unopened box google retail sealed. The all-pro phone engineered by Google. It has the best of Google AI, the most advanced Pixel Camera ever, and Google Tensor G3.',
    specifications: [],
    inspectionReport: [],
    warranty: '1 Year Google India Warranty',
    boxContents: ['Pixel 8 Pro', 'USB-C Cable', 'Google SIM Tool'],
    reviews: []
  }
];

export const getProductById = (id) => {
  return products.find(product => product.id === id);
};

export const getRelatedProducts = (currentId, brand) => {
  return products.filter(product => product.id !== currentId && (product.brand === brand || product.category === brand)).slice(0, 4);
};

export default products;
