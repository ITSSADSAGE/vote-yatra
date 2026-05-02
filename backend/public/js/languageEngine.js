/**
 * Multilingual Engine - Frontend Only
 * Handles UI translations including journeys and static text.
 */

const LanguageEngine = {
    currentLanguage: 'en',
    
    translations: {
        en: {
            "header_desc": "A personalized step-by-step guide to help you understand and complete your voting journey.",
            "title": "Start Your VoteYatra",
            "subtitle": "Enter your age and select your current voting status.",
            "age_placeholder": "Enter your age (must be 18+)",
            "first_time": "First-time voter (already registered)",
            "not_registered": "Not registered yet (apply now)",
            "already_registered": "I have voted before",
            "demo_journey": "View how voting works",
            "journey_title": "Your Voting Journey",
            "learning_title": "Voter Education Hub",
            "learning_mode": "Learning Mode",
            "learning_hook": "Let's break down how voting works in India",
            "prev": "Previous",
            "next": "Continue",
            "next_step": "Next Step",
            "start_sim": "Start Voting Simulation",
            "find_booth": "📍 Find Nearby Polling Booths (Beta)",
            "step_counter": "Step {n}",
            "step_of_total": "Step {n} of {total}",
            "error_age": "Please enter a valid age.",
            "error_underage": "You must be at least 18 to vote in India. You can still explore how the voting process works.",
            "eci_guidelines": "🗳️ Based on Election Commission of India guidelines",
            "why_matters": "Why this matters:",
            "tip_label": "Tip:"
        },
        hi: {
            "header_desc": "आपकी मतदान यात्रा को समझने और पूरा करने में आपकी मदद करने के लिए एक व्यक्तिगत चरण-दर-चरण मार्गदर्शिका।",
            "title": "अपनी वोटयात्रा शुरू करें",
            "subtitle": "अपनी उम्र दर्ज करें और अपनी वर्तमान मतदान स्थिति चुनें।",
            "age_placeholder": "अपनी उम्र दर्ज करें (18+ होना चाहिए)",
            "first_time": "पहली बार मतदाता (पहले से पंजीकृत)",
            "not_registered": "अभी तक पंजीकृत नहीं (अभी आवेदन करें)",
            "already_registered": "मैंने पहले वोट दिया है",
            "demo_journey": "देखें कि मतदान कैसे काम करता है",
            "journey_title": "आपकी मतदान यात्रा",
            "learning_title": "मतदाता शिक्षा केंद्र",
            "learning_mode": "लर्निंग मोड",
            "learning_hook": "आइए विस्तार से समझें कि भारत में मतदान कैसे होता है",
            "prev": "पिछला",
            "next": "जारी रखें",
            "next_step": "अगला चरण",
            "start_sim": "मतदान सिमुलेशन शुरू करें",
            "find_booth": "📍 पास के मतदान केंद्र खोजें (बीटा)",
            "step_counter": "चरण {n}",
            "step_of_total": "चरण {total} में से {n}",
            "error_age": "कृपया एक मान्य आयु दर्ज करें।",
            "error_underage": "भारत में मतदान करने के लिए आपकी आयु कम से कम 18 वर्ष होनी चाहिए। आप अभी भी देख सकते हैं कि मतदान प्रक्रिया कैसे काम करती है।",
            "eci_guidelines": "🗳️ भारत निर्वाचन आयोग के दिशा-निर्देशों पर आधारित",
            "why_matters": "यह क्यों मायने रखता है:",
            "tip_label": "सुझाव:"
        },
        mr: {
            "header_desc": "तुमच्या मतदान प्रवासाला समजण्यास आणि पूर्ण करण्यास मदत करण्यासाठी एक वैयक्तिक चरण-दर-चरण मार्गदर्शक।",
            "title": "तुमची वोटयात्रा सुरू करा",
            "subtitle": "तुमचे वय टाका आणि तुमची सद्यस्थिती निवडा।",
            "age_placeholder": "तुमचे वय टाका (१८+ असणे आवश्यक)",
            "first_time": "पहिल्यांदा मतदार (आधीच नोंदणीकृत)",
            "not_registered": "अजून नोंदणी केली नाही (आता अर्ज करा)",
            "already_registered": "मी आधी मतदान केले आहे",
            "demo_journey": "मतदान कसे होते ते पहा",
            "journey_title": "तुमचा मतदान प्रवास",
            "learning_title": "मतदार शिक्षण केंद्र",
            "learning_mode": "लर्निंग मोड",
            "learning_hook": "भारतात मतदान कसे होते ते समजून घेऊया",
            "prev": "मागे",
            "next": "पुढे चला",
            "next_step": "पुढील चरण",
            "start_sim": "मतदान सिम्युलेशन सुरू करा",
            "find_booth": "📍 जवळचे मतदान केंद्र शोधा (बीटा)",
            "step_counter": "चरण {n}",
            "step_of_total": "{total} पैकी {n} चरण",
            "error_age": "कृपया एक वैध वय टाका।",
            "error_underage": "भारतात मतदान करण्यासाठी तुमचे वय किमान १८ वर्षे असणे आवश्यक आहे। तुम्ही तरीही मतदान प्रक्रिया कशी कार्य करते ते पाहू शकता।",
            "eci_guidelines": "🗳️ भारतीय निवडणूक आयोगाच्या मार्गदर्शक तत्त्वांवर आधारित",
            "why_matters": "हे का महत्त्वाचे आहे:",
            "tip_label": "टीप:"
        },
        bn: {
            "header_desc": "আপনার ভোটদান যাত্রা বুঝতে এবং সম্পন্ন করতে সাহায্য করার জন্য একটি ব্যক্তিগতকৃত ধাপে-ধাপে গাইড।",
            "title": "আপনার ভোটযাত্রা শুরু করুন",
            "subtitle": "আপনার বয়স লিখুন এবং আপনার বর্তমান ভোটদান অবস্থা নির্বাচন করুন।",
            "age_placeholder": "আপনার বয়স লিখুন (১৮+ হতে হবে)",
            "first_time": "প্রথমবার ভোটার (ইতিমধ্যে নিবন্ধিত)",
            "not_registered": "এখনও নিবন্ধন করেননি (এখনই আবেদন করুন)",
            "already_registered": "আমি আগে ভোট দিয়েছি",
            "demo_journey": "ভোটদান কীভাবে কাজ করে দেখুন",
            "journey_title": "আপনার ভোটদান যাত্রা",
            "learning_title": "ভোটার শিক্ষা কেন্দ্র",
            "learning_mode": "লার্নিং মোড",
            "learning_hook": "ভারতে ভোটদান কীভাবে কাজ করে তা বুঝে নেওয়া যাক",
            "prev": "পূর্ববর্তী",
            "next": "চালিয়ে যান",
            "next_step": "পরবর্তী ধাপ",
            "start_sim": "ভোটদান সিমুলেশন শুরু করুন",
            "find_booth": "📍 কাছের ভোটকেন্দ্র খুঁজুন (বেটা)",
            "step_counter": "ধাপ {n}",
            "step_of_total": "{total} এর মধ্যে {n} ধাপ",
            "error_age": "অনুগ্রহ করে একটি বৈধ বয়স লিখুন।",
            "error_underage": "ভারতে ভোট দিতে আপনার বয়স কমপক্ষে ১৮ বছর হতে হবে। আপনি তবুও ভোটদান প্রক্রিয়া কীভাবে কাজ করে তা দেখতে পারেন।",
            "eci_guidelines": "🗳️ ভারতীয় নির্বাচন কমিশনের নির্দেশিকার উপর ভিত্তি করে",
            "why_matters": "এটি কেন গুরুত্বপূর্ণ:",
            "tip_label": "টিপ:"
        },
        te: {
            "header_desc": "మీ ఓటింగ్ ప్రయాణాన్ని అర్థం చేసుకోవడానికి మరియు పూర్తి చేయడానికి మీకు సహాయపడే వ్యక్తిగతీకరించిన దశల వారీ గైడ్.",
            "title": "మీ వోట్‌యాత్రను ప్రారంభించండి",
            "subtitle": "మీ వయస్సు నమోదు చేయండి మరియు మీ ప్రస్తుత ఓటింగ్ స్థితిని ఎంచుకోండి.",
            "age_placeholder": "మీ వయస్సు నమోదు చేయండి (18+ అయి ఉండాలి)",
            "first_time": "మొదటిసారి ఓటరు (ఇప్పటికే నమోదు చేసుకున్నారు)",
            "not_registered": "ఇంకా నమోదు చేసుకోలేదు (ఇప్పుడు దరఖాస్తు చేయండి)",
            "already_registered": "నేను ముందే ఓటు వేశాను",
            "demo_journey": "ఓటింగ్ ఎలా జరుగుతుందో చూడండి",
            "journey_title": "మీ ఓటింగ్ ప్రయాణం",
            "learning_title": "ఓటరు విద్యా కేంద్రం",
            "learning_mode": "లెర్నింగ్ మోడ్",
            "learning_hook": "భారతదేశంలో ఓటింగ్ ఎలా జరుగుతుందో అర్థం చేసుకుందాం",
            "prev": "వెనుకకు",
            "next": "కొనసాగించండి",
            "next_step": "తదుపరి దశ",
            "start_sim": "ఓటింగ్ సిమ్యులేషన్ ప్రారంభించండి",
            "find_booth": "📍 సమీప పోలింగ్ బూత్‌లు కనుగొనండి (బీటా)",
            "step_counter": "దశ {n}",
            "step_of_total": "{total} లో {n} దశ",
            "error_age": "దయచేసి చెల్లుబాటయ్యే వయస్సు నమోదు చేయండి.",
            "error_underage": "భారతదేశంలో ఓటు వేయడానికి మీకు కనీసం 18 సంవత్సరాలు ఉండాలి. మీరు ఓటింగ్ ప్రక్రియ ఎలా పని చేస్తుందో ఇంకా చూడవచ్చు.",
            "eci_guidelines": "🗳️ భారత ఎన్నికల కమిషన్ మార్గదర్శకాల ఆధారంగా",
            "why_matters": "ఇది ఎందుకు ముఖ్యమైనది:",
            "tip_label": "చిట్కా:"
        }
    },

    init: function() {
        const savedLang = localStorage.getItem('voteYatraLang') || 'en';
        this.setLanguage(savedLang);
    },

    setLanguage: function(lang) {
        // Accept the language if it has UI translations OR flow data (falls back to 'en' for UI keys)
        const isValid = this.translations[lang] || (typeof FlowsData !== 'undefined' && FlowsData[lang]);
        if (isValid) {
            this.currentLanguage = lang;
            localStorage.setItem('voteYatraLang', lang);
            this.applyLanguage();
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        }
    },

    getText: function(key) {
        return (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) || 
               (this.translations['en'][key]) || key;
    },

    applyLanguage: function() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            let text = this.getText(key);
            
            if (key === 'step_counter' && el.hasAttribute('data-step')) {
                text = text.replace('{n}', el.getAttribute('data-step'));
            }
            
            if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        });
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageEngine;
} else {
    window.LanguageEngine = LanguageEngine;
}
