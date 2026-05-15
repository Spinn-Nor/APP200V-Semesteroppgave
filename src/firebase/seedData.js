import {db} from './config';
import {ref, set} from 'firebase/database';

export const seedHotelsData = async () => {
  const hotelsData = {
    "hotel-oslo": {
      id: "hotel-oslo",
      name: "Blueberry Oslo",
      city: "Oslo",
      address: "Karl Johans gate 10, 0154 Oslo",
      rating: 4.7,
      description: "Moderne og sentralt hotell med høy standard og fantastisk utsikt over Oslofjorden.",
      imageUrl: "https://picsum.photos/id/1015/800/500",
      hasSpa: true,
      hasConference: true,
      rooms: {
        "single-oslo": {
          id: "single-oslo",
          type: "Single",
          title: "Standard Single Room",
          price: 890,
          capacity: 1,
          available: true,
          amenities: ["WiFi", "TV", "Minibar", "Air conditioning"]
        },
        "double-oslo": {
          id: "double-oslo",
          type: "Double",
          title: "Deluxe Double Room",
          price: 1290,
          capacity: 2,
          available: true,
          amenities: ["WiFi", "TV", "Bathtub", "Coffee machine"]
        },
        "suite-oslo": {
          id: "suite-oslo",
          type: "Suite",
          title: "Executive Suite",
          price: 2490,
          capacity: 4,
          available: true,
          amenities: ["WiFi", "TV", "Bathtub", "Balcony", "Mini fridge"]
        }
      }
    },

    "hotel-bergen": {
      id: "hotel-bergen",
      name: "Blueberry Bergen",
      city: "Bergen",
      address: "Bryggen 12, 5003 Bergen",
      rating: 4.5,
      description: "Koselig hotell nær Bryggen med vakker utsikt mot fjord og fjell.",
      imageUrl: "https://picsum.photos/id/201/800/500",
      hasSpa: true,
      hasConference: false,
      rooms: {
        "single-bergen": {
          id: "single-bergen",
          type: "Single",
          title: "Standard Single Room",
          price: 950,
          capacity: 1,
          available: true,
          amenities: ["WiFi", "TV", "Minibar"]
        },
        "double-bergen": {
          id: "double-bergen",
          type: "Double",
          title: "Deluxe Double Room",
          price: 1350,
          capacity: 2,
          available: true,
          amenities: ["WiFi", "TV", "Bathtub"]
        },
        "suite-bergen": {
          id: "suite-bergen",
          type: "Suite",
          title: "Junior Suite",
          price: 2190,
          capacity: 3,
          available: true,
          amenities: ["WiFi", "TV", "Balcony"]
        }
      }
    },

    "hotel-drammen": {
      id: "hotel-drammen",
      name: "Blueberry Drammen",
      city: "Drammen",
      address: "Strømsø torg 5, 3044 Drammen",
      rating: 4.3,
      description: "Praktisk hotell sentralt i Drammen med god tilgang til offentlig transport.",
      imageUrl: "https://picsum.photos/id/237/800/500",
      hasSpa: false,
      hasConference: true,
      rooms: {
        "single-drammen": {
          id: "single-drammen",
          type: "Single",
          title: "Standard Single Room",
          price: 790,
          capacity: 1,
          available: true,
          amenities: ["WiFi", "TV", "Minibar"]
        },
        "double-drammen": {
          id: "double-drammen",
          type: "Double",
          title: "Deluxe Double Room",
          price: 1150,
          capacity: 2,
          available: true,
          amenities: ["WiFi", "TV", "Coffee machine"]
        },
        "suite-drammen": {
          id: "suite-drammen",
          type: "Suite",
          title: "Executive Suite",
          price: 1950,
          capacity: 4,
          available: true,
          amenities: ["WiFi", "TV", "Bathtub"]
        }
      }
    },

    "hotel-horten": {
      id: "hotel-horten",
      name: "Blueberry Horten",
      city: "Horten",
      address: "Langgrunnveien 5, 3187 Horten",
      rating: 4.4,
      description: "Hyggelig hotell nær sjøen med god atmosfære og rolig beliggenhet.",
      imageUrl: "https://picsum.photos/id/251/800/500",
      hasSpa: true,
      hasConference: false,
      rooms: {
        "single-horten": {
          id: "single-horten",
          type: "Single",
          title: "Standard Single Room",
          price: 820,
          capacity: 1,
          available: true,
          amenities: ["WiFi", "TV", "Minibar"]
        },
        "double-horten": {
          id: "double-horten",
          type: "Double",
          title: "Deluxe Double Room",
          price: 1180,
          capacity: 2,
          available: true,
          amenities: ["WiFi", "TV", "Bathtub"]
        },
        "suite-horten": {
          id: "suite-horten",
          type: "Suite",
          title: "Junior Suite",
          price: 1890,
          capacity: 3,
          available: true,
          amenities: ["WiFi", "TV", "Balcony"]
        }
      }
    },

    "hotel-larvik": {
      id: "hotel-larvik",
      name: "Blueberry Larvik",
      city: "Larvik",
      address: "Storgata 20, 3256 Larvik",
      rating: 4.2,
      description: "Familievennlig hotell med god beliggenhet nær sentrum og sjøen.",
      imageUrl: "https://picsum.photos/id/133/800/500",
      hasSpa: false,
      hasConference: true,
      rooms: {
        "single-larvik": {
          id: "single-larvik",
          type: "Single",
          title: "Standard Single Room",
          price: 780,
          capacity: 1,
          available: true,
          amenities: ["WiFi", "TV", "Minibar"]
        },
        "double-larvik": {
          id: "double-larvik",
          type: "Double",
          title: "Deluxe Double Room",
          price: 1120,
          capacity: 2,
          available: true,
          amenities: ["WiFi", "TV", "Coffee machine"]
        },
        "suite-larvik": {
          id: "suite-larvik",
          type: "Suite",
          title: "Family Suite",
          price: 1790,
          capacity: 4,
          available: true,
          amenities: ["WiFi", "TV", "Bathtub"]
        }
      }
    },

    "hotel-trondheim": {
      id: "hotel-trondheim",
      name: "Blueberry Trondheim",
      city: "Trondheim",
      address: "Kongens gate 15, 7012 Trondheim",
      rating: 4.6,
      description: "Stilfullt og moderne hotell i hjertet av Trondheim.",
      imageUrl: "https://picsum.photos/id/237/800/500",
      hasSpa: true,
      hasConference: true,
      rooms: {
        "single-trondheim": {
          id: "single-trondheim",
          type: "Single",
          title: "Standard Single Room",
          price: 870,
          capacity: 1,
          available: true,
          amenities: ["WiFi", "TV", "Minibar"]
        },
        "double-trondheim": {
          id: "double-trondheim",
          type: "Double",
          title: "Deluxe Double Room",
          price: 1250,
          capacity: 2,
          available: true,
          amenities: ["WiFi", "TV", "Bathtub"]
        },
        "suite-trondheim": {
          id: "suite-trondheim",
          type: "Suite",
          title: "Executive Suite",
          price: 2350,
          capacity: 4,
          available: true,
          amenities: ["WiFi", "TV", "Balcony", "Mini fridge"]
        }
      }
    }
  }

  try {
    await set(ref(db, 'hotels'), hotelsData);
    console.log("✅ Alle 6 hoteller med rom er nå lagt inn i Realtime Database!");
    console.log("Hoteller: Oslo, Bergen, Drammen, Horten, Larvik, Trondheim");
  } catch (error) {
    console.error("❌ Feil ved seeding av data:", error);
  }
};


