import { db } from "./config";
import { ref, set } from "firebase/database";

// Definerer de tre standardiserte Blueberry-klassene for gjenbruk
const roomClasses = {
  small: {
    id: "conf-small",
    name: "Small Conference Room",
    capacity: "Up to 12 people",
    equipment: "65'' Smart Screen, Video Hub, High-Speed Wi-Fi",
    price: "4500 kr",
    category: "conference"
  },
  medium: {
    id: "conf-medium",
    name: "Medium Conference Room",
    capacity: "Up to 40 people",
    equipment: "4K Projector, Whiteboard, Jabra Sound-System, Flipchart",
    price: "7500 kr",
    category: "conference"
  },
  large: {
    id: "conf-large",
    name: "Large Conference Room",
    capacity: "Up to 150 people",
    equipment: "Main Stage, Dual Projectors, Professional Sound & Wireless Mics",
    price: "13000 kr",
    category: "conference"
  }
};

const eventRoomsData = {
  "hotel-oslo": {
    hotelName: "Blueberry Grand Central Oslo",
    rooms: {
      "conf-small": roomClasses.small,
      "conf-medium": roomClasses.medium,
      "conf-large": roomClasses.large
    }
  },
  "hotel-larvik": {
    hotelName: "Farris Bad (Blueberry Larvik)",
    rooms: {
      "conf-small": roomClasses.small,
      "conf-medium": roomClasses.medium,
      "conf-large": roomClasses.large
    }
  },
  "hotel-drammen": {
    hotelName: "Blueberry Hotel Drammen",
    rooms: {
      "conf-small": roomClasses.small,
      "conf-medium": roomClasses.medium
    }
  },
  "hotel-trondheim": {
    hotelName: "Blueberry Hotel Trondheim",
    rooms: {
      "conf-small": roomClasses.small,
      "conf-medium": roomClasses.medium
    }
  }
};

export const seedEventRooms = async () => {
  try {
    const eventsRef = ref(db, "conferenceRooms");
    await set(eventsRef, eventRoomsData);
    console.log("Conference room classes successfully seeded to Firebase! 🎉");
    return true;
  } catch (error) {
    console.error("Error seeding conference rooms: ", error);
    return false;
  }
};