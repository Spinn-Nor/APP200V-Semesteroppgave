// src/firebase/seedData.js
import { db } from "./config";
import { ref, set } from "firebase/database";

export const seedHotelsData = async () => {
  const hotelsData = {
    "hotel-oslo": {
      id: "hotel-oslo",
      name: "Blueberry Oslo",
      city: "Oslo",
      address: "Karl Johans gate 10, 0154 Oslo",
      rating: 4.7,
      description:
        "Modern central hotel with excellent views over the Oslofjord.",
      imageUrl: "https://picsum.photos/id/1015/800/500",
      hasSpa: true,
      hasEvents: true,
      rooms: {
        "single-oslo": {
          name: "Single Room",
          price: 890,
          capacity: 1,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Minibar", "Air conditioning"],
        },
        "double-oslo": {
          name: "Double Room",
          price: 1290,
          capacity: 2,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Bathtub", "Coffee machine"],
        },
        "suite-oslo": {
          name: "Suite",
          price: 2490,
          capacity: 4,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Balcony", "Mini fridge", "Bathtub"],
        },
      },
    },

    "hotel-bergen": {
      id: "hotel-bergen",
      name: "Blueberry Bergen",
      city: "Bergen",
      address: "Bryggen 12, 5003 Bergen",
      rating: 4.6,
      description:
        "Charming hotel in the heart of Bergen with view of the fjord.",
      imageUrl: "https://picsum.photos/id/133/800/500",
      hasSpa: true,
      hasEvents: false,
      rooms: {
        "single-bergen": {
          name: "Single Room",
          price: 950,
          capacity: 1,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Minibar"],
        },
        "double-bergen": {
          name: "Double Room",
          price: 1350,
          capacity: 2,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Bathtub"],
        },
        "suite-bergen": {
          name: "Suite",
          price: 2190,
          capacity: 4,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Balcony", "Mini fridge"],
        },
      },
    },

    "hotel-drammen": {
      id: "hotel-drammen",
      name: "Blueberry Drammen",
      city: "Drammen",
      address: "Bragernes Torg 5, 3017 Drammen",
      rating: 4.4,
      description: "Comfortable hotel located in the city center of Drammen.",
      imageUrl: "https://picsum.photos/id/201/800/500",
      hasSpa: false,
      hasEvents: true,
      rooms: {
        "single-drammen": {
          name: "Single Room",
          price: 850,
          capacity: 1,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Minibar"],
        },
        "double-drammen": {
          name: "Double Room",
          price: 1190,
          capacity: 2,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Bathtub"],
        },
        "suite-drammen": {
          name: "Suite",
          price: 1990,
          capacity: 4,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Mini fridge"],
        },
      },
    },

    "hotel-horten": {
      id: "hotel-horten",
      name: "Blueberry Horten",
      city: "Horten",
      address: "Rådhusgata 1, 3181 Horten",
      rating: 4.3,
      description: "Cozy hotel near the sea in Horten.",
      imageUrl: "https://picsum.photos/id/237/800/500",
      hasSpa: false,
      hasEvents: false,
      rooms: {
        "single-horten": {
          name: "Single Room",
          price: 820,
          capacity: 1,
          imageUrl: "",
          amenities: ["WiFi", "TV"],
        },
        "double-horten": {
          name: "Double Room",
          price: 1150,
          capacity: 2,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Bathtub"],
        },
        "suite-horten": {
          name: "Suite",
          price: 1890,
          capacity: 4,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Balcony"],
        },
      },
    },

    "hotel-larvik": {
      id: "hotel-larvik",
      name: "Blueberry Larvik",
      city: "Larvik",
      address: "Storgata 20, 3256 Larvik",
      rating: 4.5,
      description: "Stylish hotel close to the harbor in Larvik.",
      imageUrl: "https://picsum.photos/id/201/800/500",
      hasSpa: true,
      hasEvents: true,
      rooms: {
        "single-larvik": {
          name: "Single Room",
          price: 870,
          capacity: 1,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Minibar"],
        },
        "double-larvik": {
          name: "Double Room",
          price: 1240,
          capacity: 2,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Bathtub"],
        },
        "suite-larvik": {
          name: "Suite",
          price: 2090,
          capacity: 4,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Balcony", "Mini fridge"],
        },
      },
    },

    "hotel-trondheim": {
      id: "hotel-trondheim",
      name: "Blueberry Trondheim",
      city: "Trondheim",
      address: "Kongens gate 15, 7012 Trondheim",
      rating: 4.6,
      description: "Modern hotel in the heart of Trondheim.",
      imageUrl: "https://picsum.photos/id/237/800/500",
      hasSpa: true,
      hasEvents: true,
      rooms: {
        "single-trondheim": {
          name: "Single Room",
          price: 890,
          capacity: 1,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Minibar"],
        },
        "double-trondheim": {
          name: "Double Room",
          price: 1280,
          capacity: 2,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Bathtub"],
        },
        "suite-trondheim": {
          name: "Suite",
          price: 2350,
          capacity: 4,
          imageUrl: "",
          amenities: ["WiFi", "TV", "Balcony", "Mini fridge"],
        },
      },
    },
  };

  try {
    await set(ref(db, "hotels"), hotelsData);
    console.log(
      "✅ Seed fullført! Alle 6 hoteller med rom og amenities er lagt inn.",
    );
  } catch (error) {
    console.error("❌ Feil ved seeding:", error);
  }
};
