# Smart Krishi App

A comprehensive agricultural technology platform designed to empower farmers with smart tools for crop management, equipment rental, weather forecasting, and market intelligence. Built with a modern mobile-first approach using React Native and Expo, backed by a robust Node.js/Express server.

## 🌾 Project Overview

Smart Krishi App is an intelligent farming assistant that bridges the gap between traditional agriculture and modern technology. It provides farmers with real-time crop health monitoring, market insights, weather predictions, equipment rental services, and AI-powered agricultural recommendations.

### Key Features

- **Crop Management**: Track crop health, manage crop details, and access crop lifecycle information
- **Weather Forecasting**: Real-time weather updates and agricultural weather guides
- **Market Intelligence**: Access to market prices and product listings
- **Equipment Rental**: Rent agricultural machinery from nearby farmers
- **Health Analysis**: AI-powered crop health analysis and recommendations
- **Multi-language Support**: Supports multiple languages for accessibility
- **User Authentication**: Secure login and registration system
- **Farmer Network**: Connect with other farmers and view their profiles

## 📁 Project Structure

```
Smart-Krishi-App/
├── Client/                          # React Native/Expo Frontend
│   ├── app/                         # Application pages and screens
│   │   ├── _layout.tsx             # Root layout
│   │   ├── (auth)/                 # Authentication screens
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── (tabs)/                 # Tabbed navigation screens
│   │   │   ├── _layout.js
│   │   │   ├── home.js
│   │   │   ├── alerts.js
│   │   │   ├── market.js
│   │   │   └── profile.js
│   │   ├── billing.js
│   │   ├── crop-details.js
│   │   ├── crop-health.js
│   │   ├── my-crops.js
│   │   ├── MyPurchases.js
│   │   ├── RentCrop.js
│   │   ├── RentMachine.js
│   │   └── settings.js
│   ├── components/                 # Reusable React components
│   │   ├── CropForm.js
│   │   ├── MachineForm.js
│   │   ├── WeatherCard.js
│   │   ├── HomeHeader.js
│   │   ├── OfflineAlert.js
│   │   ├── TipCard.js
│   │   └── ... (other components)
│   ├── constants/                  # App constants and data
│   │   ├── crop-data.js
│   │   ├── i18n.js                # Internationalization config
│   │   ├── numberTranslator.js
│   │   ├── translateText.js
│   │   ├── cropdata/              # JSON data files
│   │   │   ├── cropLifecycles.json
│   │   │   └── weatherGuide.json
│   │   └── weatherTranslations.js
│   ├── context/                    # React Context
│   │   └── AuthContext.js
│   ├── hooks/                      # Custom React hooks
│   │   └── useLocation.js
│   ├── services/                   # API services
│   │   ├── product.js
│   │   └── weatherService.js
│   ├── store/                      # Redux store configuration
│   │   ├── store.js
│   │   ├── languageSlice.js
│   │   └── locationSlice.js
│   ├── assets/                     # Static assets
│   │   ├── images/
│   │   ├── fonts/
│   │   ├── crops/
│   │   └── machine/
│   ├── package.json
│   ├── app.json                    # Expo configuration
│   ├── babel.config.js
│   ├── eslint.config.js
│   ├── tsconfig.json
│   └── README.md
│
└── Server/                         # Node.js/Express Backend
    ├── config/
    │   └── db.js                   # MongoDB connection
    ├── controllers/                # Route controllers
    │   ├── authController.js
    │   ├── analysisController.js
    │   ├── productController.js
    │   └── machineController.js
    ├── middleware/                 # Express middleware
    │   ├── authMiddleware.js
    │   └── errorHandler.js
    ├── models/                     # MongoDB schemas
    │   ├── User.js
    │   ├── Product.js
    │   └── Machine.js
    ├── routes/                     # API routes
    │   ├── authRoutes.js
    │   ├── analysisRoutes.js
    │   ├── productRoutes.js
    │   └── machineRoutes.js
    ├── uploads/                    # File uploads directory
    │   └── products/
    ├── server.js                   # Main server file
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Expo CLI (`npm install -g expo-cli`)
- MongoDB (local or Atlas cloud)
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/AayushSinghRajput/Smart-Krishi-App.git
cd Smart-Krishi-App
```

#### 2. Backend Setup

Navigate to the Server directory and install dependencies:

```bash
cd Server
npm install
```

Create a `.env` file in the Server directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-krishi
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-krishi

JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

Start the backend server:

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

#### 3. Frontend Setup

Navigate to the Client directory and install dependencies:

```bash
cd ../Client
npm install
```

Create a `.env` file in the Client directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npx expo start
```

This will open the Expo Dev Tools. From there, you can:
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator
- Press `w` to open in web browser
- Scan the QR code with Expo Go app on your mobile device

## 📱 Running on Different Platforms

### Android

```bash
cd Client
npm run android
```

### iOS

```bash
cd Client
npm run ios
```

### Web

```bash
cd Client
npm run web
```

## 🏗️ Architecture Overview

### Frontend Architecture

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **Navigation**: Expo Router with tab-based navigation
- **Internationalization**: i18next for multi-language support
- **Location Services**: Geolocation for weather and nearby services

### Backend Architecture

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer for image/file handling
- **API Security**: CORS enabled
- **AI Integration**: Gradio client for crop analysis

## 🔐 Authentication

The app uses JWT-based authentication:

1. Users register with email and password
2. Passwords are hashed using bcryptjs
3. JWT tokens are issued upon login
4. Protected routes validate JWT tokens via authMiddleware

## 📊 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user

### Analysis (`/api/analysis`)
- `POST /analyze` - Analyze crop health
- `GET /recommendations` - Get farming recommendations

### Products (`/api/products`)
- `GET /` - Get all products
- `POST /` - Create product listing
- `GET /:id` - Get product details
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product

### Machines (`/api/machines`)
- `GET /` - Get available machines
- `POST /` - List machine for rent
- `GET /:id` - Get machine details
- `PUT /:id` - Update machine listing
- `DELETE /:id` - Remove machine listing

## 🎯 Key Technologies

### Frontend Stack
- React 19.1.0
- React Native 0.81.4
- Expo 54.0.0
- Redux Toolkit 2.8.2
- i18next 25.3.2
- TypeScript
- React Navigation

### Backend Stack
- Express.js 5.1.0
- MongoDB 8.16.4
- Mongoose (ODM)
- JWT for authentication
- Bcryptjs for password hashing
- Multer for file uploads
- Gradio Client for ML integration

## 🌐 Multi-Language Support

The app supports multiple languages through i18next. Current supported languages can be configured in:

- `Client/constants/i18n.js` - i18next configuration
- `Client/constants/translateText.js` - Translation helper
- `Client/constants/numberTranslator.js` - Number translation

## 📍 Location Services

The app uses geolocation to:
- Show nearby equipment rentals
- Provide location-specific weather forecasts
- Display local market information

Location fetching is handled by:
- `Client/hooks/useLocation.js` - Custom hook for location
- `Client/components/LocationFetcher.js` - Location component
- Redux location slice for state management

## 🔄 Redux Store

The app uses Redux for global state management:

- **languageSlice**: Manages language preferences
- **locationSlice**: Manages user location data
- **authContext**: Manages authentication state

## 📚 Development Guidelines

### Code Style
- ESLint configured for code quality
- Follow React best practices
- Use TypeScript where applicable

### Component Structure
- Functional components with hooks
- Props validation
- Proper error handling

### Database Migrations
Currently using Mongoose schemas. To modify:
1. Update model in `Server/models/`
2. Migration happens automatically

## 🛠️ Troubleshooting

### Backend Issues

**Database Connection Error**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify network connectivity

**Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Frontend Issues

**Expo CLI not found**
```bash
npm install -g expo-cli
```

**Module not found**
```bash
cd Client
npm install
rm -rf node_modules
npm install
```

**Blank screen on startup**
- Clear cache: `expo start -c`
- Rebuild: `expo prebuild --clean`

## 📦 Building for Production

### Android APK

```bash
cd Client
eas build --platform android
```

### iOS App

```bash
cd Client
eas build --platform ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Aayush Singh Rajput**

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation in respective README files

## 🚀 Roadmap

- [ ] Push notifications for alerts
- [ ] Offline mode with data sync
- [ ] Advanced analytics dashboard
- [ ] Integration with IoT sensors
- [ ] Payment gateway integration
- [ ] Video tutorials for farmers
- [ ] Community forum

## 🌱 Environmental Impact

Smart Krishi App aims to promote sustainable farming practices by:
- Optimizing resource usage through data-driven insights
- Reducing crop loss through early disease detection
- Promoting equipment sharing to reduce waste
- Connecting farmers for knowledge sharing

---

**Happy Farming! 🌾**
