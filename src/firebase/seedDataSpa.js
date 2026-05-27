import { ref, set } from "firebase/database";
import { db } from "./config"; 


const newSpaData = [
  {
    name: "Arktisk Mineralsteinmassasje",
    Description:
      "Deep tissue massage using warm volcanic basalt stones and cooling Arctic minerals. This treatment relieves muscle tension and restores unique thermal balance.",
    Duration: "90 min",
    Price: 1490,
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
  },
  {
    name: "Fjord Algae Ritual",
    Description:
      "A luxury body treatment inspired by Norwegian coastal culture using deep-sea algae. Following a sea salt exfoliation, it leaves your skin radiant and deeply hydrated.",
    Duration: "75 min",
    Price: 1290,
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
  },
  {
    name: "Nordlys Ansiktsbehandling",
    Description:
      "A transforming facial using extracts of Arctic berries and Norwegian reindeer moss. It combines light therapy and cryotherapy to firm and refresh your skin.",
    Duration: "60 min",
    Price: 990,
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80",
  },
  {
    name: "Scandinavian Birch Ritual",
    Description:
      "A full-body experience deeply rooted in the traditional Nordic sauna culture. Enjoy a refreshing birch sugar scrub followed by a soothing warm oil massage.",
    Duration: "120 min",
    Price: 1890,
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80",
  },
];

export const seedNewDatabaseData = async () => {
  try {
    await set(ref(db, "Spa/treatments"), newSpaData);
    console.log(" Spa-behandlinger lagt inn i 'Spa/treatments'!");
  } catch (error) {
    console.error(" Feil ved innsending av spa-data:", error);
    throw error;
  }
};