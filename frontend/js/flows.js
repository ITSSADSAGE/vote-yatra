/**
 * Flow Definitions
 * Static flow definitions for different personas in multiple languages.
 */

const FlowsData = {
    en: {
        NOT_REGISTERED_FLOW: [
            { title: "Register (Form 6)", description: "Apply for inclusion in the electoral roll by filling Form 6 on voters.eci.gov.in.", action: "Visit voters.eci.gov.in", tip: "Keep your age and residence proof ready.", insight: "Registration is the primary eligibility gate." },
            { title: "Verify name", description: "Once registered, check if your name appears on the electoral roll via the ECI portal.", action: "Search Electoral Roll", tip: "Check using your EPIC number or personal details.", insight: "Verification ensures your name reaches the final roll." },
            { title: "Find booth", description: "Locate your assigned polling station using the Voter Helpline App or ECI website.", action: "Use Booth Locator", tip: "Check the distance and best route to your booth.", insight: "Booth location prevents last-minute hurdles." },
            { title: "Carry ID", description: "Ensure you have your Voter ID (EPIC) or one of the 12 alternative photo identity documents.", action: "Prepare Documents", tip: "Aadhaar Card or PAN Card are also accepted.", insight: "ID verification is mandatory at the entrance." },
            { title: "Vote", description: "Visit the polling station on election day and cast your vote using the EVM.", action: "Go to Booth", tip: "Check the VVPAT slip after pressing the button.", insight: "Your vote is your voice in democracy." }
        ],
        FIRST_TIME_FLOW: [
            { title: "Verify name", description: "Check if your name is correctly listed on the electoral roll for your constituency.", action: "Search Electoral Roll", tip: "Ensure there are no spelling errors in your name.", insight: "Correct details prevent verification issues." },
            { title: "Find booth", description: "Identify your designated polling station to avoid any last-minute confusion.", action: "Locate Booth", tip: "The booth is usually near your registered address.", insight: "Knowing your booth saves time on election day." },
            { title: "Carry ID", description: "Carry your Voter ID card or any other valid photo ID authorized by the ECI.", action: "Check ID Documents", tip: "Keep a digital copy on your phone just in case.", insight: "Documentation is essential for identity proof." },
            { title: "Vote", description: "Exercise your democratic right by casting your vote at the polling station.", action: "Cast Your Vote", tip: "Feel the pride of being a first-time voter!", insight: "Every vote counts towards the nation's future." }
        ],
        RETURNING_FLOW: [
            { title: "Verify booth", description: "Confirm your polling booth as it may change between elections.", action: "Check Booth Location", tip: "Booths are sometimes relocated to nearby buildings.", insight: "Booth changes are common for administrative reasons." },
            { title: "Check candidates", description: "Research the candidates contesting from your constituency to make an informed choice.", action: "View Candidate List", tip: "Use the KYC (Know Your Candidate) app.", insight: "Informed voting leads to better governance." },
            { title: "Vote efficiently", description: "Reach early to avoid queues and cast your vote quickly.", action: "Vote Early", tip: "Early morning hours are usually less crowded.", insight: "Efficiency helps polling officers manage crowds." }
        ],
        LEARNING_FLOW: [
            { title: "What is voting?", description: "Voting is the process by which citizens choose their representatives in the government.", action: "Start Learning", tip: "It's the foundation of democracy.", insight: "Democracy thrives on citizen participation." },
            { title: "Why voting matters", description: "Every single vote helps decide the future of the country and its policies.", action: "Understand Your Impact", tip: "Your voice is your power.", insight: "Policies affect every aspect of your life." },
            { title: "How elections work", description: "India holds General Elections every 5 years for the Lok Sabha and State Assemblies.", action: "Explore the Process", tip: "ECI is the independent body that conducts elections.", insight: "Regular elections ensure accountability." },
            { title: "What happens on voting day", description: "Voters go to booths, get their fingers inked, and use EVMs to cast votes.", action: "See Voting in Action", tip: "The ink mark shows you've done your duty.", insight: "The process is designed to be fair and transparent." }
        ]
    },
    hi: {
        NOT_REGISTERED_FLOW: [
            { title: "पंजीकरण (फॉर्म 6)", description: "voters.eci.gov.in पर फॉर्म 6 भरकर मतदाता सूची में शामिल होने के लिए आवेदन करें।", action: "voters.eci.gov.in पर जाएं", tip: "अपनी आयु और निवास का प्रमाण तैयार रखें।", insight: "पंजीकरण मुख्य पात्रता द्वार है।" },
            { title: "नाम सत्यापित करें", description: "एक बार पंजीकृत होने के बाद, ईसीआई पोर्टल के माध्यम से जांचें कि आपका नाम मतदाता सूची में दिखाई देता है या नहीं।", action: "मतदाता सूची खोजें", tip: "अपने एपिक नंबर या व्यक्तिगत विवरण का उपयोग करके जांचें।", insight: "सत्यापन सुनिश्चित करता है कि आपका नाम अंतिम सूची में पहुंच जाए।" },
            { title: "बूथ खोजें", description: "वोटर हेल्पलाइन ऐप या ईसीआई वेबसाइट का उपयोग करके अपने आवंटित मतदान केंद्र का पता लगाएं।", action: "बूथ लोकेटर का उपयोग करें", tip: "अपने बूथ की दूरी और सर्वोत्तम मार्ग की जांच करें।", insight: "बूथ स्थान अंतिम समय की बाधाओं को रोकता है।" },
            { title: "पहचान पत्र साथ रखें", description: "सुनिश्चित करें कि आपके पास अपना वोटर आईडी (एपिक) या 12 वैकल्पिक फोटो पहचान दस्तावेजों में से एक है।", action: "दस्तावेज तैयार करें", tip: "आधार कार्ड या पैन कार्ड भी स्वीकार किए जाते हैं।", insight: "प्रवेश द्वार पर आईडी सत्यापन अनिवार्य है।" },
            { title: "मतदान", description: "मतदान के दिन मतदान केंद्र पर जाएं और ईवीएम का उपयोग करके अपना वोट डालें।", action: "बूथ पर जाएं", tip: "बटन दबाने के बाद वीवीपीएटी पर्ची की जांच करें।", insight: "लोकतंत्र में आपका वोट आपकी आवाज है।" }
        ],
        FIRST_TIME_FLOW: [
            { title: "नाम सत्यापित करें", description: "जांचें कि क्या आपका नाम आपके निर्वाचन क्षेत्र की मतदाता सूची में सही ढंग से सूचीबद्ध है।", action: "मतदाता सूची खोजें", tip: "सुनिश्चित करें कि आपके नाम में कोई वर्तनी की गलती न हो।", insight: "सही विवरण सत्यापन समस्याओं को रोकते हैं।" },
            { title: "बूथ खोजें", description: "अंतिम समय के भ्रम से बचने के लिए अपने निर्धारित मतदान केंद्र की पहचान करें।", action: "बूथ का पता लगाएं", tip: "बूथ आमतौर पर आपके पंजीकृत पते के पास होता है।", insight: "अपने बूथ को जानने से मतदान के दिन समय की बचत होती है।" },
            { title: "पहचान पत्र साथ रखें", description: "अपना वोटर आईडी कार्ड या ईसीआई द्वारा अधिकृत कोई अन्य वैध फोटो आईडी साथ रखें।", action: "आईडी दस्तावेजों की जांच करें", tip: "सिर्फ मामले में अपने फोन पर एक डिजिटल कॉपी रखें।", insight: "पहचान प्रमाण के लिए दस्तावेज आवश्यक हैं।" },
            { title: "मतदान", description: "मतदान केंद्र पर अपना वोट डालकर अपने लोकतांत्रिक अधिकार का प्रयोग करें।", action: "अपना वोट डालें", tip: "पहली बार मतदाता होने का गर्व महसूस करें!", insight: "हर वोट देश के भविष्य के लिए मायने रखता है।" }
        ],
        RETURNING_FLOW: [
            { title: "बूथ सत्यापित करें", description: "अपने मतदान बूथ की पुष्टि करें क्योंकि यह चुनावों के बीच बदल सकता है।", action: "बूथ स्थान की जांच करें", tip: "बूथ कभी-कभी पास की इमारतों में स्थानांतरित कर दिए जाते हैं।", insight: "प्रशासनिक कारणों से बूथ परिवर्तन सामान्य हैं।" },
            { title: "उम्मीदवारों की जांच करें", description: "एक सूचित विकल्प चुनने के लिए अपने निर्वाचन क्षेत्र से चुनाव लड़ने वाले उम्मीदवारों पर शोध करें।", action: "उम्मीदवार सूची देखें", tip: "केवाईसी (अपने उम्मीदवार को जानें) ऐप का उपयोग करें।", insight: "सूचित मतदान से बेहतर शासन होता है।" },
            { title: "कुशलता से मतदान करें", description: "कतारों से बचने और अपना वोट जल्दी डालने के लिए जल्दी पहुंचें।", action: "जल्दी वोट दें", tip: "सुबह के समय आमतौर पर कम भीड़ होती है।", insight: "दक्षता मतदान अधिकारियों को भीड़ प्रबंधित करने में मदद करती है।" }
        ],
        LEARNING_FLOW: [
            { title: "मतदान क्या है?", description: "मतदान वह प्रक्रिया है जिसके द्वारा नागरिक सरकार में अपने प्रतिनिधियों को चुनते हैं।", action: "मूल बातें सीखें", tip: "यह लोकतंत्र की नींव है।", insight: "लोकतंत्र नागरिकों की भागीदारी पर पनपता है।" },
            { title: "मतदान क्यों मायने रखता है", description: "हर एक वोट देश के भविष्य और उसकी नीतियों को तय करने में मदद करता है।", action: "प्रभाव को समझें", tip: "आपकी आवाज आपकी शक्ति है।", insight: "नीतियां आपके जीवन के हर पहलू को प्रभावित करती हैं।" },
            { title: "चुनाव कैसे काम करते हैं", description: "भारत में हर 5 साल में लोकसभा और विधानसभाओं के लिए आम चुनाव होते हैं।", action: "प्रक्रिया का अन्वेषण करें", tip: "ईसीआई एक स्वतंत्र निकाय है जो चुनाव कराता है।", insight: "नियमित चुनाव जवाबदेही सुनिश्चित करते हैं।" },
            { title: "मतदान के दिन क्या होता है", description: "मतदाता बूथों पर जाते हैं, अपनी उंगलियों पर स्याही लगवाते हैं, और वोट डालने के लिए ईवीएम का उपयोग करते हैं।", action: "दिन देखें", tip: "स्याही का निशान बताता है कि आपने अपना कर्तव्य पूरा कर लिया है।", insight: "प्रक्रिया को निष्पक्ष और पारदर्शी बनाने के लिए डिज़ाइन किया गया है।" }
        ]
    },
    bn: {
        NOT_REGISTERED_FLOW: [
            { title: "নিবন্ধন (ফর্ম ৬)", description: "voters.eci.gov.in-এ ফর্ম ৬ পূরণ করে ভোটার তালিকায় অন্তর্ভুক্তির জন্য আবেদন করুন।", action: "voters.eci.gov.in দেখুন", tip: "আপনার বয়স এবং বাসস্থানের প্রমাণ সাথে রাখুন।", insight: "নিবন্ধনই হলো প্রাথমিক যোগ্যতার ধাপ।" },
            { title: "নাম যাচাই করুন", description: "একবার নিবন্ধিত হলে, ইসিআই পোর্টালের মাধ্যমে আপনার নাম ভোটার তালিকায় আছে কিনা তা যাচাই করুন।", action: "ভোটার তালিকা খুঁজুন", tip: "আপনার এপিক নম্বর বা ব্যক্তিগত বিবরণ ব্যবহার করে দেখুন।", insight: "যাচাইকরণ নিশ্চিত করে যে আপনার নাম চূড়ান্ত তালিকায় পৌঁছেছে।" },
            { title: "বুথ খুঁজুন", description: "ভোটার হেল্পলাইন অ্যাপ বা ইসিআই ওয়েবসাইট ব্যবহার করে আপনার বরাদ্দকৃত পোলিং স্টেশন খুঁজে নিন।", action: "বুথ লোকেটর ব্যবহার করুন", tip: "আপনার বুথের দূরত্ব এবং সেরা পথ দেখে নিন।", insight: "বুথের অবস্থান আগে থেকে জানলে শেষ মুহূর্তের হয়রানি এড়ানো যায়।" },
            { title: "আইডি সাথে রাখুন", description: "আপনার ভোটার আইডি (EPIC) বা ১২টি বিকল্প ফটো পরিচয়পত্রের যেকোনো একটি সাথে আছে কিনা নিশ্চিত করুন।", action: "নথিপত্র প্রস্তুত রাখুন", tip: "আধার কার্ড বা প্যান কার্ডও গ্রহণযোগ্য।", insight: "প্রবেশদ্বারে আইডি যাচাইকরণ বাধ্যতামূলক।" },
            { title: "ভোট দিন", description: "ভোটের দিন পোলিং স্টেশনে যান এবং ইভিএম ব্যবহার করে আপনার ভোট দিন।", action: "বুথে যান", tip: "বোতাম টিপার পর ভিভিপিএটি স্লিপ দেখে নিন।", insight: "গণতন্ত্রে আপনার ভোটই আপনার কণ্ঠস্বর।" }
        ],
        FIRST_TIME_FLOW: [
            { title: "নাম যাচাই করুন", description: "আপনার নির্বাচনী এলাকার ভোটার তালিকায় আপনার নাম সঠিকভাবে আছে কিনা তা দেখে নিন।", action: "ভোটার তালিকা খুঁজুন", tip: "আপনার নামে কোনো বানান ভুল নেই তা নিশ্চিত করুন।", insight: "সঠিক তথ্য যাচাইকরণের সমস্যা দূর করে।" },
            { title: "বুথ খুঁজুন", description: "শেষ মুহূর্তের বিভ্রান্তি এড়াতে আপনার নির্ধারিত পোলিং স্টেশনটি চিনে রাখুন।", action: "বুথ খুঁজুন", tip: "বুথ সাধারণত আপনার নিবন্ধিত ঠিকানার কাছেই থাকে।", insight: "আপনার বুথ আগে থেকে চেনা থাকলে ভোটের দিন সময় বাঁচে।" },
            { title: "আইডি সাথে রাখুন", description: "আপনার ভোটার আইডি কার্ড বা ইসিআই দ্বারা অনুমোদিত অন্য কোনো বৈধ ফটো আইডি সাথে রাখুন।", action: "আইডি নথিপত্র পরীক্ষা করুন", tip: "প্রয়োজনে ফোনে একটি ডিজিটাল কপি রাখুন।", insight: "পরিচয় প্রমাণের জন্য নথিপত্র অপরিহার্য।" },
            { title: "ভোট দিন", description: "পোলিং স্টেশনে আপনার ভোট দিয়ে আপনার গণতান্ত্রিক অধিকার প্রয়োগ করুন।", action: "ভোট দিন", tip: "প্রথমবার ভোটার হিসেবে গর্ব অনুভব করুন!", insight: "প্রতিটি ভোট দেশের ভবিষ্যতের জন্য গুরুত্বপূর্ণ।" }
        ],
        RETURNING_FLOW: [
            { title: "বুথ যাচাই করুন", description: "আপনার পোলিং বুথটি নিশ্চিত করুন কারণ এটি নির্বাচনের মাঝে পরিবর্তিত হতে পারে।", action: "বুথের অবস্থান দেখুন", tip: "বুথ কখনও কখনও কাছাকাছি ভবনে স্থানান্তরিত হয়।", insight: "প্রশাসনিক কারণে বুথ পরিবর্তন সাধারণ বিষয়।" },
            { title: "প্রার্থী যাচাই করুন", description: "সঠিক সিদ্ধান্ত নিতে আপনার নির্বাচনী এলাকা থেকে প্রতিদ্বন্দ্বী প্রার্থীদের সম্পর্কে জানুন।", action: "প্রার্থী তালিকা দেখুন", tip: "KYC (Know Your Candidate) অ্যাপ ব্যবহার করুন।", insight: "সচেতন ভোটদান সুশাসনের পথ প্রশস্ত করে।" },
            { title: "দ্রুত ভোট দিন", description: "লাইন এড়াতে এবং দ্রুত ভোট দিতে সকাল সকাল পৌঁছে যান।", action: "সকালে ভোট দিন", tip: "সকালবেলা সাধারণত ভিড় কম থাকে।", insight: "দ্রুত ভোটদান কর্মকর্তাদের ভিড় সামলাতে সাহায্য করে।" }
        ],
        LEARNING_FLOW: [
            { title: "ভোটদান কী?", description: "ভোটদান হলো সেই প্রক্রিয়া যার মাধ্যমে নাগরিকরা সরকারে তাদের প্রতিনিধি নির্বাচন করেন।", action: "মূল বিষয় জানুন", tip: "এটিই গণতন্ত্রের ভিত্তি।", insight: "নাগরিকদের অংশগ্রহণের ওপরই গণতন্ত্র টিকে থাকে।" },
            { title: "ভোট কেন গুরুত্বপূর্ণ", description: "প্রতিটি ভোটই দেশের ভবিষ্যৎ এবং নীতি নির্ধারণে সাহায্য করে।", action: "প্রভাব বুঝুন", tip: "আপনার কণ্ঠস্বরই আপনার শক্তি।", insight: "সরকারি নীতি আপনার জীবনের প্রতিটি ক্ষেত্রকে প্রভাবিত করে।" },
            { title: "নির্বাচন কীভাবে কাজ করে", description: "ভারতে প্রতি ৫ বছর অন্তর লোকসভা এবং বিধানসভার জন্য সাধারণ নির্বাচন অনুষ্ঠিত হয়।", action: "প্রক্রিয়াটি দেখুন", tip: "ECI হলো একটি স্বাধীন সংস্থা যা নির্বাচন পরিচালনা করে।", insight: "নিয়মিত নির্বাচন স্বচ্ছতা ও দায়বদ্ধতা নিশ্চিত করে।" },
            { title: "ভোটের দিন কী হয়", description: "ভোটাররা বুথে যান, আঙুলে কালি লাগান এবং ভোট দেওয়ার জন্য ইভিএম ব্যবহার করেন।", action: "দিনটি দেখুন", tip: "কালির দাগ প্রমাণ করে যে আপনি আপনার কর্তব্য পালন করেছেন।", insight: "প্রক্রিয়াটি স্বচ্ছ এবং নিরপেক্ষ করার জন্য ডিজাইন করা হয়েছে।" }
        ]
    },
    mr: {
        NOT_REGISTERED_FLOW: [
            { title: "नोंदणी (फॉर्म ६)", description: "voters.eci.gov.in वर फॉर्म ६ भरून मतदार यादीत समावेश करण्यासाठी अर्ज करा.", action: "voters.eci.gov.in ला भेट द्या", tip: "तुमचा वयाचा आणि निवासाचा पुरावा तयार ठेवा.", insight: "नोंदणी ही प्राथमिक पात्रतेची अट आहे." },
            { title: "नाव तपासा", description: "एकदा नोंदणी झाल्यावर, ईसीआय पोर्टलद्वारे तुमचे नाव मतदार यादीत आहे का ते तपासा.", action: "मतदार यादी शोधा", tip: "तुमचा एपिक नंबर किंवा वैयक्तिक तपशील वापरून तपासा.", insight: "पडताळणीमुळे तुमचे नाव अंतिम यादीत असल्याची खात्री होते." },
            { title: "बूथ शोधा", description: "वोटर हेल्पलाइन अॅप किंवा ईसीआय वेबसाइट वापरून तुमचे नियुक्त मतदान केंद्र शोधा.", action: "बूथ लोकेटर वापरा", tip: "तुमच्या बूथचे अंतर आणि सर्वोत्तम मार्ग तपासा.", insight: "बूथचे स्थान आधीच माहित असल्यास गोंधळ टाळता येतो." },
            { title: "ओळखपत्र सोबत ठेवा", description: "तुमचे मतदार ओळखपत्र (EPIC) किंवा ईसीआयने अधिकृत केलेल्या १२ ओळखपत्रांपैकी एक सोबत ठेवा.", action: "कागदपत्रे तयार ठेवा", tip: "आधार कार्ड किंवा पॅन कार्ड देखील चालते.", insight: "प्रवेशद्वारावर ओळखपत्राची पडताळणी अनिवार्य आहे." },
            { title: "मतदान करा", description: "मतदानाच्या दिवशी मतदान केंद्रावर जा आणि ईव्हीएमचा वापर करून तुमचे मत नोंदवा.", action: "बूथवर जा", tip: "बटण दाबल्यावर व्हीव्हीपॅट स्लिप तपासा.", insight: "लोकशाहीत तुमचे मत हीच तुमची शक्ती आहे." }
        ],
        FIRST_TIME_FLOW: [
            { title: "नाव तपासा", description: "तुमच्या मतदारसंघाच्या मतदार यादीत तुमचे नाव योग्यरित्या आहे का ते तपासा.", action: "मतदार यादी शोधा", tip: "तुमच्या नावाच्या स्पेलिंगमध्ये कोणतीही चूक नसल्याची खात्री करा.", insight: "अचूक माहितीमुळे पडताळणीत अडथळे येत नाहीत." },
            { title: "बूथ शोधा", description: "शेवटच्या क्षणी होणारा गोंधळ टाळण्यासाठी तुमचे नियुक्त मतदान केंद्र ओळखून ठेवा.", action: "बूथ शोधा", tip: "बूथ साधारणपणे तुमच्या नोंदणीकृत पत्त्याच्या जवळच असतो.", insight: "बूथ माहित असल्यास मतदानाच्या दिवशी वेळ वाचतो." },
            { title: "ओळखपत्र सोबत ठेवा", description: "तुमचे मतदार ओळखपत्र किंवा इतर कोणतेही वैध फोटो ओळखपत्र सोबत ठेवा.", action: "ओळखपत्र तपासा", tip: "सुरक्षेसाठी फोनमध्ये डिजिटल प्रत ठेवा.", insight: "ओळख पटवण्यासाठी कागदपत्रे आवश्यक आहेत." },
            { title: "मतदान करा", description: "मतदान केंद्रावर जाऊन तुमचे मत नोंदवून तुमच्या लोकशाही अधिकाराचा वापर करा.", action: "मतदान करा", tip: "पहिल्यांदा मतदान केल्याचा अभिमान बाळगा!", insight: "प्रत्येक मत देशाच्या भविष्यासाठी महत्त्वाचे आहे." }
        ],
        RETURNING_FLOW: [
            { title: "बूथ तपासा", description: "तुमचे मतदान केंद्र तपासा कारण ते निवडणुकांच्या दरम्यान बदलू शकते.", action: "बूथचे स्थान तपासा", tip: "बूथ कधीकधी जवळच्या इमारतीत हलवले जातात.", insight: "प्रशासकीय कारणांमुळे बूथमध्ये बदल होऊ शकतात." },
            { title: "उमेदवार तपासा", description: "योग्य निवड करण्यासाठी तुमच्या मतदारसंघातील उमेदवारांची माहिती घ्या.", action: "उमेदवार यादी पहा", tip: "KYC (Know Your Candidate) अॅप वापरा.", insight: "जाणूनबुजून केलेले मतदान उत्तम प्रशासनासाठी गरजेचे आहे." },
            { title: "वेळेवर मतदान करा", description: "रांगा टाळण्यासाठी आणि लवकर मतदान करण्यासाठी सकाळी लवकर पोहोचा.", action: "सकाळी मतदान करा", tip: "सकाळच्या वेळी गर्दी कमी असते.", insight: "लवकर मतदान केल्याने गर्दीचे व्यवस्थापन करणे सोपे जाते." }
        ],
        LEARNING_FLOW: [
            { title: "मतदान म्हणजे काय?", description: "मतदान ही अशी प्रक्रिया आहे ज्याद्वारे नागरिक सरकारमध्ये आपले प्रतिनिधी निवडतात.", action: "मूळ गोष्टी जाणून घ्या", tip: "हा लोकशाहीचा पाया आहे.", insight: "नागरिकांच्या सहभागावरच लोकशाही अवलंबून असते." },
            { title: "मतदान का महत्त्वाचे आहे?", description: "प्रत्येक मत देशाचे भविष्य आणि धोरणे ठरवण्यास मदत करते.", action: "प्रभाव समजून घ्या", tip: "तुमचा आवाज हीच तुमची शक्ती आहे.", insight: "शासनाची धोरणे तुमच्या जीवनावर परिणाम करतात." },
            { title: "निवडणूक प्रक्रिया कशी असते?", description: "भारतात दर ५ वर्षांनी लोकसभा आणि विधानसभेसाठी निवडणुका होतात.", action: "प्रक्रिया समजून घ्या", tip: "निवडणूक आयोग ही एक स्वतंत्र संस्था आहे.", insight: "नियमित निवडणुकांमुळे उत्तरदायित्व राहते." },
            { title: "मतदानाच्या दिवशी काय होते?", description: "मतदार बूथवर जातात, बोटाला शाई लावतात आणि मतदानासाठी ईव्हीएम वापरतात.", action: "प्रक्रिया पहा", tip: "शाईचा डाग तुम्ही कर्तव्य पार पाडल्याचे प्रतीक आहे.", insight: "प्रक्रिया पारदर्शक आणि निष्पक्ष असते." }
        ]
    },
    te: {
        NOT_REGISTERED_FLOW: [
            { title: "నమోదు (ఫారమ్ 6)", description: "voters.eci.gov.in లో ఫారమ్ 6 పూరించడం ద్వారా ఓటరు జాబితాలో చేరడానికి దరఖాస్తు చేసుకోండి.", action: "voters.eci.gov.in సందర్శించండి", tip: "మీ వయస్సు మరియు నివాస ధృవీకరణ పత్రాలను సిద్ధంగా ఉంచుకోండి.", insight: "నమోదు అనేది ఓటు హక్కుకు మొదటి మెట్టు." },
            { title: "పేరు తనిఖీ చేయండి", description: "నమోదు చేసుకున్న తర్వాత, ఓటరు జాబితాలో మీ పేరు ఉందో లేదో ఈసీఐ పోర్టల్ ద్వారా తనిఖీ చేయండి.", action: "ఓటరు జాబితా శోధించండి", tip: "మీ EPIC నంబర్ లేదా వ్యక్తిగత వివరాలతో తనిఖీ చేయండి.", insight: "ధృవీకరణ మీ పేరు తుది జాబితాలో ఉందని నిర్ధారిస్తుంది." },
            { title: "బూత్ కనుగొనండి", description: "ఓటరు హెల్ప్‌లైన్ యాప్ లేదా ఈసీఐ వెబ్‌సైట్ ద్వారా మీకు కేటాయించిన పోలింగ్ కేంద్రాన్ని కనుగొనండి.", action: "బూత్ లోకేటర్ వాడండి", tip: "బూత్ దూరం మరియు మార్గాన్ని తనిఖీ చేయండి.", insight: "ముందుగానే బూత్ వివరాలు తెలుసుకోవడం వల్ల ఇబ్బందులు తప్పుతాయి." },
            { title: "ఐడీ కార్డు తీసుకెళ్లండి", description: "మీ ఓటరు ఐడీ (EPIC) లేదా ఈసీఐ గుర్తించిన 12 గుర్తింపు కార్డులలో ఒకటి మీతో ఉండేలా చూసుకోండి.", action: "పత్రాలను సిద్ధం చేసుకోండి", tip: "ఆధార్ కార్డు లేదా పాన్ కార్డు కూడా చెల్లుతాయి.", insight: "పోలింగ్ కేంద్రం వద్ద గుర్తింపు కార్డు తప్పనిసరి." },
            { title: "ఓటు వేయండి", description: "ఎన్నికల రోజున పోలింగ్ కేంద్రానికి వెళ్లి ఈవీఎం ద్వారా మీ ఓటు వేయండి.", action: "బూత్‌కు వెళ్లండి", tip: "బటన్ నొక్కిన తర్వాత వీవీప్యాట్ స్లిప్‌ను గమనించండి.", insight: "ప్రజాస్వామ్యంలో మీ ఓటే మీ ఆయుధం." }
        ],
        FIRST_TIME_FLOW: [
            { title: "పేరు తనిఖీ చేయండి", description: "మీ నియోజకవర్గ ఓటరు జాబితాలో మీ పేరు సరిగ్గా ఉందో లేదో చూడండి.", action: "ఓటరు జాబితా శోధించండి", tip: "మీ పేరు స్పెల్లింగ్ తప్పులు లేకుండా చూసుకోండి.", insight: "సరియైన వివరాలు ఉంటే ఇబ్బందులు ఉండవు." },
            { title: "బూత్ కనుగొనండి", description: "చివరి నిమిషంలో అయోమయం లేకుండా మీ పోలింగ్ కేంద్రాన్ని గుర్తించండి.", action: "బూత్‌ను గుర్తించండి", tip: "సాధారణంగా బూత్ మీ ఇంటికి దగ్గరలోనే ఉంటుంది.", insight: "బూత్ వివరాలు తెలిస్తే సమయం ఆదా అవుతుంది." },
            { title: "ఐడీ కార్డు తీసుకెళ్లండి", description: "మీ ఓటరు ఐడీ లేదా ఏదైనా ఇతర గుర్తింపు కార్డు వెంట ఉంచుకోండి.", action: "ఐడీ కార్డును తనిఖీ చేయండి", tip: "ఫోన్‌లో ఒక డిజిటల్ కాపీని కూడా ఉంచుకోండి.", insight: "గుర్తింపు నిరూపణకు పత్రాలు అవసరం." },
            { title: "ఓటు వేయండి", description: "పోలింగ్ కేంద్రానికి వెళ్లి మీ ఓటు వేయడం ద్వారా మీ ప్రజాస్వామ్య హక్కును వినియోగించుకోండి.", action: "ఓటు వేయండి", tip: "మొదటిసారి ఓటు వేస్తున్నందుకు గర్వపడండి!", insight: "ప్రతి ఓటూ దేశ భవిష్యత్తుకు కీలకం." }
        ],
        RETURNING_FLOW: [
            { title: "బూత్ తనిఖీ చేయండి", description: "ఎన్నికల మధ్యలో బూత్ మారే అవకాశం ఉంటుంది కాబట్టి మీ బూత్‌ను నిర్ధారించుకోండి.", action: "బూత్ స్థలాన్ని తనిఖీ చేయండి", tip: "బూత్‌లు అప్పుడప్పుడు దగ్గరలోని భవనాలకు మారుతుంటాయి.", insight: "పరిపాలనా పరంగా బూత్‌లు మారే అవకాశం ఉంటుంది." },
            { title: "అభ్యర్థుల వివరాలు తెలుసుకోండి", description: "సరైన నిర్ణయం తీసుకోవడానికి మీ నియోజకవర్గ అభ్యర్థుల గురించి తెలుసుకోండి.", action: "అభ్యర్థుల జాబితాను చూడండి", tip: "KYC యాప్‌ను ఉపయోగించండి.", insight: "అవగాహనతో ఓటు వేయడం వల్ల మంచి నాయకత్వం లభిస్తుంది." },
            { title: "ఓటు త్వరగా వేయండి", description: "క్యూ లైన్ల ఇబ్బంది లేకుండా ఉండాలంటే ఉదయాన్నే వెళ్లండి.", action: "ముందుగా ఓటు వేయండి", tip: "ఉదయం వేళల్లో రద్దీ తక్కువగా ఉంటుంది.", insight: "త్వరగా వెళ్లడం వల్ల పోలింగ్ సులువుగా ముగుస్తుంది." }
        ],
        LEARNING_FLOW: [
            { title: "ఓటింగ్ అంటే ఏమిటి?", description: "ప్రజలు తమ ప్రతినిధులను ఎన్నుకునే ప్రక్రియనే ఓటింగ్ అంటారు.", action: "ప్రాథమిక విషయాలు తెలుసుకోండి", tip: "ఇది ప్రజాస్వామ్యానికి పునాది.", insight: "ప్రజల భాగస్వామ్యంతోనే ప్రజాస్వామ్యం విరాజిల్లుతుంది." },
            { title: "ఓటు ఎందుకు వేయాలి?", description: "ప్రతి ఓటూ దేశ భవిష్యత్తును మరియు ప్రభుత్వ విధానాలను నిర్ణయిస్తుంది.", action: "ప్రభావాన్ని అర్థం చేసుకోండి", tip: "మీ గొంతే మీ శక్తి.", insight: "ప్రభుత్వ నిర్ణయాలు మన జీవితాలపై ప్రభావం చూపుతాయి." },
            { title: "ఎన్నికలు ఎలా జరుగుతాయి?", description: "భారతదేశంలో ప్రతి 5 ఏళ్లకు ఒకసారి లోక్‌సభ మరియు అసెంబ్లీ ఎన్నికలు జరుగుతాయి.", action: "ప్రక్రియను అన్వేషించండి", tip: "ఎన్నికల సంఘం ఎన్నికలను నిర్వహిస్తుంది.", insight: "క్రమం తప్పకుండా ఎన్నికలు జరగడం వల్ల జవాబుదారీతనం ఉంటుంది." },
            { title: "ఎన్నికల రోజున ఏం జరుగుతుంది?", description: "ఓటర్లు బూత్‌లకు వెళ్లి, వేలికి సిరా వేయించుకుని ఓటు వేస్తారు.", action: "ఆ రోజు ఏం జరుగుతుందో చూడండి", tip: "వేలిపై సిరా గుర్తు బాధ్యతకు నిదర్శనం.", insight: "ప్రక్రియ పారదర్శకంగా మరియు నిష్పక్షపాతంగా ఉంటుంది." }
        ]
    }
};

const Flows = {
    getFlow: function(flowName, lang) {
        const language = FlowsData[lang] ? lang : 'en';
        return FlowsData[language][flowName] || FlowsData['en'][flowName];
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Flows;
} else {
    window.Flows = Flows;
}
