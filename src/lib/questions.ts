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
    basis: "By population, 2025 estimates",
    items: L(
      "India", "China", ["United States", "USA"], "Indonesia", "Pakistan",
      "Nigeria", "Brazil", "Bangladesh", "Russia", "Mexico",
      "Ethiopia", "Japan", "Philippines", "Egypt", "DR Congo",
      "Vietnam", "Iran", "Turkey", "Germany", "Thailand",
      ["United Kingdom", "UK"], "Tanzania", "France", "South Africa", "Italy",
      "Kenya", "Myanmar", "Colombia", "South Korea", "Sudan"
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
    basis: "By architectural height, completed",
    items: L(
      ["Burj Khalifa", "Dubai"], ["Merdeka 118", "Kuala Lumpur"], ["Shanghai Tower", "Shanghai"],
      ["Mecca Royal Clock Tower", "Mecca"], ["Ping An Finance Centre", "Shenzhen"],
      ["Lotte World Tower", "Seoul"], ["One World Trade Center", "New York"],
      ["Guangzhou CTF", "Guangzhou"], ["Tianjin CTF", "Tianjin"], ["CITIC Tower", "Beijing"],
      ["Taipei 101", "Taipei"], ["Shanghai World Financial Center", "Shanghai"],
      ["International Commerce Centre", "Hong Kong"], ["Wuhan Greenland Center", "Wuhan"],
      ["Central Park Tower", "New York"], ["Lakhta Center", "St Petersburg"],
      ["Landmark 81", "Ho Chi Minh City"], ["International Land-Sea Center", "Chongqing"],
      ["The Exchange 106", "Kuala Lumpur"], ["Changsha IFS Tower", "Changsha"],
      ["Petronas Tower 1", "Kuala Lumpur"], ["Petronas Tower 2", "Kuala Lumpur"],
      ["Zifeng Tower", "Nanjing"], ["Suzhou IFS", "Suzhou"], ["Wuhan Center", "Wuhan"],
      ["Willis Tower", "Chicago"], ["KK100", "Shenzhen"], ["Guangzhou IFC", "Guangzhou"],
      ["111 West 57th Street", "New York"], ["Shandong IFC", "Jinan"]
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
      "Avatar", ["Avengers: Endgame", "Endgame"], ["Avatar: The Way of Water", "Avatar 2"], "Titanic", "Ne Zha 2",
      ["Star Wars: The Force Awakens", "The Force Awakens"], ["Avengers: Infinity War", "Infinity War"], ["Spider-Man: No Way Home", "No Way Home"], "Zootopia 2", "Inside Out 2",
      "Jurassic World", ["The Lion King", "2019 remake"], "The Avengers", "Furious 7", ["Top Gun: Maverick", "Maverick"],
      ["Avatar: Fire and Ash", "Avatar 3"], "Frozen II", "Barbie", ["Avengers: Age of Ultron", "Age of Ultron"], "The Super Mario Bros. Movie",
      "Black Panther", ["Harry Potter and the Deathly Hallows – Part 2", "Deathly Hallows 2"], ["Deadpool & Wolverine", "Deadpool 3"], ["Star Wars: The Last Jedi", "The Last Jedi"], "Jurassic World: Fallen Kingdom",
      "Frozen", ["Beauty and the Beast", "2017 remake"], "Incredibles 2", "The Fate of the Furious", "Iron Man 3"
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
      "Tetris", "Minecraft", ["Grand Theft Auto V", "GTA V"], "Red Dead Redemption 2", "Wii Sports",
      ["Mario Kart 8", "incl. Deluxe"], ["PUBG: Battlegrounds", "PUBG"], "Terraria", ["The Witcher 3", "Wild Hunt"], "Super Mario Bros.",
      "Human: Fall Flat", "Overwatch", "The Sims", "Stardew Valley", "Animal Crossing: New Horizons",
      ["Pokémon Red/Blue/Yellow", "Gen 1"], "Wii Fit", "Call of Duty: Black Ops III", "Call of Duty: Modern Warfare", "Hogwarts Legacy",
      "Payday 2", "Sonic the Hedgehog", "Super Smash Bros. Ultimate", "Mario Kart Wii", ["The Legend of Zelda: Breath of the Wild", "BOTW"],
      "Cyberpunk 2077", "Wii Sports Resort", "New Super Mario Bros.", "Super Mario Odyssey", "New Super Mario Bros. Wii"
    ),
    aliases: {
      "Grand Theft Auto V": ["gta v", "gta 5", "gta5", "gta"],
      "PUBG: Battlegrounds": ["pubg", "playerunknowns battlegrounds"],
      "Mario Kart 8": ["mario kart", "mario kart 8 deluxe"],
      "Red Dead Redemption 2": ["rdr2", "red dead 2", "red dead redemption 2"],
      "The Witcher 3": ["witcher 3", "the witcher 3", "wild hunt"],
      "The Legend of Zelda: Breath of the Wild": ["breath of the wild", "botw", "zelda breath of the wild"],
      "Animal Crossing: New Horizons": ["animal crossing"],
      "Pokémon Red/Blue/Yellow": ["pokemon red", "pokemon blue", "pokemon"],
      "Call of Duty: Black Ops III": ["black ops 3", "cod black ops", "black ops"],
      "Call of Duty: Modern Warfare": ["modern warfare", "cod mw"],
      "Super Mario Odyssey": ["mario odyssey"],
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
    basis: "By total speakers, Ethnologue 2026",
    items: L(
      "English", ["Mandarin Chinese", "Mandarin"], "Hindi", "Spanish", "Arabic",
      "French", "Bengali", "Portuguese", "Indonesian", "Urdu",
      "Russian", "German", "Japanese", "Nigerian Pidgin", "Egyptian Arabic",
      "Marathi", "Vietnamese", "Telugu", "Swahili", "Hausa",
      "Turkish", ["Western Punjabi", "Punjabi"], "Tagalog", "Tamil", ["Cantonese", "Yue"],
      "Wu Chinese", ["Persian", "Farsi"], "Korean", "Amharic", "Thai"
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
      "Dangal", ["Baahubali 2: The Conclusion", "Bahubali 2"], ["Pushpa 2: The Rule", "Pushpa 2"], "RRR", ["KGF: Chapter 2", "KGF 2"],
      "Jawan", "Pathaan", "Kalki 2898 AD", "Animal", "Bajrangi Bhaijaan",
      "Stree 2", "Secret Superstar", "Chhaava", "PK", ["2.0", "Robot 2"],
      "Gadar 2", "Sultan", "Salaar", "Jailer", ["Baahubali: The Beginning", "Bahubali 1"],
      "Leo", "Sanju", "Tiger Zinda Hai", "Padmaavat", "Dhoom 3",
      ["Kantara: Chapter 1", "Kantara"], "Saaho", "War", "Brahmastra", "Kabir Singh"
    ),
    aliases: {
      "Baahubali 2: The Conclusion": ["bahubali 2", "baahubali 2"],
      "Pushpa 2: The Rule": ["pushpa 2", "pushpa two"],
      "KGF: Chapter 2": ["kgf 2", "kgf chapter 2"],
      "Baahubali: The Beginning": ["bahubali", "baahubali", "bahubali 1"],
      "2.0": ["robot 2", "2 point 0"],
      "Kantara: Chapter 1": ["kantara"],
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
      "Ne Zha 2", "Zootopia 2", "Inside Out 2", ["The Lion King", "2019"], "Frozen II",
      ["The Super Mario Bros. Movie", "Mario Movie"], "Frozen", "Incredibles 2", "Minions", "Toy Story 4",
      "Toy Story 3", "Moana 2", "Despicable Me 3", "Finding Dory", "Zootopia",
      "Despicable Me 4", "Despicable Me 2", ["The Lion King (1994)", "original"], "Finding Nemo", "Minions: The Rise of Gru",
      "Shrek 2", "Ice Age: Dawn of the Dinosaurs", "The Secret Life of Pets", "Inside Out", "Coco",
      "Shrek the Third", "Demon Slayer: Infinity Castle", "Shrek Forever After", "Up", "Despicable Me"
    ),
    aliases: {
      "The Super Mario Bros. Movie": ["mario movie", "super mario movie"],
      "Ne Zha 2": ["nezha 2", "ne zha 2"],
    },
  },
  {
    id: "youtube",
    cat: "Internet",
    q: "Most-subscribed YouTube channels",
    basis: "By subscribers, as of 2026",
    items: L(
      "MrBeast", "T-Series", "Cocomelon", "SET India", "Vlad and Niki",
      "Stokes Twins", "Kids Diana Show", "KIMPRO", "Like Nastya", "Zee Music Company",
      "Alejo Igoa", "WWE", "PewDiePie", "Goldmines", "Sony SAB",
      "BLACKPINK", "Alan's Universe", "ChuChu TV", "Zee TV", "A4",
      "Topper Guild", "KL Bro Biju Rithvik", "Pinkfong Baby Shark", "BangtanTV", "Zam Zam Brothers",
      "Toys and Colors", "Colors TV", "T-Series Bhakti Sagar", "Tips Official", "HYBE Labels"
    ),
    aliases: {
      "MrBeast": ["mr beast"],
      "BangtanTV": ["bts", "bangtan tv"],
    },
  },
  {
    id: "instagram",
    cat: "Internet",
    q: "Most-followed Instagram accounts",
    basis: "By followers, approximate",
    items: L(
      "Instagram", ["Cristiano Ronaldo", "CR7"], "Lionel Messi", "Selena Gomez", ["Dwayne Johnson", "The Rock"],
      "Kylie Jenner", "Ariana Grande", "Kim Kardashian", "Beyoncé", "Khloé Kardashian",
      "Nike", "Justin Bieber", "Kendall Jenner", "Taylor Swift", "Virat Kohli",
      "National Geographic", "Jennifer Lopez", "Neymar", "Kourtney Kardashian", "Miley Cyrus",
      "Katy Perry", "Real Madrid", "Zendaya", "Kevin Hart", "Cardi B",
      ["LeBron James", "King James"], "Demi Lovato", "Rihanna", "FC Barcelona", "Chris Brown"
    ),
    aliases: {
      "Cristiano Ronaldo": ["ronaldo", "cr7"],
      "Lionel Messi": ["messi"],
      "Dwayne Johnson": ["the rock"],
      "LeBron James": ["lebron", "king james"],
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
    basis: "By market cap, late 2025 (approx)",
    items: L(
      "Nvidia", "Apple", ["Alphabet", "Google"], "Microsoft", "Amazon",
      ["TSMC", "Taiwan Semiconductor"], "Broadcom", ["Saudi Aramco", "Aramco"], ["Meta", "Facebook"], "Tesla",
      "Samsung", "Berkshire Hathaway", "Eli Lilly", "Micron Technology", "Walmart",
      "SK Hynix", "JPMorgan Chase", ["AMD", "Advanced Micro Devices"], "ASML", "Exxon Mobil",
      "Visa", "Oracle", "Johnson & Johnson", "Tencent", "Intel",
      "Cisco", "Mastercard", "Costco", "Caterpillar", "AbbVie"
    ),
    aliases: {
      "Alphabet": ["google"],
      "Meta": ["facebook"],
      "Saudi Aramco": ["aramco"],
      "TSMC": ["taiwan semiconductor"],
      "JPMorgan Chase": ["jpmorgan", "jp morgan"],
      "AMD": ["advanced micro devices"],
    },
  },
  {
    id: "olympics",
    cat: "Sports",
    q: "Most Olympic gold medals by country",
    basis: "Summer Olympic golds, all-time (through 2024)",
    items: L(
      ["United States", "USA"], ["Soviet Union", "USSR"], "China", ["Great Britain", "UK"], "France",
      "Italy", "Germany", "Hungary", "Japan", "Australia",
      "East Germany", "Sweden", "Russia", "Netherlands", "South Korea",
      "Finland", "Romania", "Cuba", "Poland", "Canada",
      "Bulgaria", "Czechoslovakia", "Spain", "Switzerland", "Denmark",
      "Brazil", "Norway", "Kenya", "Jamaica", "New Zealand"
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
  {
    id: "gdp",
    cat: "Economy",
    q: "Largest economies in the world by GDP",
    basis: "By nominal GDP, IMF 2024 estimates",
    items: L(
      ["United States", "USA"], "China", "Germany", "Japan", "India",
      ["United Kingdom", "UK"], "France", "Italy", "Brazil", "Canada",
      "Russia", ["South Korea", "Korea"], "Australia", "Mexico", "Spain",
      "Indonesia", "Netherlands", "Saudi Arabia", "Turkey", "Switzerland",
      "Taiwan", "Poland", "Sweden", "Belgium", "Argentina",
      "Norway", "Israel", ["United Arab Emirates", "UAE"], "Nigeria", "Singapore"
    ),
    aliases: {
      "United States": ["usa", "us", "america", "united states of america"],
      "United Kingdom": ["uk", "britain", "great britain", "england"],
      "South Korea": ["korea"],
      "United Arab Emirates": ["uae", "emirates"],
    },
  },
  {
    id: "gdp-capita",
    cat: "Economy",
    q: "Countries with the highest GDP per capita",
    basis: "By nominal GDP per capita, IMF 2024",
    items: L(
      "Luxembourg", "Singapore", "Ireland", "Switzerland", "Norway",
      "Qatar", ["United States", "USA"], "Iceland", "Denmark", "Australia",
      "Netherlands", "Sweden", "Austria", "Finland", "Belgium",
      ["United Arab Emirates", "UAE"], "Canada", "Germany", "New Zealand", ["United Kingdom", "UK"],
      "France", "San Marino", "Japan", "Malta", "Italy",
      ["South Korea", "Korea"], "Bahrain", ["Czech Republic", "Czechia"], "Spain", "Slovenia"
    ),
    aliases: {
      "United States": ["usa", "us", "america"],
      "United Kingdom": ["uk", "britain", "england"],
      "United Arab Emirates": ["uae", "emirates"],
      "Czech Republic": ["czechia", "czech"],
      "South Korea": ["korea"],
    },
  },
  {
    id: "billionaires",
    cat: "Economy",
    q: "World's wealthiest people",
    basis: "By net worth, Forbes 2025 (approx)",
    items: L(
      "Elon Musk", "Jeff Bezos", "Mark Zuckerberg", "Larry Ellison", "Bill Gates",
      "Warren Buffett", "Larry Page", "Sergey Brin", "Jensen Huang", "Steve Ballmer",
      "Mukesh Ambani", "Bernard Arnault", "Michael Dell", "Rob Walton", "Jim Walton",
      "Alice Walton", "Carlos Slim Helú", "Françoise Bettencourt Meyers", "Michael Bloomberg", "Gautam Adani",
      "MacKenzie Scott", "Phil Knight", "Zhong Shanshan", "Zhang Yiming", "Ken Griffin",
      "Stephen Schwarzman", "David Thomson", "He Xiangjian", "Pony Ma", "Li Ka-shing"
    ),
    aliases: {
      "Elon Musk": ["musk"],
      "Jeff Bezos": ["bezos"],
      "Mark Zuckerberg": ["zuckerberg", "zuck"],
      "Jensen Huang": ["jensen"],
      "Warren Buffett": ["buffett", "buffet"],
      "Carlos Slim Helú": ["carlos slim"],
      "Françoise Bettencourt Meyers": ["bettencourt"],
      "Kanye West": ["ye"],
      "Pony Ma": ["ma huateng"],
    },
  },
  {
    id: "tourists",
    cat: "Travel",
    q: "Most visited countries by international tourists",
    basis: "By international arrivals, UNWTO 2023",
    items: L(
      "France", "Spain", ["United States", "USA"], "Turkey", "Italy",
      "Mexico", ["United Kingdom", "UK"], "Germany", "Greece", "Austria",
      "Thailand", "Malaysia", "Japan", "Saudi Arabia", "Canada",
      "Portugal", "Poland", "China", "Netherlands", "Croatia",
      "Morocco", ["United Arab Emirates", "UAE"], ["Czech Republic", "Czechia"], "Hungary", "Australia",
      "Switzerland", ["South Korea", "Korea"], "India", "Russia", "Indonesia"
    ),
    aliases: {
      "United States": ["usa", "us", "america"],
      "United Kingdom": ["uk", "britain", "england"],
      "United Arab Emirates": ["uae", "emirates"],
      "Czech Republic": ["czechia", "czech"],
      "South Korea": ["korea"],
    },
  },
  {
    id: "fast-food",
    cat: "Food",
    q: "Largest fast food chains by number of locations",
    basis: "By total global locations, approx 2024",
    items: L(
      "McDonald's", "Subway", "Starbucks", "KFC", "Burger King",
      "Domino's", "Pizza Hut", "Dunkin'", "Baskin-Robbins", "Tim Hortons",
      "Dairy Queen", "Taco Bell", "Wendy's", "Chick-fil-A", "Papa John's",
      "Little Caesars", "Sonic", "Arby's", "Popeyes", "Church's Chicken",
      "Panda Express", "Chipotle", "Jack in the Box", "Five Guys", "Wingstop",
      "Jersey Mike's", "Jimmy John's", "Hardee's", "Shake Shack", "In-N-Out Burger"
    ),
    aliases: {
      "McDonald's": ["mcdonalds"],
      "KFC": ["kentucky fried chicken"],
      "Domino's": ["dominos"],
      "Dunkin'": ["dunkin donuts", "dunkin"],
      "Tim Hortons": ["tim horton's", "timmies"],
      "Chick-fil-A": ["chick fil a", "chick-fil-a"],
      "Papa John's": ["papa johns"],
      "Church's Chicken": ["texas chicken"],
      "Hardee's": ["carl's jr", "carls jr"],
    },
  },
  {
    id: "websites",
    cat: "Internet",
    q: "Most visited websites in the world",
    basis: "By monthly web traffic, Similarweb 2025",
    items: L(
      "Google", "YouTube", "Facebook", "Instagram", "Wikipedia",
      ["X", "Twitter"], "Reddit", "TikTok", "Amazon", "Yahoo",
      "WhatsApp", "Netflix", "Bing", "LinkedIn", "Pinterest",
      "Twitch", "Microsoft", "Discord", "Zoom", "DuckDuckGo",
      "Quora", "eBay", "ESPN", "Spotify", "GitHub",
      "Stack Overflow", "Craigslist", "Airbnb", "CNN", "IMDb"
    ),
    aliases: {
      "X": ["twitter"],
      "Wikipedia": ["wiki"],
      "DuckDuckGo": ["ddg"],
      "Stack Overflow": ["stackoverflow"],
    },
  },
  {
    id: "spotify",
    cat: "Music",
    q: "Most monthly listeners on Spotify",
    basis: "By peak monthly listeners, approx 2025",
    items: L(
      ["The Weeknd", "Abel"], "Taylor Swift", "Bad Bunny", "Drake", "Ed Sheeran",
      "Ariana Grande", "Billie Eilish", "Eminem", "Post Malone", "Justin Bieber",
      "Harry Styles", "Dua Lipa", "Coldplay", "BTS", "Rihanna",
      "Imagine Dragons", "Travis Scott", ["Kanye West", "Ye"], "Juice WRLD", "Kendrick Lamar",
      "SZA", "J. Cole", "Olivia Rodrigo", "Morgan Wallen", "Sam Smith",
      "Shawn Mendes", "Future", "Luke Combs", "BLACKPINK", "Sabrina Carpenter"
    ),
    aliases: {
      "The Weeknd": ["abel", "weeknd"],
      "Bad Bunny": ["benito"],
      "Kanye West": ["ye", "yeezy"],
      "BTS": ["bangtan"],
      "BLACKPINK": ["black pink"],
    },
  },
  {
    id: "tiktok",
    cat: "Internet",
    q: "Most followed accounts on TikTok",
    basis: "By followers, approx 2025",
    items: L(
      "Khaby Lame", "Charli D'Amelio", "Bella Poarch", "MrBeast", "Kimberly Loaiza",
      "Addison Rae", "Zach King", "TikTok", "Brent Rivera", "Loren Gray",
      "Jason Derulo", "Spencer X", "SSSniperWolf", "Avani Gregg", "Dixie D'Amelio",
      "Selena Gomez", "James Charles", "David Dobrik", "NBA", "Shakira",
      ["Dwayne Johnson", "The Rock"], "Cardi B", "Will Smith", "Kylie Jenner", "Kim Kardashian",
      "Doja Cat", "Michael Le", "Bella Hadid", "Nicki Minaj", "Lizzo"
    ),
    aliases: {
      "Khaby Lame": ["khaby"],
      "Charli D'Amelio": ["charli"],
      "Dixie D'Amelio": ["dixie"],
      "MrBeast": ["mr beast"],
      "Dwayne Johnson": ["the rock"],
      "SSSniperWolf": ["sssniperwolf"],
    },
  },
  {
    id: "crops",
    cat: "Nature",
    q: "Most produced crops in the world by weight",
    basis: "By annual production, FAO 2022",
    items: L(
      "Sugarcane", ["Maize", "Corn"], "Wheat", "Rice", ["Oil Palm Fruit", "Palm Oil"],
      "Potato", "Soybean", "Cassava", "Sugar Beet", "Barley",
      "Tomato", "Banana", "Watermelon", "Onion", "Sweet Potato",
      ["Rapeseed", "Canola"], "Apple", "Grape", "Sorghum", "Cabbage",
      "Coconut", "Cucumber", "Orange", "Yam", "Mango",
      "Sunflower Seed", ["Groundnut", "Peanut"], "Carrot", "Cotton", "Pineapple"
    ),
    aliases: {
      "Maize": ["corn"],
      "Oil Palm Fruit": ["palm oil", "palm fruit", "oil palm"],
      "Rapeseed": ["canola"],
      "Groundnut": ["peanut", "peanuts", "groundnuts"],
    },
  },
  {
    id: "fast-animals",
    cat: "Nature",
    q: "Fastest land animals in the world",
    basis: "By recorded top speed",
    items: L(
      "Cheetah", "Pronghorn", "Springbok", "Wildebeest", "Lion",
      ["Thomson's Gazelle", "Gazelle"], "Blackbuck", ["Quarter Horse", "Horse"], "African Wild Dog", "Jackrabbit",
      "Greyhound", "Coyote", "Ostrich", "Elk", "Mongolian Gazelle",
      "Serval", "Mule Deer", "Zebra", "Hyena", "Impala",
      "Kangaroo", "Giraffe", "European Hare", "Grey Wolf", "Moose",
      "Reindeer", "Grizzly Bear", "Tiger", "Red Fox", "Polar Bear"
    ),
    aliases: {
      "Thomson's Gazelle": ["gazelle", "thomsons gazelle"],
      "Quarter Horse": ["horse"],
      "African Wild Dog": ["wild dog", "painted dog"],
      "Jackrabbit": ["jack rabbit"],
      "European Hare": ["hare"],
      "Grey Wolf": ["wolf", "gray wolf"],
      "Grizzly Bear": ["grizzly", "brown bear"],
      "Red Fox": ["fox"],
    },
  },
];

export type CuratedTheme = {
  name: string;
  blurb: string;
  ids: string[];
};

export const CURATED_THEMES: CuratedTheme[] = [
  { name: "World & Geography", blurb: "Countries, cities, places", ids: ["countries", "area", "cities", "states", "tourists"] },
  { name: "Nature & Science", blurb: "Mountains, rivers, wildlife, crops", ids: ["mountains", "rivers", "elements", "languages", "fast-animals", "crops"] },
  { name: "India", blurb: "States, cities, cinema", ids: ["in-states", "in-cities", "in-area", "in-films"] },
  { name: "Movies", blurb: "Box-office giants", ids: ["franchises", "films", "animated"] },
  { name: "Pop Culture & The Internet", blurb: "Games, music, social media, the web", ids: ["games", "music", "youtube", "instagram", "spotify", "tiktok", "websites"] },
  { name: "Money & Records", blurb: "Business, sport, books, towers", ids: ["companies", "olympics", "books", "buildings"] },
  { name: "Economy & Wealth", blurb: "GDP, billionaires, global brands", ids: ["gdp", "gdp-capita", "billionaires", "fast-food"] },
];

const QUESTION_BY_ID = new Map(CURATED_QUESTIONS.map((q) => [q.id, q]));

export const CURATED_THEME_GROUPS = CURATED_THEMES.map((theme) => ({
  name: theme.name,
  blurb: theme.blurb,
  questions: theme.ids
    .map((id) => QUESTION_BY_ID.get(id))
    .filter((q): q is CuratedQuestion => Boolean(q)),
}));
