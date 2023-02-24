# Carpool2DCU 

Carpool2DCU is a mobile carpooling application that is operational on both Android and IOS devices. It aims at getting DCU students to campus while reducing their digital footprint, as well as decreasing transportation costs throughout the university. The application was developed with ease of use in mind as well as respect for individual constraints, which is why students can filter their ideal partner out of available ones.

The application works by allowing registered students to create a profile, which includes their name, email address, and preferences such as the preferred route and time of travel. Drivers can then offer rides to other students who have matching preferences.

## Contributors
Adrian Irwin (20415624)  
Afolabi Fatogun (20409054)  
## Install Guide
### Prerequisites
- NodeJS LTS + npm
- Expo Go mobile application from either the IOS or Android store.
- Two terminals
- MongoDB connection string
- OpenRouteService API Key
- Bing Maps API Key

### Step 1
Clone this repo
### Step 2
In one terminal, go to the frontend folder: `cd src/Carpool` and run `npm i`
### Step 3
Create a ‘.env’ file using ‘.env.example’ and fill in the API key environment variables.
### Step 4
Run the frontend using `npm start`
### Step 5
In a second terminal, go to the backend folder: `cd src/backend` and run `npm i`
### Step 6
Create a ‘.env’ file using ‘.env.example’ and fill in the MongoDB connection string environment variable.
### Step 7
Run the backend using `npm start`
### Step 8
Scan the QR code in the first terminal using your camera to open the application.
