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
      hasSpa: true,
      hasEvents: true,

      // Images array - fasade og eksteriør
      images: [
        "https://images.ctfassets.net/nwbqij9m1jag/cFJNiiLX1Rp6PGWBYE9bJ/4b512a4f0ab0ad3e8c74ee4ddccffb68/Amerikalinjen_-_Exterior_-_Hotel_facade__original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/6rs9NBtNW6RbBgeQ4akhcm/5d8d86a9ede4efd6da8e66aea160ff22/Amerikalinjen_-_Exterior_-_Flag_outside_hotel_builing_original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/DdLInUvqIWaXW1QqQetU5/2b157c326c6659c0b1b40eb73d7b8c9f/Amerikalinjen_-_Lobby_-_Receptionists_behind__original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/5LyB6jsCAoOqyOELROwdJT/a47299987367a3f5c1f96d258cba5999/Amerikalinjen_-_Lobby_-__original?fm=webp&q=80&w=2560",
      ],

      amenities: [
        { id: "breakfast", label: "Breakfast Buffet", price: 320, icon: "🍳" },
        { id: "gym_access", label: "24/7 Gym Access", price: 0, icon: "🏋️" },
        { id: "parking", label: "Valet Parking", price: 220, icon: "🅿️" },
        { id: "late_checkout", label: "Late Checkout", price: 180, icon: "⏰" },
        {
          id: "ev_charging",
          label: "EV Charging Station",
          price: 150,
          icon: "⚡",
        },
      ],

      rooms: {
        "single-oslo": {
          name: "Single Room",
          price: 890,
          capacity: 1,
          quantity: 28,
        },
        "double-oslo": {
          name: "Double Room",
          price: 1290,
          capacity: 2,
          quantity: 45,
        },
        "suite-oslo": {
          name: "Junior Suite",
          price: 2490,
          capacity: 4,
          quantity: 12,
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
      hasSpa: true,
      hasEvents: false,

      // Images array - fasade og eksteriør
      images: [
        "https://images.ctfassets.net/nwbqij9m1jag/3cuyh0NoZmDGiPvIIsjArS/988d7a799f8ac2dce0c18cab53e7876a/Comfort_Hotel_Bergen_-_Common_Area_-_Roof_terrace_original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/5SwhkR2knVOd3dkzM68SES/342545343159d913f0d6998b633fa0d8/Comfort_Hotel_Bergen_-_Barception_-_Barception_original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/6YA8LSqzxsbtoBcZbcMw6j/f0bbd94c928e0d01cd4bb8af5c2ef0cd/Comfort_Hotel_Bergen_-_Common_Area_-_Outdoor_seating_original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/1hJUNsEn6UieG2ZmOgFLkb/a5ac4e666391cf0d9bdc456aef690d69/Comfort_Hotel_Bergen_-_Restaurant_-_Sitting_area_original?fm=webp&q=80&w=2560",
      ],

      amenities: [
        { id: "breakfast", label: "Breakfast Buffet", price: 280, icon: "🍳" },
        {
          id: "spa_access",
          label: "Spa & Wellness Access",
          price: 395,
          icon: "♨️",
        },
        { id: "late_checkout", label: "Late Checkout", price: 150, icon: "⏰" },
        {
          id: "airport_transfer",
          label: "Airport Transfer",
          price: 490,
          icon: "🚕",
        },
        { id: "room_service", label: "Room Service", price: 120, icon: "🛎️" },
      ],

      rooms: {
        "single-bergen": {
          name: "Single Room",
          price: 950,
          capacity: 1,
          quantity: 22,
        },
        "double-bergen": {
          name: "Double Room",
          price: 1350,
          capacity: 2,
          quantity: 38,
        },
        "suite-bergen": {
          name: "Suite",
          price: 2190,
          capacity: 4,
          quantity: 10,
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
      hasSpa: false,
      hasEvents: true,

      images: [
        "https://images.ctfassets.net/nwbqij9m1jag/1xJO6qwuf30fG3aPurw7g9/05a6d5beb736b17dfc65ff6144b53724/Comfort_Hotel_Union_Brygge_-_Facade_original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/7ia9KmvROuiUKPOcBUI9hN/073f46c9b7a4f26dcd6b25a85e38b508/Comfort_Hotel_Union_Brygge_-_Facade__2__original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/1jsqqONTu3rX7UDfPrLamq/23bc3c9801faea0f2d542cd4da95f846/Comfort_Hotel_Union_Brygge_-_Lobby_original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/3JEa43XfESO4V66MyqQnXb/f4cb0b63b2fdeb1299df6f8bf3c9c8e5/Comfort_Hotel_Union_Brygge_-_Barception_original?fm=webp&q=80&w=2560",
      ],

      amenities: [
        { id: "breakfast", label: "Breakfast Buffet", price: 260, icon: "🍳" },
        { id: "parking", label: "Free Parking", price: 0, icon: "🅿️" },
        { id: "late_checkout", label: "Late Checkout", price: 130, icon: "⏰" },
      ],

      rooms: {
        "single-drammen": {
          name: "Single Room",
          price: 850,
          capacity: 1,
          quantity: 18,
        },
        "double-drammen": {
          name: "Double Room",
          price: 1190,
          capacity: 2,
          quantity: 32,
        },
        "suite-drammen": {
          name: "Suite",
          price: 1990,
          capacity: 4,
          quantity: 8,
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
      hasSpa: false,
      hasEvents: false,

      images: [
        "https://images.ctfassets.net/nwbqij9m1jag/OpBfpZ99XYycy57pMz0SZ/e19c78b816fa8b2e411684c4c54be02e/Quality_Hotel_T%C3%B8nsberg_-_Exterior_-_Facade_original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/GYi2kHu4kqWiLpnNEw0fL/f9e331829f9d9d7949e6356a4ddae7d8/Quality_Hotel_T%C3%B8nsberg_-_Exterior_-_Building_original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/73O794QBG5qYZigrg0Mp1X/ebb151a18c35ad53d64b7406f741ee40/Quality_Hotel_T%C3%B8nsberg_-_Common_Area_-_Reception_original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/1Pt48mU62TH2yVt2NJ6Sbu/2bc8093869eaf1519ad45961ae0796b3/Quality_Hotel_T%C3%B8nsberg_-_Common_Area_-_Entrance_and_lounge_original?fm=webp&q=80&w=2560",
      ],

      amenities: [
        { id: "breakfast", label: "Breakfast Buffet", price: 240, icon: "🍳" },
        { id: "bike_rental", label: "Bike Rental", price: 100, icon: "🚲" },
        { id: "late_checkout", label: "Late Checkout", price: 120, icon: "⏰" },
      ],

      rooms: {
        "single-horten": {
          name: "Single Room",
          price: 820,
          capacity: 1,
          quantity: 15,
        },
        "double-horten": {
          name: "Double Room",
          price: 1150,
          capacity: 2,
          quantity: 25,
        },
        "suite-horten": {
          name: "Suite",
          price: 1890,
          capacity: 4,
          quantity: 6,
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
      hasSpa: true,
      hasEvents: true,

      images: [
        "https://images.ctfassets.net/nwbqij9m1jag/7EYZfPKCVskyXYT47eKhXn/68a0db46246508d0f6be731d7c4da02b/QH_Larvik_-_Front_of_Hotel_-_Pieno_-_Fotograf_Knut_Neerland_original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/11fcA9MyLy1KxnLCBN8CPl/4de48dcb1f1467922e900c7fd1f44320/QH_Larvik_-_Top_suiten_-_Terrace_View_-_Fotograf_Knut_Neerland_original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/6R5yCUOxFXkhZ7TyZjptpI/ed35de250c49e72cc22e53424b4220ad/Quality_Hotel_Grand_Larvik_-_Lobby_-_Social_area_original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/bTlQlthryOA1zJd2cv3oX/1db7d7f9ffcaf0af070d0c41fde64b5c/Quality_Hotel_Grand_Larvik_-_Lobby_-_Stairs__original?fm=webp&q=80&w=2560",
      ],

      amenities: [
        { id: "breakfast", label: "Breakfast Buffet", price: 270, icon: "🍳" },
        { id: "spa_access", label: "Spa Access", price: 360, icon: "♨️" },
        { id: "late_checkout", label: "Late Checkout", price: 140, icon: "⏰" },
        {
          id: "harbor_view",
          label: "Harbor View Upgrade",
          price: 180,
          icon: "🌊",
        },
      ],

      rooms: {
        "single-larvik": {
          name: "Single Room",
          price: 870,
          capacity: 1,
          quantity: 20,
        },
        "double-larvik": {
          name: "Double Room",
          price: 1240,
          capacity: 2,
          quantity: 35,
        },
        "suite-larvik": {
          name: "Suite",
          price: 2090,
          capacity: 4,
          quantity: 9,
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
      hasSpa: true,
      hasEvents: true,

      images: [
        "https://images.ctfassets.net/nwbqij9m1jag/7traNooH5WigTQiAW0yVM6/dcab7f75912b1562e4688c6f8963a35b/Comfort_Hotel_Trondheim_-_Facade_-_Hotel_Building_original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/3uA84UDjBYgUxsYbQad0WA/0a1a866661fec118973eb3d41436563d/Comfort_Hotel_Trondheim_-_Lobby_-_Barception_2_original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/18O2xM3zR1pmVyGW6mcJza/c8d617e9b207ca01bef6c32ce63c95f1/Comfort_Hotel_Trondheim_-_Lobby_-___original?fm=webp&q=80&w=2560",
        "https://images.ctfassets.net/nwbqij9m1jag/4qXiyCUukyt7DRR7gJqhjQ/d7b8eaa77a2aab409f7eb36f7c68da92/A_view_of_the_hotel_building_and_a_church_tower._original?fm=webp&q=80&w=2560",
      ],

      amenities: [
        { id: "breakfast", label: "Breakfast Buffet", price: 290, icon: "🍳" },
        { id: "spa_access", label: "Spa Access", price: 380, icon: "♨️" },
        { id: "bike_rental", label: "Bike Rental", price: 110, icon: "🚲" },
        { id: "late_checkout", label: "Late Checkout", price: 160, icon: "⏰" },
      ],

      rooms: {
        "single-trondheim": {
          name: "Single Room",
          price: 890,
          capacity: 1,
          quantity: 24,
        },
        "double-trondheim": {
          name: "Double Room",
          price: 1280,
          capacity: 2,
          quantity: 42,
        },
        "suite-trondheim": {
          name: "Suite",
          price: 2350,
          capacity: 4,
          quantity: 11,
        },
      },
    },
  };

  try {
    await set(ref(db, "hotels"), hotelsData);
    console.log(
      "✅ Seed fullført! Alle 6 hoteller med bilder, amenities og romkvantitet er lagt inn.",
    );
  } catch (error) {
    console.error("❌ Feil ved seeding:", error);
  }
};
