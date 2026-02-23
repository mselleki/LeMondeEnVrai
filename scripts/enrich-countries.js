/**
 * Enrich all countries with bestSeason, prices, rating, images.
 * Run: node scripts/enrich-countries.js
 * Uses Commons Redirect for image URLs (width=800).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../src/data/countries.sample.json');
const raw = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(raw);

// Commons direct thumb URLs (verified) or Redirect/file/FileName?width=800
const countryEnrichment = {
  FR: {
    bestSeason: "Avril à octobre (été agréable, festivals)",
    prices: { flight: "80–400 € A/R (Europe)", hotel: "80–250 € / nuit (Paris : plus élevé)", localCost: "Vie locale : modérée à élevée (resto 15–40 €)" },
    rating: 8.8,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/From_Louvre_to_the_Eiffel_Tower.jpg/800px-From_Louvre_to_the_Eiffel_Tower.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Paris_-_Eiffel_Tower.jpg/800px-Paris_-_Eiffel_Tower.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Eiffel_Tower_Paris.jpg/800px-Eiffel_Tower_Paris.jpg"
    ]
  },
  US: {
    bestSeason: "Avril à juin et septembre à octobre (éviter l’été très chaud au Sud)",
    prices: { flight: "500–1 200 € A/R (depuis Paris)", hotel: "100–300 € / nuit (villes)", localCost: "Vie locale : variable (resto 15–50 €)" },
    rating: 8.5,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Statue_of_Liberty,_NY.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Golden_Gate_Bridge_from_Battery_Spencer.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Grand_Canyon_from_Imperial_Point.jpg?width=800"
    ]
  },
  JP: {
    bestSeason: "Mars à mai (sakura) et octobre à novembre (feuillages)",
    prices: { flight: "700–1 200 € A/R (depuis Paris)", hotel: "80–200 € / nuit", localCost: "Vie locale : élevée (resto 15–40 €)" },
    rating: 9.0,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Mount_Fuji_from_Motorway.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tokyo_Tower_and_around_skyscrapers.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kinkaku-ji_in_autumn.jpg?width=800"
    ]
  },
  BR: {
    bestSeason: "Mai à septembre (sèche, Amazonie et côte)",
    prices: { flight: "600–1 100 € A/R (depuis Paris)", hotel: "50–150 € / nuit", localCost: "Vie locale : modérée (resto 8–25 €)" },
    rating: 8.3,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Christ_the_Redeemer_-_Cristo_Redentor.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ipanema_Beach_-_Rio_de_Janeiro.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Amazon_rainforest.jpg?width=800"
    ]
  },
  AU: {
    bestSeason: "Octobre à avril (été austral ; éviter l’hiver si plages)",
    prices: { flight: "1 000–1 800 € A/R (depuis Paris)", hotel: "100–250 € / nuit", localCost: "Vie locale : élevée (resto 15–35 €)" },
    rating: 8.6,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sydney_Opera_House_-_Dec_2008.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Uluru_sunset.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Great_Barrier_Reef_-_Coral.jpg?width=800"
    ]
  },
  CN: {
    bestSeason: "Avril à mai et septembre à octobre (éviter l’été étouffant)",
    prices: { flight: "500–1 000 € A/R (depuis Paris)", hotel: "50–150 € / nuit", localCost: "Vie locale : bon marché à modérée (resto 5–20 €)" },
    rating: 8.4,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Great_Wall_of_China_at_Jinshanling.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Forbidden_City_-_View_from_Coal_Hill.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Terracotta_Army,_Xi%27an,_China.jpg?width=800"
    ]
  },
  IN: {
    bestSeason: "Novembre à mars (saison sèche et fraîche)",
    prices: { flight: "450–900 € A/R (depuis Paris)", hotel: "30–120 € / nuit", localCost: "Vie locale : bon marché (resto 3–15 €)" },
    rating: 8.5,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/The_Taj_Mahal%2C_Agra%2C_Uttar_Pradesh%2C_India.jpg/800px-The_Taj_Mahal%2C_Agra%2C_Uttar_Pradesh%2C_India.jpg",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/India_Taj_Mahal_Close_Up_(3951787975).jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/VaranasikedarGhat.jpg?width=800"
    ]
  },
  GB: {
    bestSeason: "Mai à septembre (meilleur temps, festivals)",
    prices: { flight: "80–250 € A/R (depuis Paris)", hotel: "100–280 € / nuit (Londres)", localCost: "Vie locale : élevée (resto 18–45 €)" },
    rating: 8.6,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Big_Ben,_London_UK.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tower_Bridge_from_Shad_Thames.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Edinburgh_Castle_Rock.jpg?width=800"
    ]
  },
  DE: {
    bestSeason: "Mai à octobre (festivals, randonnée)",
    prices: { flight: "80–300 € A/R (depuis Paris)", hotel: "70–180 € / nuit", localCost: "Vie locale : modérée à élevée (resto 12–30 €)" },
    rating: 8.5,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Brandenburger_Tor_abends.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Neuschwanstein_Castle_from_Marienbrücke.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Cologne_Cathedral_-_South_Frontal_View.jpg?width=800"
    ]
  },
  IT: {
    bestSeason: "Avril à juin et septembre à octobre (éviter la canicule)",
    prices: { flight: "80–350 € A/R (depuis Paris)", hotel: "80–220 € / nuit", localCost: "Vie locale : modérée à élevée (resto 12–35 €)" },
    rating: 9.0,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg/800px-Colosseum_in_Rome%2C_Italy_-_April_2007.jpg",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Venice_Canals_-_Grand_Canal.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Florence_Cathedral_and_Piazza_del_Duomo.jpg?width=800"
    ]
  },
  ES: {
    bestSeason: "Avril à juin et septembre à octobre",
    prices: { flight: "80–350 € A/R (depuis Paris)", hotel: "60–180 € / nuit", localCost: "Vie locale : modérée (resto 10–25 €)" },
    rating: 8.7,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sagrada_Familia_01.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Plaza_Mayor,_Madrid.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Alhambra_Granada_Spain.jpg?width=800"
    ]
  },
  RU: {
    bestSeason: "Mai à septembre (hiver très froid)",
    prices: { flight: "250–600 € A/R (depuis Paris)", hotel: "60–180 € / nuit", localCost: "Vie locale : modérée (resto 10–25 €)" },
    rating: 8.2,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Saint_Basil%27s_Cathedral_and_Red_Square.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Peter_and_Paul_Fortress_in_St._Petersburg.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Hermitage_Museum_-_Winter_Palace.jpg?width=800"
    ]
  },
  CA: {
    bestSeason: "Juin à septembre (été) ; décembre à mars (ski)",
    prices: { flight: "400–900 € A/R (depuis Paris)", hotel: "90–220 € / nuit", localCost: "Vie locale : modérée à élevée (resto 15–40 €)" },
    rating: 8.6,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Niagara_Falls_Canadian_side.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Moraine_Lake_17092005.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/CN_Tower_from_the_air.jpg?width=800"
    ]
  },
  MX: {
    bestSeason: "Novembre à avril (saison sèche)",
    prices: { flight: "450–900 € A/R (depuis Paris)", hotel: "50–150 € / nuit", localCost: "Vie locale : bon marché à modérée (resto 6–20 €)" },
    rating: 8.4,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Chichen_Itza_3.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Mexico_City_Cathedral_and_Zocalo.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Playa_del_Carmen_Beach.jpg?width=800"
    ]
  },
  ZA: {
    bestSeason: "Mai à septembre (saison sèche, safari)",
    prices: { flight: "550–1 100 € A/R (depuis Paris)", hotel: "60–180 € / nuit", localCost: "Vie locale : modérée (resto 8–25 €)" },
    rating: 8.5,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Table_Mountain_from_Bloubergstrand.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kruger_National_Park_Lion.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Cape_of_Good_Hope_view.jpg?width=800"
    ]
  },
  EG: {
    bestSeason: "Octobre à avril (éviter l’été très chaud)",
    prices: { flight: "300–700 € A/R (depuis Paris)", hotel: "40–120 € / nuit", localCost: "Vie locale : bon marché (resto 5–15 €)" },
    rating: 8.6,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Giza_Pyramids_of_Khufu,_Khafre,_%26_Menkaure_(9793859336).jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sphinx_and_Great_Pyramid_of_Giza.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Karnak_Temple_Luxor_Egypt.jpg?width=800"
    ]
  },
  AR: {
    bestSeason: "Octobre à avril (été austral)",
    prices: { flight: "700–1 300 € A/R (depuis Paris)", hotel: "50–150 € / nuit", localCost: "Vie locale : modérée (resto 8–25 €)" },
    rating: 8.5,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Iguazu_Falls.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Buenos_Aires_Obelisk.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Perito_Moreno_Glacier.jpg?width=800"
    ]
  },
  KR: {
    bestSeason: "Avril à mai et septembre à novembre",
    prices: { flight: "650–1 100 € A/R (depuis Paris)", hotel: "70–180 € / nuit", localCost: "Vie locale : modérée (resto 10–25 €)" },
    rating: 8.4,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Seoul_N_Tower_at_night.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Gyeongbokgung_Palace_Seoul.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Busan_Haeundae_Beach.jpg?width=800"
    ]
  },
  TR: {
    bestSeason: "Avril à juin et septembre à octobre",
    prices: { flight: "250–550 € A/R (depuis Paris)", hotel: "50–140 € / nuit", localCost: "Vie locale : bon marché à modérée (resto 5–18 €)" },
    rating: 8.6,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Hagia_Sophia_Mars_2013.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Cappadocia_balloons.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pamukkale_Turkey.jpg?width=800"
    ]
  },
  SA: {
    bestSeason: "Novembre à mars (pèlerinage hors été)",
    prices: { flight: "400–900 € A/R (depuis Paris)", hotel: "80–250 € / nuit", localCost: "Vie locale : modérée à élevée (resto 10–30 €)" },
    rating: 7.8,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Masjid_al-Haram_and_Kaaba.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Riyadh_Kingdom_Tower.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Mada%27in_Saleh.jpg?width=800"
    ]
  },
  NL: {
    bestSeason: "Avril à mai (tulipes) et septembre",
    prices: { flight: "80–250 € A/R (depuis Paris)", hotel: "90–220 € / nuit (Amsterdam)", localCost: "Vie locale : élevée (resto 15–35 €)" },
    rating: 8.5,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Amsterdam_Canal_Houses.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Keukenhof_tulips.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kinderdijk_windmills.jpg?width=800"
    ]
  },
  PT: {
    bestSeason: "Avril à octobre (été méditerranéen)",
    prices: { flight: "80–300 € A/R (depuis Paris)", hotel: "60–160 € / nuit", localCost: "Vie locale : modérée (resto 10–25 €)" },
    rating: 8.6,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Praca_do_Comercio_Lisboa.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Porto_Douro_river.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Algarve_Beach_Portugal.jpg?width=800"
    ]
  },
  MA: {
    bestSeason: "Mars à mai et septembre à novembre",
    prices: { flight: "150–450 € A/R (depuis Paris)", hotel: "50–150 € / nuit", localCost: "Vie locale : bon marché à modérée (resto 5–18 €)" },
    rating: 8.5,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Marrakech_Morocco_Mosque.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Chefchaouen_blue_streets.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Fes_medina_Morocco.jpg?width=800"
    ]
  },
  GR: {
    bestSeason: "Avril à juin et septembre à octobre",
    prices: { flight: "120–400 € A/R (depuis Paris)", hotel: "60–180 € / nuit", localCost: "Vie locale : modérée (resto 10–25 €)" },
    rating: 8.8,
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Parthenon_from_south.jpg/800px-Parthenon_from_south.jpg",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Santorini_Oia_sunset.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Mykonos_windmills.jpg?width=800"
    ]
  },
  PL: {
    bestSeason: "Mai à septembre",
    prices: { flight: "80–300 € A/R (depuis Paris)", hotel: "55–140 € / nuit", localCost: "Vie locale : bon marché à modérée (resto 8–22 €)" },
    rating: 8.3,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Warsaw_Old_Town_Market_Square.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Krakow_Main_Market_Square.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Malbork_Castle_Poland.jpg?width=800"
    ]
  },
  TH: {
    bestSeason: "Novembre à février (saison fraîche et sèche)",
    prices: { flight: "550–1 000 € A/R (depuis Paris)", hotel: "40–120 € / nuit", localCost: "Vie locale : bon marché (resto 4–15 €)" },
    rating: 8.6,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Grand_Palace_Bangkok.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Wat_Arun_Bangkok.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Phi_Phi_Islands_Thailand.jpg?width=800"
    ]
  },
  ID: {
    bestSeason: "Avril à octobre (saison sèche) ; Bali toute l’année",
    prices: { flight: "600–1 100 € A/R (depuis Paris)", hotel: "35–120 € / nuit", localCost: "Vie locale : bon marché (resto 3–12 €)" },
    rating: 8.5,
    images: [
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Borobudur_Temple_Indonesia.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bali rice terraces Tegalalang.jpg?width=800",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Komodo_dragon_Indonesia.jpg?width=800"
    ]
  }
  // OM, UZ already have full data in JSON
};

for (const country of data.countries) {
  const code = country.id;
  const enrich = countryEnrichment[code];
  if (enrich) {
    country.bestSeason = enrich.bestSeason;
    country.prices = enrich.prices;
    country.rating = enrich.rating;
    country.images = enrich.images;
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Enriched countries.sample.json with bestSeason, prices, rating, images for all countries.');
