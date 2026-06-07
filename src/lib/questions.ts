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
  {
    id: "area",
    cat: "Geography",
    q: "Largest countries by area",
    basis: "By total land + water area",
    items: L(
      "Russia", "Canada", "China", ["United States", "USA"], "Brazil",
      "Australia", "India", "Argentina", "Kazakhstan", "Algeria",
      "DR Congo", "Saudi Arabia", "Mexico", "Indonesia", "Sudan",
      "Libya", "Iran", "Mongolia", "Peru", "Chad",
      "Niger", "Angola", "Mali", "South Africa", "Colombia",
      "Ethiopia", "Bolivia", "Mauritania", "Egypt", "Tanzania"
    ),
    aliases: {
      "United States": ["usa", "us", "america"],
      "DR Congo": ["congo", "drc"],
    },
  },
  {
    id: "films",
    cat: "Movies",
    q: "Highest-grossing films of all time",
    basis: "By worldwide box office, unadjusted",
    items: L(
      "Avatar", ["Avengers: Endgame", "Endgame"], ["Avatar: The Way of Water", "Avatar 2"], "Titanic", ["Star Wars: The Force Awakens", "The Force Awakens"],
      ["Avengers: Infinity War", "Infinity War"], ["Spider-Man: No Way Home", "No Way Home"], "Inside Out 2", "Jurassic World", ["The Lion King", "2019 remake"],
      "The Avengers", "Furious 7", ["Top Gun: Maverick", "Maverick"], "Frozen II", "Barbie",
      ["Avengers: Age of Ultron", "Age of Ultron"], "The Super Mario Bros. Movie", "Black Panther", ["Harry Potter and the Deathly Hallows – Part 2", "Deathly Hallows 2"], ["Star Wars: The Last Jedi", "The Last Jedi"],
      "Jurassic World: Fallen Kingdom", "Frozen", ["Beauty and the Beast", "2017 remake"], "Incredibles 2", "The Fate of the Furious",
      "Iron Man 3", "Minions", ["Captain America: Civil War", "Civil War"], "Aquaman", ["The Lord of the Rings: The Return of the King", "Return of the King"]
    ),
    aliases: {
      "Avengers: Endgame": ["endgame", "avengers endgame"],
      "Avatar: The Way of Water": ["avatar 2", "way of water"],
      "Star Wars: The Force Awakens": ["force awakens", "star wars force awakens"],
      "Avengers: Infinity War": ["infinity war"],
      "Spider-Man: No Way Home": ["no way home", "spiderman no way home"],
      "The Lion King": ["lion king"],
      "Top Gun: Maverick": ["top gun maverick", "maverick"],
      "The Super Mario Bros. Movie": ["mario movie", "super mario movie", "mario bros movie"],
      "Harry Potter and the Deathly Hallows – Part 2": ["deathly hallows 2", "deathly hallows part 2"],
      "Star Wars: The Last Jedi": ["last jedi"],
      "Beauty and the Beast": ["beauty and the beast"],
      "Captain America: Civil War": ["civil war"],
      "The Lord of the Rings: The Return of the King": ["return of the king", "lotr return of the king"],
    },
  },
  {
    id: "games",
    cat: "Games",
    q: "Best-selling video games of all time",
    basis: "By units sold, approximate",
    items: L(
      "Minecraft", ["Grand Theft Auto V", "GTA V"], "Tetris", "Wii Sports", ["PUBG: Battlegrounds", "PUBG"],
      ["Mario Kart 8", "incl. Deluxe"], "Red Dead Redemption 2", ["The Witcher 3", "Wild Hunt"], "Terraria", "Super Mario Bros.",
      ["The Legend of Zelda: Breath of the Wild", "BOTW"], "Animal Crossing: New Horizons", "Human: Fall Flat", ["Pokémon Red/Green/Blue", "Gen 1"], "New Super Mario Bros.",
      "Diablo III", "Wii Sports Resort", "Pac-Man", "New Super Mario Bros. Wii", "Elden Ring",
      ["The Elder Scrolls V: Skyrim", "Skyrim"], "Borderlands 2", "FIFA 18", "Grand Theft Auto: San Andreas", "Super Mario Odyssey",
      "Wii Fit", "Kinect Adventures!", "Call of Duty: Black Ops", "Grand Theft Auto IV", "Super Smash Bros. Ultimate"
    ),
    aliases: {
      "Grand Theft Auto V": ["gta v", "gta 5", "gta5", "gta"],
      "PUBG: Battlegrounds": ["pubg", "playerunknowns battlegrounds"],
      "Mario Kart 8": ["mario kart", "mario kart 8 deluxe"],
      "Red Dead Redemption 2": ["rdr2", "red dead 2", "red dead redemption 2"],
      "The Witcher 3": ["witcher 3", "the witcher 3", "wild hunt"],
      "The Legend of Zelda: Breath of the Wild": ["breath of the wild", "botw", "zelda breath of the wild"],
      "Animal Crossing: New Horizons": ["animal crossing"],
      "Pokémon Red/Green/Blue": ["pokemon red", "pokemon blue", "pokemon"],
      "The Elder Scrolls V: Skyrim": ["skyrim"],
      "Grand Theft Auto: San Andreas": ["san andreas", "gta san andreas"],
      "Super Mario Odyssey": ["mario odyssey"],
      "Call of Duty: Black Ops": ["black ops", "cod black ops"],
      "Grand Theft Auto IV": ["gta iv", "gta 4"],
      "Super Smash Bros. Ultimate": ["smash ultimate", "super smash bros"],
    },
  },
  {
    id: "cities",
    cat: "World",
    q: "Most populous cities in the world",
    basis: "By urban-area population",
    items: L(
      "Tokyo", "Delhi", "Shanghai", "Dhaka", ["São Paulo", "Brazil"],
      "Mexico City", "Cairo", "Beijing", "Mumbai", "Osaka",
      "Karachi", "Chongqing", "Istanbul", "Buenos Aires", "Kolkata",
      "Lagos", "Kinshasa", "Manila", "Tianjin", "Rio de Janeiro",
      "Guangzhou", "Lahore", ["Bangalore", "Bengaluru"], "Shenzhen", "Moscow",
      "Chennai", "Bogotá", "Jakarta", "Lima", "Paris"
    ),
    aliases: {
      "São Paulo": ["sao paulo"],
      "Mexico City": ["mexico"],
      "Rio de Janeiro": ["rio"],
      "Bangalore": ["bengaluru"],
      "Bogotá": ["bogota"],
    },
  },
  {
    id: "languages",
    cat: "Language",
    q: "Most spoken languages in the world",
    basis: "By total speakers, approximate",
    items: L(
      "English", ["Mandarin Chinese", "Mandarin"], "Hindi", "Spanish", "French",
      "Arabic", "Bengali", "Portuguese", "Russian", "Urdu",
      "Indonesian", "German", "Japanese", "Nigerian Pidgin", "Marathi",
      "Telugu", "Turkish", "Tamil", ["Cantonese", "Yue"], "Vietnamese",
      "Wu Chinese", "Tagalog", "Korean", ["Persian", "Farsi"], "Hausa",
      "Swahili", "Javanese", "Italian", ["Western Punjabi", "Punjabi"], "Gujarati"
    ),
    aliases: {
      "Mandarin Chinese": ["mandarin", "chinese"],
      "Cantonese": ["yue"],
      "Persian": ["farsi"],
      "Western Punjabi": ["punjabi"],
    },
  },
  {
    id: "in-states",
    cat: "India",
    q: "Most populous states in India",
    basis: "By population, 2011 census & estimates",
    items: L(
      ["Uttar Pradesh", "UP"], "Maharashtra", "Bihar", ["West Bengal", "Bengal"], ["Madhya Pradesh", "MP"],
      "Tamil Nadu", "Rajasthan", "Karnataka", "Gujarat", ["Andhra Pradesh", "AP"],
      "Odisha", "Telangana", "Kerala", "Jharkhand", "Assam",
      "Punjab", "Chhattisgarh", "Haryana", ["Delhi", "NCT"], ["Jammu & Kashmir", "J&K"],
      "Uttarakhand", "Himachal Pradesh", "Tripura", "Meghalaya", "Manipur",
      "Nagaland", "Goa", "Arunachal Pradesh", "Mizoram", "Sikkim"
    ),
    aliases: {
      "Uttar Pradesh": ["up"],
      "Madhya Pradesh": ["mp"],
      "Andhra Pradesh": ["ap"],
      "Tamil Nadu": ["tn"],
      "West Bengal": ["bengal", "wb"],
      "Jammu & Kashmir": ["kashmir", "j and k", "jk"],
      "Delhi": ["new delhi"],
    },
  },
  {
    id: "in-cities",
    cat: "India",
    q: "Most populous cities in India",
    basis: "By city population, 2011 census",
    items: L(
      ["Mumbai", "Bombay"], "Delhi", ["Bangalore", "Bengaluru"], "Hyderabad", "Ahmedabad",
      ["Chennai", "Madras"], ["Kolkata", "Calcutta"], "Surat", "Pune", "Jaipur",
      "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
      "Bhopal", ["Visakhapatnam", "Vizag"], "Patna", ["Vadodara", "Baroda"], "Ghaziabad",
      "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut",
      "Rajkot", ["Varanasi", "Banaras"], "Srinagar", "Aurangabad", "Dhanbad"
    ),
    aliases: {
      "Mumbai": ["bombay"],
      "Bangalore": ["bengaluru"],
      "Chennai": ["madras"],
      "Kolkata": ["calcutta"],
      "Visakhapatnam": ["vizag", "vishakhapatnam"],
      "Vadodara": ["baroda"],
      "Varanasi": ["banaras", "benares", "kashi"],
    },
  },
  {
    id: "in-films",
    cat: "India",
    q: "Highest-grossing Indian films",
    basis: "By worldwide gross, approximate",
    items: L(
      "Dangal", ["Baahubali 2: The Conclusion", "Bahubali 2"], "RRR", ["KGF: Chapter 2", "KGF 2"], "Pathaan",
      "Jawan", ["Baahubali: The Beginning", "Bahubali 1"], "Kalki 2898 AD", "Animal", "Stree 2",
      "Secret Superstar", "PK", "Gadar 2", "Salaar", "Jailer",
      "Sanju", "Tiger Zinda Hai", "Padmaavat", ["2.0", "Robot 2"], "Sultan",
      "War", "Chennai Express", "Bajrangi Bhaijaan", ["Pushpa: The Rise", "Pushpa"], "Kabir Singh",
      "Brahmastra", "Tanhaji", "Dhoom 3", "Saaho", "Krrish 3"
    ),
    aliases: {
      "Baahubali 2: The Conclusion": ["bahubali 2", "baahubali 2"],
      "KGF: Chapter 2": ["kgf 2", "kgf chapter 2"],
      "Baahubali: The Beginning": ["bahubali", "baahubali", "bahubali 1"],
      "2.0": ["robot 2", "2 point 0"],
      "Pushpa: The Rise": ["pushpa"],
    },
  },
  {
    id: "in-area",
    cat: "India",
    q: "Largest states in India by area",
    basis: "By area",
    items: L(
      "Rajasthan", ["Madhya Pradesh", "MP"], "Maharashtra", ["Uttar Pradesh", "UP"], "Gujarat",
      "Karnataka", ["Andhra Pradesh", "AP"], "Odisha", "Chhattisgarh", "Tamil Nadu",
      "Telangana", "Bihar", ["West Bengal", "Bengal"], "Arunachal Pradesh", "Jharkhand",
      "Assam", "Himachal Pradesh", "Uttarakhand", "Punjab", "Haryana",
      "Kerala", "Meghalaya", "Manipur", "Mizoram", "Nagaland",
      "Tripura", "Sikkim", "Goa", ["Delhi", "NCT"], ["Jammu & Kashmir", "J&K"]
    ),
    aliases: {
      "Uttar Pradesh": ["up"],
      "Madhya Pradesh": ["mp"],
      "Andhra Pradesh": ["ap"],
      "Tamil Nadu": ["tn"],
      "West Bengal": ["bengal", "wb"],
      "Jammu & Kashmir": ["kashmir", "jk"],
    },
  },
  {
    id: "mountains",
    cat: "Nature",
    q: "Tallest mountains in the world",
    basis: "By height above sea level",
    items: L(
      ["Everest", "Nepal/China"], "K2", "Kangchenjunga", "Lhotse", "Makalu",
      "Cho Oyu", "Dhaulagiri", "Manaslu", "Nanga Parbat", "Annapurna",
      "Gasherbrum I", "Broad Peak", "Gasherbrum II", "Shishapangma", "Gyachung Kang",
      "Annapurna II", "Gasherbrum III", "Gasherbrum IV", "Himalchuli", "Distaghil Sar",
      "Ngadi Chuli", "Nuptse", "Khunyang Chhish", "Masherbrum", "Nanda Devi",
      "Chomo Lonzo", "Batura Sar", "Kanjut Sar", "Rakaposhi", "Namcha Barwa"
    ),
    aliases: {
      "Everest": ["mount everest", "sagarmatha", "chomolungma"],
    },
  },
  {
    id: "rivers",
    cat: "Nature",
    q: "Longest rivers in the world",
    basis: "By length, approximate",
    items: L(
      "Nile", "Amazon", "Yangtze", "Mississippi", "Yenisei",
      ["Yellow River", "Huang He"], "Ob", "Paraná", "Congo", "Amur",
      "Lena", "Mekong", "Mackenzie", "Niger", "Brahmaputra",
      "Murray", "Volga", "Indus", "Madeira", "Yukon",
      "São Francisco", "Syr Darya", "Salween", "Saint Lawrence", "Rio Grande",
      "Danube", "Euphrates", "Ganges", "Zambezi", "Amu Darya"
    ),
    aliases: {
      "Yellow River": ["huang he"],
      "Saint Lawrence": ["st lawrence"],
      "Ganges": ["ganga"],
    },
  },
  {
    id: "animated",
    cat: "Movies",
    q: "Highest-grossing animated films",
    basis: "By worldwide box office",
    items: L(
      "Inside Out 2", ["The Super Mario Bros. Movie", "Mario Movie"], "Frozen II", "Incredibles 2", "Minions",
      "Toy Story 4", "Toy Story 3", "Frozen", "Despicable Me 3", "Finding Dory",
      "Zootopia", "Despicable Me 2", "Moana 2", "Inside Out", "Coco",
      "Shrek 2", "Minions: The Rise of Gru", "Sing", "The Secret Life of Pets", "Despicable Me",
      "Kung Fu Panda 2", "Finding Nemo", "Shrek the Third", "Shrek Forever After", "Up",
      "Madagascar 3", "Monsters University", "How to Train Your Dragon 2", "Big Hero 6", "Ne Zha 2"
    ),
    aliases: {
      "The Super Mario Bros. Movie": ["mario movie", "super mario movie"],
    },
  },
  {
    id: "youtube",
    cat: "Internet",
    q: "Most-subscribed YouTube channels",
    basis: "By subscribers, as of 2024",
    items: L(
      "MrBeast", "T-Series", "Cocomelon", "SET India", "Kids Diana Show",
      "Vlad and Niki", "Like Nastya", "PewDiePie", "Zee Music Company", "WWE",
      "Sony SAB", "5-Minute Crafts", "Goldmines", "Colors TV", "Sony Entertainment Television",
      "BangtanTV", "Justin Bieber", "Pinkfong", "Marshmello", "El Reino Infantil",
      "BLACKPINK", "ChuChu TV", "Movieclips", "Aaj Tak", "HYBE Labels",
      "Taylor Swift", "Dude Perfect", "Wave Music", "Badabun", "T-Series Bhakti Sagar"
    ),
    aliases: {
      "MrBeast": ["mr beast"],
      "BangtanTV": ["bts"],
    },
  },
  {
    id: "instagram",
    cat: "Internet",
    q: "Most-followed Instagram accounts",
    basis: "By followers, approximate",
    items: L(
      "Instagram", ["Cristiano Ronaldo", "CR7"], "Lionel Messi", "Selena Gomez", "Kylie Jenner",
      ["Dwayne Johnson", "The Rock"], "Ariana Grande", "Kim Kardashian", "Beyoncé", "Khloé Kardashian",
      "Justin Bieber", "Kendall Jenner", "Nike", "Taylor Swift", "Virat Kohli",
      "Jennifer Lopez", "Nicki Minaj", "Neymar", "National Geographic", "Kourtney Kardashian",
      "Miley Cyrus", "Katy Perry", "Zendaya", "Kevin Hart", "Cardi B",
      "Real Madrid", "FC Barcelona", "Demi Lovato", "Rihanna", "Drake"
    ),
    aliases: {
      "Cristiano Ronaldo": ["ronaldo", "cr7"],
      "Lionel Messi": ["messi"],
      "Dwayne Johnson": ["the rock"],
    },
  },
  {
    id: "music",
    cat: "Music",
    q: "Best-selling music artists",
    basis: "By record sales, approximate",
    items: L(
      ["The Beatles", "Beatles"], "Elvis Presley", "Michael Jackson", "Elton John", "Queen",
      "Madonna", "Led Zeppelin", "Rihanna", "Pink Floyd", "Eminem",
      "Taylor Swift", "Mariah Carey", "Whitney Houston", "Drake", "Celine Dion",
      "AC/DC", "The Rolling Stones", "ABBA", "Garth Brooks", "Adele",
      "U2", "Billy Joel", "Bruno Mars", "Frank Sinatra", "Barbra Streisand",
      "Ed Sheeran", "Metallica", "Beyoncé", "Justin Bieber", "Phil Collins"
    ),
    aliases: {
      "The Beatles": ["beatles"],
      "The Rolling Stones": ["rolling stones"],
    },
  },
  {
    id: "companies",
    cat: "Business",
    q: "Largest companies by market value",
    basis: "By market cap, approximate",
    items: L(
      "Apple", "Microsoft", "Nvidia", ["Alphabet", "Google"], "Amazon",
      ["Saudi Aramco", "Aramco"], ["Meta", "Facebook"], "Berkshire Hathaway", ["TSMC", "Taiwan Semiconductor"], "Eli Lilly",
      "Broadcom", "Tesla", "Walmart", "JPMorgan Chase", "Visa",
      "Tencent", "Mastercard", "Exxon Mobil", "Oracle", "Costco",
      "Johnson & Johnson", "Home Depot", "Procter & Gamble", "Netflix", "Bank of America",
      "AbbVie", "Samsung", "Coca-Cola", "Chevron", "ASML"
    ),
    aliases: {
      "Alphabet": ["google"],
      "Meta": ["facebook"],
      "Saudi Aramco": ["aramco"],
      "TSMC": ["taiwan semiconductor"],
      "JPMorgan Chase": ["jpmorgan", "jp morgan"],
    },
  },
  {
    id: "olympics",
    cat: "Sports",
    q: "Most Olympic gold medals by country",
    basis: "Summer Olympics, all-time",
    items: L(
      ["United States", "USA"], ["Soviet Union", "USSR"], "Germany", ["Great Britain", "UK"], "China",
      "France", "Italy", "Hungary", "East Germany", "Sweden",
      "Australia", "Japan", "Russia", "Finland", "Netherlands",
      "Romania", "South Korea", "Cuba", "Norway", "Poland",
      "Canada", "Switzerland", "Denmark", "Bulgaria", "Czechoslovakia",
      "Spain", "Brazil", "Kenya", "Jamaica", "New Zealand"
    ),
    aliases: {
      "United States": ["usa", "us", "america"],
      "Soviet Union": ["ussr", "soviet"],
      "Great Britain": ["uk", "britain", "england"],
      "South Korea": ["korea"],
    },
  },
  {
    id: "books",
    cat: "Books",
    q: "Best-selling books of all time",
    basis: "By copies sold, approximate",
    items: L(
      "Don Quixote", "A Tale of Two Cities", ["The Lord of the Rings", "LOTR"], "The Little Prince", ["Harry Potter and the Philosopher's Stone", "Sorcerer's Stone"],
      "And Then There Were None", "Dream of the Red Chamber", "The Hobbit", "Alice's Adventures in Wonderland", "The Lion, the Witch and the Wardrobe",
      "She: A History of Adventure", "The Da Vinci Code", "Think and Grow Rich", "The Catcher in the Rye", "The Alchemist",
      "Heidi", "To Kill a Mockingbird", "Anne of Green Gables", "Charlotte's Web", "The Name of the Rose",
      "Fifty Shades of Grey", "Watership Down", "One Hundred Years of Solitude", "Gone with the Wind", "War and Peace",
      "The Diary of a Young Girl", "Lolita", "Black Beauty", "Angels & Demons", "The Bridges of Madison County"
    ),
    aliases: {
      "The Lord of the Rings": ["lotr", "lord of the rings"],
      "The Little Prince": ["le petit prince"],
      "Harry Potter and the Philosopher's Stone": ["harry potter", "philosophers stone", "sorcerers stone"],
      "The Diary of a Young Girl": ["anne frank", "diary of anne frank"],
    },
  },
];

export type CuratedTheme = {
  name: string;
  blurb: string;
  ids: string[];
};

export const CURATED_THEMES: CuratedTheme[] = [
  { name: "World & Geography", blurb: "Countries, cities, places", ids: ["countries", "area", "cities", "states"] },
  { name: "Nature & Science", blurb: "Mountains, rivers, elements", ids: ["mountains", "rivers", "elements", "languages"] },
  { name: "India", blurb: "States, cities, cinema", ids: ["in-states", "in-cities", "in-area", "in-films"] },
  { name: "Movies", blurb: "Box-office giants", ids: ["franchises", "films", "animated"] },
  { name: "Pop Culture", blurb: "Games, music, the internet", ids: ["games", "music", "youtube", "instagram"] },
  { name: "Money & Records", blurb: "Business, sport, books, towers", ids: ["companies", "olympics", "books", "buildings"] },
];

const QUESTION_BY_ID = new Map(CURATED_QUESTIONS.map((q) => [q.id, q]));

export const CURATED_THEME_GROUPS = CURATED_THEMES.map((theme) => ({
  name: theme.name,
  blurb: theme.blurb,
  questions: theme.ids
    .map((id) => QUESTION_BY_ID.get(id))
    .filter((q): q is CuratedQuestion => Boolean(q)),
}));
