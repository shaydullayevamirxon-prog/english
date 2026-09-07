import { GradeCurriculum } from '../types';

export const HIGH_GRADES: GradeCurriculum[] = [
  // 8-SINF
  {
    grade: 8,
    name: '8-sinf',
    subtitle: "Global Dunyoqarash (English Plus 3)",
    cefrLevel: 'B1',
    color: 'from-pink-600 to-rose-600',
    accentColor: 'border-rose-500 text-rose-700',
    icon: '💡',
    studentsBookTitle: "English Plus 3 - Student's Book",
    workbookTitle: "English Plus 3 - Workbook",
    studentsBookCover: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80',
    workbookCover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    units: [
      {
        id: 'g8-u1',
        number: 1,
        title: 'Unit 1: Environment and Our Planet',
        titleUz: '1-bo\'lim: Atrof-muhit va bizning sayyora',
        description: "Tabiatni asrash, qayta ishlash va global iqlim masalalari.",
        icon: '🌱',
        lessons: [
          {
            id: 'g8-u1-l1',
            number: 1,
            title: 'Lesson 1: Protecting Nature & Recycling',
            titleUz: '1-dars: Tabiatni himoya qilish va qayta ishlash',
            summary: "Eko-odatlarni o'rganish.",
            readingContent: {
              topic: 'Ecology & Green Energy',
              vocabulary: [
                { en: 'Pollution', uz: 'Ifloslanish', phonetic: '[pəˈluːʃn]' },
                { en: 'Recycle', uz: 'Qayta ishlamoq', phonetic: '[ˌriːˈsaɪkl]' },
                { en: 'Solar energy', uz: 'Quyosh energiyasi', phonetic: '[ˈsəʊlər ˈenədʒi]' },
                { en: 'Save water', uz: 'Suvni tejamoq', phonetic: '[seɪv ˈwɔːtər]' },
                { en: 'Plant trees', uz: 'Daraxt ekmoq', phonetic: '[plɑːnt triːz]' },
              ],
              grammarRule: {
                title: 'Modal verbs: Should and Must',
                explanationUz: "Maslahat berishda 'should' (kerak, yaxshi bo'lardi), qat'iy majburiyatda 'must' (shart, majbur) ishlatiladi.",
                examples: ['We should plant more green trees.', 'We must not throw plastic into rivers.'],
              },
              readingPassage: 'Our planet is facing serious ecological challenges. To reduce pollution, modern cities are using solar panels and electric buses. Every student can help by saving water and recycling paper.',
            },
            workbookPageNumber: 20,
            workbookExercises: [
              {
                id: 'g8-u1-l1-ex1',
                number: 1,
                title: 'Fill in should or must',
                instruction: '1. "should" yoki "must" bilan to\'ldiring:',
                type: 'fill_in_blank',
                items: [
                  {
                    id: 'g8-m-1',
                    question: 'We ______ turn off the lights when leaving a room.',
                    preText: 'We ',
                    postText: ' turn off the lights when leaving a room.',
                    correctAnswer: 'should',
                    explanationUz: "Elektrni tejash yaxshi maslahat bo'lgani uchun 'should' mos keladi.",
                  },
                ],
              },
            ],
          },
          {
            id: 'g8-u1-l2',
            number: 2,
            title: 'Lesson 2: Great Inventions & Discoveries',
            titleUz: '2-dars: Buyuk kashfiyotlar va ixtirolar',
            summary: "Elektr, internet, telefon va ilmiy yangiliklar.",
            readingContent: {
              topic: 'Inventions that changed the world',
              vocabulary: [
                { en: 'Invent', uz: 'Ixtiro qilmoq', phonetic: '[ɪnˈvent]' },
                { en: 'Discover', uz: 'Kashf qilmoq', phonetic: '[dɪˈskʌvər]' },
                { en: 'Scientist', uz: 'Olim', phonetic: '[ˈsaɪəntɪst]' },
                { en: 'Electricity', uz: 'Elektr toki', phonetic: '[ɪˌlekˈtrɪsəti]' },
              ],
              grammarRule: {
                title: 'Past Simple Passive (was/were + V3)',
                explanationUz: "Narsa kim tomonidan ixtiro qilingani yoki kashf etilganini aytishda: 'was/were invented by...'",
                examples: ['The telephone was invented by Alexander Graham Bell.'],
              },
              readingPassage: 'In 1879, the electric light bulb was perfected by Thomas Edison. Today, the internet connects billions of people worldwide in seconds.',
            },
            workbookPageNumber: 21,
            workbookExercises: [
              {
                id: 'g8-u1-l2-ex1',
                number: 1,
                title: 'Choose the correct passive voice',
                instruction: '1. To\'g\'ri passiv shaklni tanlang:',
                type: 'multiple_choice',
                items: [
                  {
                    id: 'g8-inv-1',
                    question: 'Penicillin ______ by Alexander Fleming in 1928.',
                    preText: 'Penicillin ',
                    postText: ' by Alexander Fleming in 1928.',
                    correctAnswer: 'was discovered',
                    options: ['was discovered', 'discovered', 'is discover'],
                    explanationUz: "Penitsillin o'tmishda kashf etilgani sababli 'was discovered' to'g'ri bo'ladi.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 9-SINF
  {
    grade: 9,
    name: '9-sinf',
    subtitle: "Kelajak sari qadam (English Plus 4)",
    cefrLevel: 'B1+',
    color: 'from-rose-600 to-amber-600',
    accentColor: 'border-amber-500 text-amber-700',
    icon: '🚀',
    studentsBookTitle: "English Plus 4 - Student's Book",
    workbookTitle: "English Plus 4 - Workbook",
    studentsBookCover: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    workbookCover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    units: [
      {
        id: 'g9-u1',
        number: 1,
        title: 'Unit 1: Modern Technology and Digital Life',
        titleUz: '1-bo\'lim: Zamonaviy texnologiya va raqamli hayot',
        description: "Sun'iy intellekt, smartfonlar va Present Perfect zamoni.",
        icon: '💻',
        lessons: [
          {
            id: 'g9-u1-l1',
            number: 1,
            title: 'Lesson 1: How Tech Changed Our Lives',
            titleUz: '1-dars: Texnologiya hayotimizni qanday o\'zgartirdi',
            summary: "Present Perfect (have/has + V3) tajribalar va natijalar.",
            readingContent: {
              topic: 'Digital Transformation',
              vocabulary: [
                { en: 'Artificial intelligence', uz: 'Sun\'iy intellekt', phonetic: '[ˌɑːtɪˈfɪʃl ɪnˈtelɪdʒəns]' },
                { en: 'Social media', uz: 'Ijtimoiy tarmoqlar', phonetic: '[ˌsəʊʃl ˈmiːdiə]' },
                { en: 'Smartphone', uz: 'Smartfon', phonetic: '[ˈsmɑːtfəʊn]' },
                { en: 'Revolutionize', uz: 'Inqilobiy o\'zgartirmoq', phonetic: '[ˌrevəˈluːʃənaɪz]' },
              ],
              grammarRule: {
                title: 'Present Perfect: Have/Has + V3',
                explanationUz: "O'tmishda sodir bo'lgan, ammo natijasi hozir ko'rinib turgan harakatlar uchun have/has + 3-shakl fe'li qo'llanadi.",
                examples: ['I have just finished my homework.', 'Smartphones have changed the world.'],
              },
              readingPassage: 'Artificial intelligence has made incredible progress recently. Today, neural networks can translate complex languages instantly and help doctors diagnose illnesses accurately.',
            },
            workbookPageNumber: 24,
            workbookExercises: [
              {
                id: 'g9-u1-l1-ex1',
                number: 1,
                title: 'Complete with Present Perfect',
                instruction: '1. Fe\'lni Present Perfect shaklida yozing:',
                type: 'fill_in_blank',
                items: [
                  {
                    id: 'g9-pp-1',
                    question: 'Scientists ______ (develop) faster computers.',
                    preText: 'Scientists ',
                    postText: ' faster computers.',
                    correctAnswer: 'have developed',
                    explanationUz: "'Scientists' ko'plik bo'lgani uchun 'have developed' qo'yiladi.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 10-SINF
  {
    grade: 10,
    name: '10-sinf',
    subtitle: "Global Muloqot (Solutions Intermediate)",
    cefrLevel: 'B2',
    color: 'from-emerald-600 to-teal-700',
    accentColor: 'border-teal-600 text-teal-800',
    icon: '🌐',
    studentsBookTitle: "Solutions Intermediate - Student's Book",
    workbookTitle: "Solutions Intermediate - Workbook",
    studentsBookCover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
    workbookCover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    units: [
      {
        id: 'g10-u1',
        number: 1,
        title: 'Unit 1: Globalization and Global Economy',
        titleUz: '1-bo\'lim: Globallashuv va Jahon iqtisodiyoti',
        description: "Xalqaro savdo, madaniyatlararo almashinuv va Shart mayllari (Conditionals).",
        icon: '🌍',
        lessons: [
          {
            id: 'g10-u1-l1',
            number: 1,
            title: 'Lesson 1: Second Conditional - Unreal Situations',
            titleUz: '1-dars: Ikkinchi shart mayli (Agar men bo\'lganimda...)',
            summary: "If + Past Simple, would + V1 qoidasi.",
            readingContent: {
              topic: 'Second Conditional & Hypothetical Situations',
              vocabulary: [
                { en: 'Hypothetical', uz: 'Faraziy / Taxminiy', phonetic: '[ˌhaɪpəˈθetɪkl]' },
                { en: 'Opportunity', uz: 'Imkoniyat', phonetic: '[ˌɒpəˈtjuːnəti]' },
                { en: 'Global citizen', uz: 'Dunyo fuqarosi', phonetic: '[ˈɡləʊbl ˈsɪtɪzn]' },
                { en: 'Prosperity', uz: 'Farovonlik', phonetic: '[prɒˈsperəti]' },
              ],
              grammarRule: {
                title: 'Second Conditional (Noaniq / Faraziy orzular)',
                explanationUz: "Hozirgi paytdagi noreal yoki orzu holatlar uchun: If + Past Simple, would + fe'l asosi.",
                examples: ['If I had more time, I would travel around the world.', 'If she studied harder, she would pass the exam.'],
              },
              readingPassage: 'If every young person knew foreign languages, international communication would be much easier. Learning English opens doors to top global universities and multinational career opportunities.',
            },
            workbookPageNumber: 28,
            workbookExercises: [
              {
                id: 'g10-u1-l1-ex1',
                number: 1,
                title: 'Fill in the correct conditional verbs',
                instruction: '1. If gapini to\'g\'ri to\'ldiring:',
                type: 'fill_in_blank',
                items: [
                  {
                    id: 'g10-c-1',
                    question: 'If I ______ (win) a scholarship, I would study in Cambridge.',
                    preText: 'If I ',
                    postText: ' a scholarship, I would study in Cambridge.',
                    correctAnswer: 'won',
                    explanationUz: "Second Conditional qoidasiga ko'ra 'If' qismida fe'l Past Simple shaklida (won) bo'ladi.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 11-SINF
  {
    grade: 11,
    name: '11-sinf',
    subtitle: "Universitet & IELTS sari (Solutions Upper-Intermediate)",
    cefrLevel: 'B2 / C1',
    color: 'from-amber-600 to-red-600',
    accentColor: 'border-red-500 text-red-700',
    icon: '🎓',
    studentsBookTitle: "Solutions Upper-Intermediate - Student's Book",
    workbookTitle: "Solutions Upper-Intermediate - Workbook",
    studentsBookCover: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    workbookCover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    units: [
      {
        id: 'g11-u1',
        number: 1,
        title: 'Unit 1: Academic Excellence & IELTS Preparation',
        titleUz: '1-bo\'lim: Akademik yutuqlar va IELTS tayyorgarligi',
        description: "Akademik insho (Writing Task 2), tanqidiy fikrlash va ilg'or grammatika.",
        icon: '🏆',
        lessons: [
          {
            id: 'g11-u1-l1',
            number: 1,
            title: 'Lesson 1: Mastering Academic Writing & Linking Words',
            titleUz: '1-dars: Akademik insho yozish va bog\'lovchi so\'zlar',
            summary: "Furthermore, Moreover, In contrast, Consequently bog'lovchilari.",
            readingContent: {
              topic: 'Academic Writing Structure',
              vocabulary: [
                { en: 'Furthermore', uz: 'Bundan tashqari / Qolaversa', phonetic: '[ˌfɜːðəˈmɔːr]' },
                { en: 'Moreover', uz: 'Shuningdek / Buning ustiga', phonetic: '[mɔːrˈəʊvər]' },
                { en: 'In contrast', uz: 'Aksincha / Taqqoslaganda', phonetic: '[ɪn ˈkɒntrɑːst]' },
                { en: 'Consequently', uz: 'Natijada / Binobarin', phonetic: '[ˈkɒnsɪkwəntli]' },
                { en: 'In conclusion', uz: 'Xulosa qilib aytganda', phonetic: '[ɪn kənˈkluːʒn]' },
              ],
              grammarRule: {
                title: 'Discourse Markers & Formal Connectors',
                explanationUz: "Insho va akademik nutqda fikrlarni mantiqiy bog'lash uchun 'Furthermore', 'However', 'Consequently' kabi rasmiy bog'lovchilar ishlatiladi va odatda ulardan so'ng vergul qo'yiladi.",
                examples: [
                  'Furthermore, regular exercise boosts mental clarity.',
                  'Consequently, global temperatures continue to rise.',
                ],
              },
              readingPassage: 'Higher education provides students with essential professional skills. Furthermore, studying abroad exposes young minds to diverse cultures and innovative perspectives. Consequently, university graduates possess competitive advantages in the international labour market.',
            },
            workbookPageNumber: 32,
            workbookExercises: [
              {
                id: 'g11-u1-l1-ex1',
                number: 1,
                title: 'Choose the appropriate connector',
                instruction: '1. To\'g\'ri bog\'lovchi so\'zni tanlang:',
                type: 'multiple_choice',
                items: [
                  {
                    id: 'g11-con-1',
                    question: 'He practiced speaking daily; ______, his band score increased to 8.0.',
                    preText: 'He practiced speaking daily; ',
                    postText: ', his band score increased to 8.0.',
                    correctAnswer: 'consequently',
                    options: ['consequently', 'although', 'because'],
                    explanationUz: "Natijani ifodalash uchun 'consequently' (binobarin, oqibatda) qo'yiladi.",
                  },
                ],
              },
            ],
          },
          {
            id: 'g11-u1-l2',
            number: 2,
            title: 'Lesson 2: Advanced Inversion for Emphasis',
            titleUz: '2-dars: Kuchaytirish uchun inversiya konstruksiyalari',
            summary: "Not only... but also va Seldom/Never inversiyalari.",
            readingContent: {
              topic: 'Inverted Sentence Structures',
              vocabulary: [
                { en: 'Not only... but also', uz: 'Nafaqat... balki ham', phonetic: '[nɒt ˈəʊnli... bʌt ˈɔːlsəʊ]' },
                { en: 'Seldom', uz: 'Kamdan-kam hollarda', phonetic: '[ˈseldəm]' },
                { en: 'Crucial', uz: 'O\'ta muhim', phonetic: '[ˈkruːʃl]' },
              ],
              grammarRule: {
                title: 'Inversion with negative adverbs',
                explanationUz: "Salbiy ravishlar (Never, Rarely, Seldom, Not only) gap boshida kelganda, so'roq gap kabi yordamchi fe'l egadan oldinga o'tadi.",
                examples: ['Never have I seen such a breathtaking view.', 'Not only did he pass, but he also achieved the highest score.'],
              },
              readingPassage: 'Rarely do we encounter individuals with such profound dedication to knowledge. Not only did Abu Ali Ibn Sino master medicine, but he also contributed immensely to philosophy and astronomy.',
            },
            workbookPageNumber: 33,
            workbookExercises: [
              {
                id: 'g11-u1-l2-ex1',
                number: 1,
                title: 'Complete the inverted sentence',
                instruction: '1. Inversiya tartibini to\'g\'ri yozing:',
                type: 'fill_in_blank',
                items: [
                  {
                    id: 'g11-inv-1',
                    question: 'Never ______ I witnessed such brilliance.',
                    preText: 'Never ',
                    postText: ' I witnessed such brilliance.',
                    correctAnswer: 'have',
                    explanationUz: "Never gap boshida kelganda Present Perfect yordamchi fe'li 'have' egadan oldinga chiqadi.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
