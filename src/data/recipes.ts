import { Recipe } from "../types";

export const PRESET_RECIPES: Recipe[] = [
  {
    id: "r1",
    title: "Nasi Goreng Penyelamat Kulkas",
    description: "Nasi goreng klasik yang bisa memuat sisa protein dan bumbu apa pun di kulkas Anda. Cepat, nikmat, dan sangat hemat!",
    prepTime: 15,
    difficulty: "Mudah",
    category: "Nasi & Karbo",
    image: "https://images.unsplash.com/photo-1603133872878-68550a5e2a24?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: [
      { name: "Nasi Putih", quantity: "1 piring besar", isEssential: true },
      { name: "Telur Ayam", quantity: "1 atau 2 butir", isEssential: true },
      { name: "Bawang Merah", quantity: "3 siung (iris tipis)", isEssential: true },
      { name: "Bawang Putih", quantity: "2 siung (cincang)", isEssential: true },
      { name: "Cabai Rawit", quantity: "3 buah (sesuai selera)", isEssential: false },
      { name: "Daun Bawang", quantity: "1 batang (iris)", isEssential: false },
      { name: "Margarin / Mentega", quantity: "1 sdm untuk menumis", isEssential: true },
      { name: "Kecap Manis", quantity: "2 sdm", isEssential: true }
    ],
    instructions: [
      "Panaskan margarin di atas wajan dengan api sedang.",
      "Tumis bawang putih, bawang merah, dan cabai rawit hingga harum dan layu.",
      "Sisihkan bumbu di pinggir wajan, masukkan telur kocok kemudian buat scramble/orak-arik.",
      "Masukkan nasi putih dingin, aduk rata dengan bumbu dan telur.",
      "Tambahkan kecap manis, garam, dan merica secukupnya. Aduk hingga warna merata dan berasap.",
      "Masukkan irisan daun bawang di akhir putaran tumis, aduk sebentar, lalu sajikan hangat-hangat."
    ]
  },
  {
    id: "r2",
    title: "Martabak Mie Instan Ceria",
    description: "Sering disebut 'omlet mie' anak kos. Camilan gurih nan kenyang dari sisa mie instan dan telur di penghujung bulan.",
    prepTime: 10,
    difficulty: "Mudah",
    category: "Camilan Sederhana",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: [
      { name: "Mie Instan", quantity: "1 bungkus (rasa apa saja)", isEssential: true },
      { name: "Telur Ayam", quantity: "2 butir", isEssential: true },
      { name: "Daun Bawang", quantity: "1 batang (iris tipis)", isEssential: false },
      { name: "Cabai Rawit", quantity: "2 buah (iris tipis)", isEssential: false }
    ],
    instructions: [
      "Rebus mie instan dalam air mendidih selama 2-3 menit hingga matang, lalu tiriskan.",
      "Dalam mangkuk, kocok lepas dua butir telur. Masukkan bumbu mie instan, daun bawang, dan irisan cabai rawit.",
      "Masukkan mie instan rebus yang telah ditiriskan ke dalam adonan telur, aduk rata.",
      "Panaskan wajan anti lengket dengan sedikit minyak atau margarin.",
      "Tuang adonan mie telur ke wajan, ratakan hingga membentuk bulat penuh seperti telur dadar tebal.",
      "Goreng dengan api kecil-sedang hingga bagian bawah cokelat keemasan, lalu balik dengan hati-hati.",
      "Masak sisi sebaliknya hingga matang merata, angkat dan potong-potong sebelum disajikan."
    ]
  },
  {
    id: "r3",
    title: "Tumis Tahu Tempe Kecap Gurih",
    description: "Dua protein nabati terbaik asli Indonesia yang disatukan dengan saus kecap manis legit. Sangat nikmat dimakan bersama nasi hangat.",
    prepTime: 20,
    difficulty: "Mudah",
    category: "Lauk Utama",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: [
      { name: "Tahu Putih", quantity: "1 kotak besar (potong dadu)", isEssential: true },
      { name: "Tempe", quantity: "1 papan sedang (potong dadu)", isEssential: true },
      { name: "Bawang Merah", quantity: "4 siung (iris tipis)", isEssential: true },
      { name: "Bawang Putih", quantity: "2 siung (iris tipis)", isEssential: true },
      { name: "Cabai Rawit", quantity: "4 buah (iris serong)", isEssential: false },
      { name: "Kecap Manis", quantity: "3-4 sdm", isEssential: true },
      { name: "Margarin / Mentega", quantity: "Secukupnya untuk goreng-tumis", isEssential: true }
    ],
    instructions: [
      "Goreng tahu dadu dan tempe dadu setengah matang agar berkulit halus, tiriskan.",
      "Kurangi minyak di wajan, tumis bawang merah, bawang putih, dan cabai rawit hingga harum semerbak.",
      "Masukkan tahu dan tempe yang sudah digoreng setengah matang, aduk hingga rata.",
      "Tuangkan kecap manis, garam, penyedap, dan sedikit air (kira-kira 50ml) agar meresap.",
      "Masak hingga air menyusut dan saus kecap mengental membungkus tahu dan tempe. Siap disajikan."
    ]
  },
  {
    id: "r4",
    title: "Sop Sayur Kulkas Sehat",
    description: "Sapu bersih sisa sayuran di laci kulkas Anda menjadi semangkuk sup hangat yang kaya nutrisi dan memulihkan stamina.",
    prepTime: 25,
    difficulty: "Sedang",
    category: "Kuah Segar",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: [
      { name: "Wortel", quantity: "2 buah (iris bulat)", isEssential: true },
      { name: "Kentang", quantity: "1 buah (potong dadu)", isEssential: true },
      { name: "Kubis / Kol", quantity: "4 lembar (iris kasar)", isEssential: false },
      { name: "Daging Ayam", quantity: "150 gram (potong kecil untuk kaldu)", isEssential: false },
      { name: "Bawang Putih", quantity: "3 siung (memarkan & tumis halus)", isEssential: true },
      { name: "Daun Bawang", quantity: "1 batang (potong 2cm)", isEssential: false },
      { name: "Tomat Merah", quantity: "1 buah (potong 4 bagian)", isEssential: false }
    ],
    instructions: [
      "Rebus potongan daging ayam dalam 1 liter air dengan api kecil hingga keluar kaldunya.",
      "Di wajan kecil terpisah, tumis bawang putih hingga kuning keemasan, lalu cemplungkan ke dalam rebusan ayam.",
      "Masukkan kentang dan wortel karena membutuhkan waktu memasak lebih lama, rebus selama 5-7 menit.",
      "Setelah kentang setengah empuk, masukkan kol dan daun bawang.",
      "Bumbui dengan garam, merica bubuk, dan kaldu bubuk secukupnya. Koreksi rasa.",
      "Sesaat sebelum mematikan api, masukkan tomat merah agar tetap segar. Sajikan sup selagi mengepul hangat."
    ]
  },
  {
    id: "r5",
    title: "Mie Tek-Tek Tanggal Tua ala Koki",
    description: "Mie instan kuah/nyemek yang di-upgrade dengan sayur segar dan sosis bakso melimpah. Cita rasa kaki lima yang praktis di rumah.",
    prepTime: 15,
    difficulty: "Mudah",
    category: "Nasi & Karbo",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: [
      { name: "Mie Instan", quantity: "1 bungkus (rekomendasi kuah)", isEssential: true },
      { name: "Sawi Hijau", quantity: "1 ikat kecil (iris)", isEssential: true },
      { name: "Telur Ayam", quantity: "1 butir", isEssential: true },
      { name: "Sosis Sapi/Ayam", quantity: "2 buah (iris serong)", isEssential: false },
      { name: "Bakso Sapi", quantity: "3 butir (iris tipis)", isEssential: false },
      { name: "Bawang Merah", quantity: "3 siung (haluskan)", isEssential: true },
      { name: "Bawang Putih", quantity: "2 siung (haluskan)", isEssential: true },
      { name: "Cabai Rawit", quantity: "3 buah (iris)", isEssential: false }
    ],
    instructions: [
      "Tumis bumbu halus bawang merah, bawang putih, dan cabai rawit hingga harum sekali.",
      "Masukkan potongan sosis dan bakso sapi, aduk sebentar hingga sosis berubah warna.",
      "Pecahkan telur langsung ke wajan, orak-arik kasa bersama tumisan agar menciptakan kuah kental.",
      "Tuangkan air sekitar 400ml, biarkan hingga mendidih gembos-gembos.",
      "Masukkan mie instan beserta bumbu bawaannya. Masak selama 2 menit.",
      "Masukkan sawi hijau, aduk cepat hingga sawi layu setengah matang, matikan api, dan hidangkan segera dengan taburan bawang goreng."
    ]
  },
  {
    id: "r6",
    title: "Roti Panggang Keju Susu Lumer",
    description: "Menggunakan sisa roti tawar yang hampir habis masanya. Dipadukan dengan margarin, keju parut, dan kental manis yang lumer di mulut.",
    prepTime: 10,
    difficulty: "Mudah",
    category: "Camilan Sederhana",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: [
      { name: "Roti Tawar", quantity: "4 lembar", isEssential: true },
      { name: "Keju Kraft", quantity: "50 gram (parut)", isEssential: true },
      { name: "Margarin / Mentega", quantity: "2 sdm", isEssential: true },
      { name: "Susu Cair", quantity: "3 sdm (atau susu kental manis)", isEssential: false }
    ],
    instructions: [
      "Olesi setiap sisi roti tawar dengan margarin secara merata.",
      "Taburkan parutan keju kraft tebal di antara dua lembar roti (membuat tangkup sandwich).",
      "Beri rintikan susu atau kental manis di atas keju sebelum ditangkup.",
      "Panggang roti di atas teflon datar berapi sangat kecil agar bagian luar renyah keemasan dan keju di dalam meleleh sempurna.",
      "Balik roti saat bagian bawahnya garing, lalu angkat setelah kedua sisi matang. Potong menjadi segitiga cantik."
    ]
  },
  {
    id: "r7",
    title: "Tumis Kangkung Kilat Pedas",
    description: "Kangkung sisa kemarin bisa disulap kembali menjadi santapan segar pedas dengan bumbu dasar dapur dalam waktu 5 menit saja.",
    prepTime: 10,
    difficulty: "Mudah",
    category: "Kuah Segar",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: [
      { name: "Kangkung", quantity: "1 ikat besar (siangi daunnya)", isEssential: true },
      { name: "Bawang Merah", quantity: "3 siung (iris tipis)", isEssential: true },
      { name: "Bawang Putih", quantity: "2 siung (iris tipis)", isEssential: true },
      { name: "Cabai Rawit", quantity: "5 buah (iris serong)", isEssential: true },
      { name: "Tomat Merah", quantity: "1/2 buah (iris kasar)", isEssential: false },
      { name: "Margarin / Mentega", quantity: "1 sdm", isEssential: true }
    ],
    instructions: [
      "Tumis irisan bawang putih, bawang merah, dan cabai rawit pedas menggunakan margarin hingga harum.",
      "Masukkan irisan tomat merah, aduk rata sebentar.",
      "Besarkan api kompor, masukkan kangkung sehat yang sudah dicuci bersih.",
      "Tambahkan sejumput garam, sedikit gula pasir, dan 2 sendok makan air. Tumis cepat agar kangkung tetap hijau segar.",
      "Segera angkat ketika daun kangkung terlihat layu (jangan terlalu layu agar tetap renyah ketika dikunyah)."
    ]
  },
  {
    id: "r8",
    title: "Orak-Arik Bayam Keju Bergizi",
    description: "Cara menyenangkan agar anak kos atau anak kecil mengonsumsi sisa bayam kulkas dengan mengombinasikannya bersama gurihnya keju parut.",
    prepTime: 12,
    difficulty: "Mudah",
    category: "Lauk Utama",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    ingredients: [
      { name: "Bayam", quantity: "1 ikat kecil (ambil daunnya saja)", isEssential: true },
      { name: "Telur Ayam", quantity: "2 butir", isEssential: true },
      { name: "Bawang Putih", quantity: "2 siung (cincang halus)", isEssential: true },
      { name: "Keju Kraft", quantity: "30 gram (parut halus)", isEssential: false },
      { name: "Margarin / Mentega", quantity: "1 sdm", isEssential: true }
    ],
    instructions: [
      "Rebus daun bayam sebentar saja selama 1 menit, tiriskan dan peras sisa airnya, lalu cincang kasar.",
      "Panaskan margarin di wajan, tumis bawang putih cincang hingga harum kekuningan.",
      "Tuangkan kocokan telur ayam, orak-arik (scramble) kasar.",
      "Masukkan bayam cincang, aduk cepat menyatu dengan telur.",
      "Taburkan parutan keju kraft di atasnya, beri garam dan merica bubuk secukupnya.",
      "Aduk hingga keju mulai meleleh dan mengeluarkan aroma gurih khas. Hidangkan sebagai lauk praktis."
    ]
  }
];
