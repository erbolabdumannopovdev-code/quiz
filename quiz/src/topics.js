const mk = (id, title, emoji, color, rows, lang) => ({
  id, title, emoji, color, lang,
  cards: rows.map(([term, def], i) => ({ id: id + i, term, def })),
});

export const TOPICS = [
  mk("en", "Ingliz tili", "🇬🇧", "#6c4bff", [
    ["apple", "olma"], ["book", "kitob"], ["water", "suv"], ["house", "uy"],
    ["friend", "do'st"], ["school", "maktab"], ["city", "shahar"], ["sun", "quyosh"],
    ["bread", "non"], ["window", "deraza"],
  ], "en-US"),
  mk("ru", "Rus tili", "🇷🇺", "#e5484d", [
    ["привет", "salom"], ["спасибо", "rahmat"], ["книга", "kitob"], ["вода", "suv"],
    ["друг", "do'st"], ["школа", "maktab"], ["хлеб", "non"], ["дом", "uy"],
  ], "ru-RU"),
  mk("math", "Matematika", "➗", "#f59e0b", [
    ["2⁵", "32"], ["√144", "12"], ["7 × 8", "56"], ["200 ning 15% i", "30"],
    ["Uchburchak burchaklari yig'indisi", "180°"], ["Doira yuzi", "πr²"],
    ["Kvadrat perimetri", "4a"], ["π ning taxminiy qiymati", "3,14"],
  ]),
  mk("hist", "Tarix", "🏛️", "#b45309", [
    ["Amir Temur tug'ilgan yil", "1336"], ["Mirzo Ulug'bek rasadxonasi shahri", "Samarqand"],
    ["O'zbekiston mustaqillik kuni", "1 sentabr"], ["Al-Xorazmiy", "Algebra asoschisi"],
    ["Registon joylashgan shahar", "Samarqand"], ["Bobur asos solgan davlat", "Boburiylar"],
    ["Ibn Sino mashhur asari", "Tib qonunlari"], ["Buyuk ipak yo'li", "Sharq va G'arbni bog'lovchi savdo yo'li"],
  ]),
  mk("geo", "Geografiya", "🌍", "#0ea5e9", [
    ["O'zbekiston poytaxti", "Toshkent"], ["Eng katta okean", "Tinch okeani"],
    ["Eng baland tog' cho'qqisi", "Everest"], ["Yaponiya poytaxti", "Tokio"],
    ["Fransiya poytaxti", "Parij"], ["Eng katta issiq cho'l", "Sahroi Kabir"],
    ["Eng chuqur ko'l", "Baykal"], ["Amudaryo quyiladigan joy", "Orol dengizi"],
  ]),
  mk("bio", "Biologiya", "🧬", "#16a34a", [
    ["Hujayraning energiya markazi", "Mitoxondriya"], ["Inson xromosomalari soni", "46"],
    ["Qonni haydovchi a'zo", "Yurak"], ["Xlorofill rangi", "Yashil"],
    ["Kattalar skeletidagi suyaklar soni", "206"], ["Tanadagi eng katta a'zo", "Teri"],
    ["DNK", "Irsiy ma'lumot tashuvchi molekula"], ["Fotosintez", "Yorug'likda o'simlik oziq hosil qilishi"],
  ]),
  mk("phys", "Fizika", "⚡", "#facc15", [
    ["Tezlik formulasi", "v = s / t"], ["Nyutonning 2-qonuni", "F = m·a"],
    ["Kuch birligi", "Nyuton (N)"], ["Energiya birligi", "Joul (J)"],
    ["Quvvat birligi", "Vatt (W)"], ["Om qonuni", "I = U / R"],
    ["Suvning qaynash harorati", "100 °C"], ["Erkin tushish tezlanishi", "≈ 9,8 m/s²"],
  ]),
  mk("chem", "Kimyo", "🧪", "#a855f7", [
    ["H₂O", "Suv"], ["NaCl", "Osh tuzi"], ["CO₂", "Karbonat angidrid"], ["Au", "Oltin"],
    ["Fe", "Temir"], ["Ag", "Kumush"], ["Neytral muhitning pH i", "7"], ["Vodorodning tartib raqami", "1"],
  ]),
  mk("it", "Informatika", "💻", "#14b8a6", [
    ["CPU", "Markaziy protsessor"], ["RAM", "Operativ xotira"], ["HTML", "Veb-sahifa belgilash tili"],
    ["CSS", "Sahifa uslublari tili"], ["1 bayt", "8 bit"], ["URL", "Veb-manzil"],
    ["Ikkilik sanoq tizimi raqamlari", "0 va 1"], ["Algoritm", "Masalani yechish qadamlari ketma-ketligi"],
  ]),
  mk("lit", "Adabiyot", "📚", "#ec4899", [
    ["Xamsa muallifi", "Alisher Navoiy"], ["O'tkan kunlar muallifi", "Abdulla Qodiriy"],
    ["Boburnoma muallifi", "Zahiriddin Bobur"], ["Qutadg'u bilig muallifi", "Yusuf Xos Hojib"],
    ["Devonu lug'otit turk muallifi", "Mahmud Koshg'ariy"], ["Sariq devni minib muallifi", "Xudoyberdi To'xtaboyev"],
    ["Ot qaysi so'roqlarga javob beradi", "Kim? Nima?"], ["Fe'l nimani bildiradi", "Harakatni"],
  ]),
  mk("space", "Astronomiya", "🪐", "#6366f1", [
    ["Quyoshga eng yaqin sayyora", "Merkuriy"], ["Qizil sayyora", "Mars"],
    ["Eng katta sayyora", "Yupiter"], ["Yerning tabiiy yo'ldoshi", "Oy"],
    ["Halqali sayyora", "Saturn"], ["Quyosh tizimidagi sayyoralar soni", "8"],
    ["Birinchi kosmonavt", "Yuriy Gagarin"], ["Bizning galaktika", "Somon yo'li"],
  ]),
];