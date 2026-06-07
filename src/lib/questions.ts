export type QuestionItem = {
  rank: number;
  name: string;
  note?: string;
};

export type CuratedQuestion = {
  id: string;
  cat: string;
  q: string;
  basis: string;
  items: QuestionItem[];
  aliases?: Record<string, string[]>;
};

function L(...names: (string | [string, string])[]): QuestionItem[] {
  return names.map((n, i) =>
    Array.isArray(n) ? { rank: i + 1, name: n[0], note: n[1] } : { rank: i + 1, name: n }
  );
}

export const CURATED_QUESTIONS: CuratedQuestion[] = [
  {
    id: "countries",
    cat: "Geography",
    q: "Most populous countries in the world",
    basis: "By estimated population, 2024",
    items: L(
      "India", "China", ["United States", "USA"], "Indonesia", "Pakistan",
      "Nigeria", "Brazil", "Bangladesh", "Russia", "Mexico",
      "Japan", "Ethiopia", "Philippines", "Egypt", "DR Congo",
      "Vietnam", "Iran", "Turkey", "Germany", "Thailand",
      ["United Kingdom", "UK"], "France", "Tanzania", "South Africa", "Italy",
      "Kenya", "Myanmar", "Colombia", "South Korea", "Uganda"
    ),
    aliases: {
      "United States": ["usa", "us", "america", "united states of america"],
      "United Kingdom": ["uk", "britain", "great britain", "england"],
      "DR Congo": ["congo", "drc", "democratic republic of the congo"],
      "South Korea": ["korea"],
    },
  },
  {
    id: "franchises",
    cat: "Movies",
    q: "Highest-grossing movie franchises",
    basis: "By worldwide box office, all-time",
    items: L(
      ["Marvel Cinematic Universe", "MCU"], "Star Wars", ["Wizarding World", "Harry Potter"], "Avengers", "Spider-Man",
      "James Bond", ["The Lord of the Rings", "Middle-earth"], "Fast & Furious", "Jurassic Park", ["Despicable Me", "Minions"],
      "Batman", "Transformers", "Pirates of the Caribbean", "The Hunger Games", "Toy Story",
      "X-Men", "Shrek", "Mission: Impossible", ["DC Extended Universe", "DCEU"], "The Twilight Saga",
      "Frozen", "Indiana Jones", "Ice Age", "The Conjuring", "Madagascar",
      "Rocky / Creed", "Planet of the Apes", "The Lion King", "Finding Nemo", "Kung Fu Panda"
    ),
    aliases: {
      "Marvel Cinematic Universe": ["mcu", "marvel"],
      "Wizarding World": ["harry potter", "wizarding"],
      "The Lord of the Rings": ["lotr", "lord of the rings", "middle earth", "middle-earth"],
      "DC Extended Universe": ["dceu", "dc"],
      "Despicable Me": ["minions"],
      "Mission: Impossible": ["mission impossible"],
    },
  },
  {
    id: "states",
    cat: "USA",
    q: "Most populous U.S. states",
    basis: "By population, 2024 estimates",
    items: L(
      "California", "Texas", "Florida", "New York", "Pennsylvania",
      "Illinois", "Ohio", "Georgia", "North Carolina", "Michigan",
      "New Jersey", "Virginia", "Washington", "Arizona", "Tennessee",
      "Massachusetts", "Indiana", "Missouri", "Maryland", "Wisconsin",
      "Colorado", "Minnesota", "South Carolina", "Alabama", "Louisiana",
      "Kentucky", "Oregon", "Oklahoma", "Connecticut", "Utah"
    ),
    aliases: {
      "California": ["cali"],
      "North Carolina": ["nc"],
      "South Carolina": ["sc"],
      "New York": ["ny"],
      "New Jersey": ["nj"],
    },
  },
  {
    id: "buildings",
    cat: "Architecture",
    q: "Tallest completed buildings in the world",
    basis: "By architectural height",
    items: L(
      ["Burj Khalifa", "Dubai"], ["Merdeka 118", "Kuala Lumpur"], ["Shanghai Tower", "Shanghai"],
      ["Abraj Al-Bait", "Mecca"], ["Ping An Finance Center", "Shenzhen"],
      ["Lotte World Tower", "Seoul"], ["One World Trade Center", "New York"],
      ["Guangzhou CTF", "Guangzhou"], ["Tianjin CTF", "Tianjin"], ["CITIC Tower", "Beijing"],
      ["Taipei 101", "Taipei"], ["Shanghai World Financial Center", "Shanghai"],
      ["International Commerce Centre", "Hong Kong"], ["Central Park Tower", "New York"],
      ["Lakhta Center", "St Petersburg"], ["Landmark 81", "Ho Chi Minh City"],
      ["Changsha IFS Tower", "Changsha"], ["Petronas Tower 1", "Kuala Lumpur"],
      ["Petronas Tower 2", "Kuala Lumpur"], ["Zifeng Tower", "Nanjing"],
      ["The Exchange 106", "Kuala Lumpur"], ["Wuhan Center", "Wuhan"],
      ["Willis Tower", "Chicago"], ["KK100", "Shenzhen"], ["Guangzhou IFC", "Guangzhou"],
      ["111 West 57th Street", "New York"], ["One Vanderbilt", "New York"],
      ["432 Park Avenue", "New York"], ["Marina 101", "Dubai"], ["Trump Tower Chicago", "Chicago"]
    ),
    aliases: {
      "Burj Khalifa": ["burj"],
      "One World Trade Center": ["one wtc", "freedom tower", "1 wtc"],
      "Taipei 101": ["taipei"],
      "Willis Tower": ["sears tower", "sears"],
    },
  },
  {
    id: "elements",
    cat: "Science",
    q: "Most abundant elements in Earth's crust",
    basis: "By percentage of mass",
    items: L(
      "Oxygen", "Silicon", ["Aluminium", "Aluminum"], "Iron", "Calcium",
      "Sodium", "Potassium", "Magnesium", "Titanium", "Hydrogen",
      "Phosphorus", "Manganese", "Fluorine", "Barium", "Strontium",
      "Sulfur", "Carbon", "Zirconium", "Chlorine", "Vanadium",
      "Chromium", "Rubidium", "Nickel", "Zinc", "Copper",
      "Cerium", "Neodymium", "Lanthanum", "Yttrium", "Cobalt"
    ),
    aliases: { "Aluminium": ["aluminum"] },
  },
];
