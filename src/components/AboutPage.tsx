"use client"

import { BookOpen, Users, Globe, Heart, Award, Target, Languages, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AboutPageProps {
  onBack: () => void
  onCategorySelect?: (category: string) => void
  currentLanguage?: string
}

const AboutPage = ({ onBack, onCategorySelect, currentLanguage = "english" }: AboutPageProps) => {
  // Language configurations with translations - NO LANGUAGE SWITCHING
  const languageConfig = {
    arabic: {
      code: "ar",
      name: "العربية",
      translations: {
        aboutDeenMastery: "عن إتقان الدين",
        panLingualLibrary:
          "إتقان الدين هو أول مكتبة متعددة اللغات ومُتحققة خارجياً للنصوص الإسلامية الكلاسيكية في العالم. نحن ملتزمون بإضفاء الطابع الديمقراطي على الوصول إلى الأعمال التي كانت محبوسة سابقاً وراء حواجز اللغة والحراسة الأكاديمية - مما يجعلها متاحة للقراء في جميع مستويات الخبرة.",
        shamela:
          "حتى الآن، قمنا بدمج مجموعة الشاملة، مع التخطيط لمجموعات كلاسيكية ومعاصرة إضافية مع استمرارنا في التوسع.",
        supportedLanguages: "اللغات المدعومة",
        languageList: [
          "الإنجليزية",
          "الإسبانية",
          "الألمانية",
          "البرتغالية",
          "الأردية",
          "التركية",
          "البهاسا",
          "العربية",
        ],
        legacy:
          "يبني هذا المشروع على أكثر من 15 عاماً من العمل الرائد في إمكانية الوصول القرآني عبر الإنجليزية والإسبانية والفرنسية والألمانية والبهاسا. مع إتقان الدين، نوسع هذا الإرث إلى نطاق أوسع من الأدب الإسلامي - نقدم ليس فقط الموارد متعددة اللغات، ولكن أيضاً الترجمات في اللهجات الإقليمية والأشكال العامية للغات العالمية الرئيسية.",
        whetherYouAre: "سواء كنت:",
        parent: "والداً يبحث عن كتب قصص لعائلتك،",
        academic: "أكاديمياً في حاجة إلى ترجمات مرجعية موثوقة، أو",
        learner: "متعلماً مدى الحياة في رحلة شخصية للنمو،",
        designedForYou: "إتقان الدين مصمم لتلبية احتياجاتك.",
        qualityAccuracy: "الجودة والدقة",
        currentDevelopment:
          "هذه المكتبة قيد التطوير النشط حالياً. خط أنابيب LLM الخاص بنا يتفوق في الفروق السياقية والكلمات القديمة والبنية الجملية غير العادية. هذا يعني أنه مناسب تماماً لمهمة ترجمة العربية الكلاسيكية... ويتحسن فقط.",
        currentAccuracy: "الدقة الحالية: ~85%",
        hallucinations:
          "معظم المشاكل المتبقية ترجع إلى الهلوسة (أي الإدراجات الإبداعية المفرطة من قبل نماذج الذكاء الاصطناعي) بدلاً من الترجمات الخاطئة تماماً.",
        knownIssues: "المشاكل المعروفة تشمل:",
        issue1: "الترجمة الحرفية في الوقت غير المناسب (حيث يقوم النموذج بترجمة المحتوى الذي يجب ترجمته، أو العكس)",
        issue2: "اختيار الضمير غير الصحيح",
        issue3: "النموذج يختار معنى ضيق بدلاً من المعاني الواسعة",
        patience: "نقدر صبركم وملاحظاتكم بينما نحسن ونطور. التزامنا هو النزاهة الأكاديمية والدقة اللغوية وثقة القارئ.",
        whatMakesDifferent: "ما يجعلنا مختلفين",
        panLingualAccess: "الوصول متعدد اللغات",
        breakingBarriers: "كسر حواجز اللغة بالترجمات في لغات متعددة ولهجات إقليمية.",
        externallyValidated: "مُتحقق خارجياً",
        rigorousValidation: "ترجماتنا تخضع لعمليات تحقق صارمة لضمان الدقة والأصالة.",
        forAllLevels: "لجميع المستويات",
        beginnersToScholars: "من المبتدئين إلى العلماء المتقدمين، مواردنا تلبي القراء في كل مستوى من مستويات الخبرة.",
        browseByCategory: "تصفح حسب الفئة",
        poweredByAI: "مدعوم بالذكاء الاصطناعي المتقدم",
        aiDescription:
          "خط أنابيب LLM الخاص بنا مصمم خصيصاً للنصوص العربية الكلاسيكية، متفوق في الفروق السياقية والمفردات القديمة والبنى الجملية المعقدة التي تكافح أدوات الترجمة التقليدية معها.",
        contextualUnderstanding: "الفهم السياقي",
        advancedComprehension: "فهم متقدم للفروق العربية الكلاسيكية",
        continuousLearning: "التعلم المستمر",
        improvingModels: "نماذج الذكاء الاصطناعي التي تتحسن مع كل ترجمة",
        qualityAssurance: "ضمان الجودة",
        multiLayerValidation: "عمليات التحقق والمراجعة متعددة الطبقات",
        joinMission: "انضم إلى مهمتنا",
        helpDemocratize:
          "ساعدنا في إضفاء الطابع الديمقراطي على الوصول إلى المعرفة الإسلامية. سواء كنت قارئاً أو مترجماً أو داعماً، هناك مكان لك في مجتمعنا المتنامي.",
        exploreLibrary: "استكشف مكتبتنا",
      },
    },
    english: {
      code: "en",
      name: "English",
      translations: {
        aboutDeenMastery: "About Deen Mastery",
        panLingualLibrary:
          "Deen Mastery is the world's first pan-lingual, externally validated library of classical Islamic texts. We are committed to democratizing access to works that were previously locked behind language barriers and scholarly gatekeeping—making them available to readers at all levels of expertise.",
        shamela:
          "To date, we have integrated the Shamela corpus, with additional classical and contemporary corpora planned as we continue to expand.",
        supportedLanguages: "Supported Languages",
        languageList: ["English", "Spanish", "German", "Portuguese", "Urdu", "Turkish", "Bahasa", "Arabic"],
        legacy:
          "This project builds on over 15 years of pioneering work in Qur'anic accessibility across English, Spanish, French, German, and Bahasa. With Deen Mastery, we extend that legacy to a broader range of Islamic literature—offering not only multilingual resources, but also translations in regional dialects and vernacular forms of major world languages.",
        whetherYouAre: "Whether you are:",
        parent: "a parent seeking storybooks for your family,",
        academic: "an academic in need of reliable reference translations, or",
        learner: "a lifelong learner on a personal journey of growth,",
        designedForYou: "Deen Mastery is designed to meet your needs.",
        qualityAccuracy: "Quality & Accuracy",
        currentDevelopment:
          "This library is currently in active development. Our proprietary LLM pipeline excels at contextual nuance, archaic words, unusual sentence structure. That means it's perfectly suited at the task of classical Arabic translation….and only getting better.",
        currentAccuracy: "Current Accuracy: ~85%",
        hallucinations:
          "Most remaining issues are due to hallucinations (i.e., overly creative insertions by AI models) rather than outright mistranslations.",
        knownIssues: "Known Issues Include:",
        issue1:
          "Untimely transliteration (where the model transliterates content that should be translated, or vice versa)",
        issue2: "Improper pronoun selection",
        issue3: "Model selects narrow meaning instead of broad meanings",
        patience:
          "We appreciate your patience and feedback as we refine and improve. Our commitment is to academic integrity, linguistic precision, and reader trust.",
        whatMakesDifferent: "What Makes Us Different",
        panLingualAccess: "Pan-Lingual Access",
        breakingBarriers:
          "Breaking down language barriers with translations in multiple languages and regional dialects.",
        externallyValidated: "Externally Validated",
        rigorousValidation:
          "Our translations undergo rigorous validation processes to ensure accuracy and authenticity.",
        forAllLevels: "For All Levels",
        beginnersToScholars:
          "From beginners to advanced scholars, our resources cater to readers at every level of expertise.",
        browseByCategory: "Browse by Category",
        poweredByAI: "Powered by Advanced AI",
        aiDescription:
          "Our proprietary LLM pipeline is specifically designed for classical Arabic texts, excelling at contextual nuance, archaic vocabulary, and complex sentence structures that traditional translation tools struggle with.",
        contextualUnderstanding: "Contextual Understanding",
        advancedComprehension: "Advanced comprehension of classical Arabic nuances",
        continuousLearning: "Continuous Learning",
        improvingModels: "AI models that improve with each translation",
        qualityAssurance: "Quality Assurance",
        multiLayerValidation: "Multi-layer validation and review processes",
        joinMission: "Join Our Mission",
        helpDemocratize:
          "Help us democratize access to Islamic knowledge. Whether you're a reader, translator, or supporter, there's a place for you in our growing community.",
        exploreLibrary: "Explore Our Library",
      },
    },
    spanish: {
      code: "es",
      name: "Español",
      translations: {
        aboutDeenMastery: "Acerca de Deen Mastery",
        panLingualLibrary:
          "Deen Mastery es la primera biblioteca pan-lingüística y externamente validada del mundo de textos islámicos clásicos. Estamos comprometidos a democratizar el acceso a obras que anteriormente estaban bloqueadas detrás de barreras idiomáticas y custodia académica, haciéndolas disponibles para lectores de todos los niveles de experiencia.",
        shamela:
          "Hasta la fecha, hemos integrado el corpus Shamela, con corpus clásicos y contemporáneos adicionales planeados mientras continuamos expandiéndonos.",
        supportedLanguages: "Idiomas Soportados",
        languageList: ["Inglés", "Español", "Alemán", "Portugués", "Urdu", "Turco", "Bahasa", "Árabe"],
        legacy:
          "Este proyecto se basa en más de 15 años de trabajo pionero en accesibilidad coránica a través del inglés, español, francés, alemán y bahasa. Con Deen Mastery, extendemos ese legado a una gama más amplia de literatura islámica, ofreciendo no solo recursos multilingües, sino también traducciones en dialectos regionales y formas vernáculas de los principales idiomas mundiales.",
        whetherYouAre: "Ya seas:",
        parent: "un padre buscando libros de cuentos para tu familia,",
        academic: "un académico que necesita traducciones de referencia confiables, o",
        learner: "un aprendiz de por vida en un viaje personal de crecimiento,",
        designedForYou: "Deen Mastery está diseñado para satisfacer tus necesidades.",
        qualityAccuracy: "Calidad y Precisión",
        currentDevelopment:
          "Esta biblioteca está actualmente en desarrollo activo. Nuestro pipeline LLM propietario sobresale en matices contextuales, palabras arcaicas, estructura de oraciones inusuales. Eso significa que está perfectamente adaptado para la tarea de traducción árabe clásica... y solo mejorando.",
        currentAccuracy: "Precisión Actual: ~85%",
        hallucinations:
          "La mayoría de los problemas restantes se deben a alucinaciones (es decir, inserciones demasiado creativas por modelos de IA) en lugar de traducciones erróneas directas.",
        knownIssues: "Los Problemas Conocidos Incluyen:",
        issue1:
          "Transliteración inoportuna (donde el modelo transliterar contenido que debería traducirse, o viceversa)",
        issue2: "Selección incorrecta de pronombres",
        issue3: "El modelo selecciona significado estrecho en lugar de significados amplios",
        patience:
          "Apreciamos tu paciencia y comentarios mientras refinamos y mejoramos. Nuestro compromiso es con la integridad académica, la precisión lingüística y la confianza del lector.",
        whatMakesDifferent: "Lo Que Nos Hace Diferentes",
        panLingualAccess: "Acceso Pan-Lingüístico",
        breakingBarriers:
          "Rompiendo barreras idiomáticas con traducciones en múltiples idiomas y dialectos regionales.",
        externallyValidated: "Externamente Validado",
        rigorousValidation:
          "Nuestras traducciones pasan por procesos de validación rigurosos para asegurar precisión y autenticidad.",
        forAllLevels: "Para Todos los Niveles",
        beginnersToScholars:
          "Desde principiantes hasta académicos avanzados, nuestros recursos atienden a lectores en cada nivel de experiencia.",
        browseByCategory: "Navegar por Categoría",
        poweredByAI: "Impulsado por IA Avanzada",
        aiDescription:
          "Nuestro pipeline LLM propietario está específicamente diseñado para textos árabes clásicos, sobresaliendo en matices contextuales, vocabulario arcaico y estructuras de oraciones complejas con las que las herramientas de traducción tradicionales luchan.",
        contextualUnderstanding: "Comprensión Contextual",
        advancedComprehension: "Comprensión avanzada de matices árabes clásicos",
        continuousLearning: "Aprendizaje Continuo",
        improvingModels: "Modelos de IA que mejoran con cada traducción",
        qualityAssurance: "Aseguramiento de Calidad",
        multiLayerValidation: "Procesos de validación y revisión multicapa",
        joinMission: "Únete a Nuestra Misión",
        helpDemocratize:
          "Ayúdanos a democratizar el acceso al conocimiento islámico. Ya seas lector, traductor o partidario, hay un lugar para ti en nuestra comunidad en crecimiento.",
        exploreLibrary: "Explora Nuestra Biblioteca",
      },
    },
    german: {
      code: "de",
      name: "Deutsch",
      translations: {
        aboutDeenMastery: "Über Deen Mastery",
        panLingualLibrary:
          "Deen Mastery ist die weltweit erste pan-linguale, extern validierte Bibliothek klassischer islamischer Texte. Wir sind verpflichtet, den Zugang zu Werken zu demokratisieren, die zuvor hinter Sprachbarrieren und wissenschaftlicher Bevormundung eingesperrt waren - und sie Lesern aller Erfahrungsstufen zugänglich zu machen.",
        shamela:
          "Bis heute haben wir das Shamela-Korpus integriert, mit zusätzlichen klassischen und zeitgenössischen Korpora geplant, während wir weiter expandieren.",
        supportedLanguages: "Unterstützte Sprachen",
        languageList: ["Englisch", "Spanisch", "Deutsch", "Portugiesisch", "Urdu", "Türkisch", "Bahasa", "Arabisch"],
        legacy:
          "Dieses Projekt baut auf über 15 Jahren Pionierarbeit in der Koran-Zugänglichkeit über Englisch, Spanisch, Französisch, Deutsch und Bahasa auf. Mit Deen Mastery erweitern wir dieses Erbe auf eine breitere Palette islamischer Literatur - bieten nicht nur mehrsprachige Ressourcen, sondern auch Übersetzungen in regionalen Dialekten und umgangssprachlichen Formen der wichtigsten Weltsprachen.",
        whetherYouAre: "Ob Sie sind:",
        parent: "ein Elternteil, der Geschichtenbücher für Ihre Familie sucht,",
        academic: "ein Akademiker, der zuverlässige Referenzübersetzungen benötigt, oder",
        learner: "ein lebenslanger Lerner auf einer persönlichen Wachstumsreise,",
        designedForYou: "Deen Mastery ist darauf ausgelegt, Ihre Bedürfnisse zu erfüllen.",
        qualityAccuracy: "Qualität & Genauigkeit",
        currentDevelopment:
          "Diese Bibliothek befindet sich derzeit in aktiver Entwicklung. Unsere proprietäre LLM-Pipeline zeichnet sich durch kontextuelle Nuancen, archaische Wörter und ungewöhnliche Satzstrukturen aus. Das bedeutet, sie ist perfekt für die Aufgabe der klassischen arabischen Übersetzung geeignet... und wird nur besser.",
        currentAccuracy: "Aktuelle Genauigkeit: ~85%",
        hallucinations:
          "Die meisten verbleibenden Probleme sind auf Halluzinationen zurückzuführen (d.h. übermäßig kreative Einfügungen durch KI-Modelle) und nicht auf direkte Fehlübersetzungen.",
        knownIssues: "Bekannte Probleme umfassen:",
        issue1:
          "Unzeitgemäße Transliteration (wo das Modell Inhalte transliteriert, die übersetzt werden sollten, oder umgekehrt)",
        issue2: "Unsachgemäße Pronomenauswahl",
        issue3: "Modell wählt enge Bedeutung statt breiter Bedeutungen",
        patience:
          "Wir schätzen Ihre Geduld und Ihr Feedback, während wir verfeinern und verbessern. Unser Engagement gilt der akademischen Integrität, sprachlichen Präzision und dem Vertrauen der Leser.",
        whatMakesDifferent: "Was Uns Anders Macht",
        panLingualAccess: "Pan-Lingualer Zugang",
        breakingBarriers: "Abbau von Sprachbarrieren mit Übersetzungen in mehreren Sprachen und regionalen Dialekten.",
        externallyValidated: "Extern Validiert",
        rigorousValidation:
          "Unsere Übersetzungen durchlaufen strenge Validierungsprozesse, um Genauigkeit und Authentizität zu gewährleisten.",
        forAllLevels: "Für Alle Ebenen",
        beginnersToScholars:
          "Von Anfängern bis zu fortgeschrittenen Gelehrten, unsere Ressourcen richten sich an Leser auf jeder Erfahrungsebene.",
        browseByCategory: "Nach Kategorie Durchsuchen",
        poweredByAI: "Angetrieben von Fortgeschrittener KI",
        aiDescription:
          "Unsere proprietäre LLM-Pipeline ist speziell für klassische arabische Texte entwickelt und zeichnet sich durch kontextuelle Nuancen, archaisches Vokabular und komplexe Satzstrukturen aus, mit denen traditionelle Übersetzungstools kämpfen.",
        contextualUnderstanding: "Kontextuelles Verständnis",
        advancedComprehension: "Fortgeschrittenes Verständnis klassischer arabischer Nuancen",
        continuousLearning: "Kontinuierliches Lernen",
        improvingModels: "KI-Modelle, die sich mit jeder Übersetzung verbessern",
        qualityAssurance: "Qualitätssicherung",
        multiLayerValidation: "Mehrstufige Validierungs- und Überprüfungsprozesse",
        joinMission: "Schließen Sie Sich Unserer Mission An",
        helpDemocratize:
          "Helfen Sie uns, den Zugang zu islamischem Wissen zu demokratisieren. Ob Sie Leser, Übersetzer oder Unterstützer sind, es gibt einen Platz für Sie in unserer wachsenden Gemeinschaft.",
        exploreLibrary: "Erkunden Sie Unsere Bibliothek",
      },
    },
    portuguese: {
      code: "pt",
      name: "Português",
      translations: {
        aboutDeenMastery: "Sobre Deen Mastery",
        panLingualLibrary:
          "Deen Mastery é a primeira biblioteca pan-linguística e externamente validada do mundo de textos islâmicos clássicos. Estamos comprometidos em democratizar o acesso a obras que anteriormente estavam trancadas atrás de barreiras linguísticas e tutela acadêmica - tornando-as disponíveis para leitores de todos os níveis de experiência.",
        shamela:
          "Até o momento, integramos o corpus Shamela, com corpus clássicos e contemporâneos adicionais planejados conforme continuamos a expandir.",
        supportedLanguages: "Idiomas Suportados",
        languageList: ["Inglês", "Espanhol", "Alemão", "Português", "Urdu", "Turco", "Bahasa", "Árabe"],
        legacy:
          "Este projeto se baseia em mais de 15 anos de trabalho pioneiro em acessibilidade corânica através do inglês, espanhol, francês, alemão e bahasa. Com Deen Mastery, estendemos esse legado para uma gama mais ampla de literatura islâmica - oferecendo não apenas recursos multilíngues, mas também traduções em dialetos regionais e formas vernáculas das principais línguas mundiais.",
        whetherYouAre: "Seja você:",
        parent: "um pai procurando livros de histórias para sua família,",
        academic: "um acadêmico precisando de traduções de referência confiáveis, ou",
        learner: "um aprendiz vitalício em uma jornada pessoal de crescimento,",
        designedForYou: "Deen Mastery é projetado para atender suas necessidades.",
        qualityAccuracy: "Qualidade e Precisão",
        currentDevelopment:
          "Esta biblioteca está atualmente em desenvolvimento ativo. Nosso pipeline LLM proprietário se destaca em nuances contextuais, palavras arcaicas, estrutura de frases incomuns. Isso significa que é perfeitamente adequado para a tarefa de tradução árabe clássica... e só melhorando.",
        currentAccuracy: "Precisão Atual: ~85%",
        hallucinations:
          "A maioria dos problemas restantes são devido a alucinações (ou seja, inserções excessivamente criativas por modelos de IA) em vez de traduções errôneas diretas.",
        knownIssues: "Problemas Conhecidos Incluem:",
        issue1:
          "Transliteração inoportuna (onde o modelo transliterar conteúdo que deveria ser traduzido, ou vice-versa)",
        issue2: "Seleção inadequada de pronomes",
        issue3: "Modelo seleciona significado estreito em vez de significados amplos",
        patience:
          "Apreciamos sua paciência e feedback enquanto refinamos e melhoramos. Nosso compromisso é com a integridade acadêmica, precisão linguística e confiança do leitor.",
        whatMakesDifferent: "O Que Nos Torna Diferentes",
        panLingualAccess: "Acesso Pan-Linguístico",
        breakingBarriers: "Quebrando barreiras linguísticas com traduções em múltiplos idiomas e dialetos regionais.",
        externallyValidated: "Externamente Validado",
        rigorousValidation:
          "Nossas traduções passam por processos de validação rigorosos para garantir precisão e autenticidade.",
        forAllLevels: "Para Todos os Níveis",
        beginnersToScholars:
          "De iniciantes a acadêmicos avançados, nossos recursos atendem leitores em todos os níveis de experiência.",
        browseByCategory: "Navegar por Categoria",
        poweredByAI: "Alimentado por IA Avançada",
        aiDescription:
          "Nosso pipeline LLM proprietário é especificamente projetado para textos árabes clássicos, destacando-se em nuances contextuais, vocabulário arcaico e estruturas de frases complexas com as quais ferramentas de tradução tradicionais lutam.",
        contextualUnderstanding: "Compreensão Contextual",
        advancedComprehension: "Compreensão avançada de nuances árabes clássicas",
        continuousLearning: "Aprendizado Contínuo",
        improvingModels: "Modelos de IA que melhoram com cada tradução",
        qualityAssurance: "Garantia de Qualidade",
        multiLayerValidation: "Processos de validação e revisão multicamadas",
        joinMission: "Junte-se à Nossa Missão",
        helpDemocratize:
          "Ajude-nos a democratizar o acesso ao conhecimento islâmico. Seja você um leitor, tradutor ou apoiador, há um lugar para você em nossa comunidade crescente.",
        exploreLibrary: "Explore Nossa Biblioteca",
      },
    },
    urdu: {
      code: "ur",
      name: "اردو",
      translations: {
        aboutDeenMastery: "دین میں مہارت کے بارے میں",
        panLingualLibrary:
          "دین میں مہارت دنیا کی پہلی کثیر لسانی، بیرونی طور پر تصدیق شدہ کلاسیکی اسلامی متون کی لائبریری ہے۔ ہم ان کاموں تک رسائی کو جمہوری بنانے کے لیے پرعزم ہیں جو پہلے زبان کی رکاوٹوں اور علمی نگہبانی کے پیچھے بند تھے - انہیں تمام سطح کے تجربے کے قارئین کے لیے دستیاب بناتے ہوئے۔",
        shamela:
          "آج تک، ہم نے شاملہ کارپس کو ضم کیا ہے، اضافی کلاسیکی اور معاصر کارپس کی منصوبہ بندی کے ساتھ جیسا کہ ہم توسیع جاری رکھتے ہیں۔",
        supportedLanguages: "معاون زبانیں",
        languageList: ["انگریزی", "ہسپانوی", "جرمن", "پرتگالی", "اردو", "ترکی", "بہاسا", "عربی"],
        legacy:
          "یہ منصوبہ انگریزی، ہسپانوی، فرانسیسی، جرمن، اور بہاسا میں قرآنی رسائی میں 15 سال سے زیادہ کے علمبردار کام پر بنایا گیا ہے۔ دین میں مہارت کے ساتھ، ہم اس وراثت کو اسلامی ادب کی وسیع رینج تک بڑھاتے ہیں - نہ صرف کثیر لسانی وسائل پیش کرتے ہوئے، بلکہ علاقائی بولیوں اور بڑی عالمی زبانوں کی مقامی شکلوں میں ترجمے بھی۔",
        whetherYouAre: "چاہے آپ:",
        parent: "اپنے خاندان کے لیے کہانی کی کتابیں تلاش کرنے والے والدین ہوں،",
        academic: "قابل اعتماد حوالہ جاتی ترجموں کی ضرورت والے تعلیمی ماہر ہوں، یا",
        learner: "ذاتی ترقی کے سفر پر زندگی بھر سیکھنے والے ہوں،",
        designedForYou: "دین میں مہارت آپ کی ضروریات کو پورا کرنے کے لیے ڈیزائن کیا گیا ہے۔",
        qualityAccuracy: "معیار اور درستگی",
        currentDevelopment:
          "یہ لائبریری فی الوقت فعال ترقی میں ہے۔ ہماری ملکیتی LLM پائپ لائن سیاقی باریکیوں، قدیم الفاظ، غیر معمولی جملے کی ساخت میں بہترین ہے۔ اس کا مطلب یہ ہے کہ یہ کلاسیکی عربی ترجمے کے کام کے لیے بالکل موزوں ہے... اور صرف بہتر ہو رہا ہے۔",
        currentAccuracy: "موجودہ درستگی: ~85%",
        hallucinations:
          "باقی زیادہ تر مسائل فریب (یعنی AI ماڈلز کی جانب سے زیادہ تخلیقی اضافے) کی وجہ سے ہیں بجائے مکمل غلط ترجموں کے۔",
        knownIssues: "معلوم مسائل میں شامل ہیں:",
        issue1: "بے وقت نقل حرفی (جہاں ماڈل ایسے مواد کو نقل کرتا ہے جس کا ترجمہ ہونا چاہیے، یا اس کے برعکس)",
        issue2: "غلط ضمیر کا انتخاب",
        issue3: "ماڈل وسیع معانی کی بجائے تنگ معنی کا انتخاب کرتا ہے",
        patience:
          "ہم آپ کے صبر اور تاثرات کی تعریف کرتے ہیں جب ہم بہتری اور ترقی کرتے ہیں۔ ہماری وابستگی تعلیمی دیانت، لسانی درستگی، اور قاری کے اعتماد کے ساتھ ہے۔",
        whatMakesDifferent: "ہمیں کیا مختلف بناتا ہے",
        panLingualAccess: "کثیر لسانی رسائی",
        breakingBarriers: "متعدد زبانوں اور علاقائی بولیوں میں ترجموں کے ساتھ زبان کی رکاوٹوں کو توڑنا۔",
        externallyValidated: "بیرونی طور پر تصدیق شدہ",
        rigorousValidation: "ہمارے ترجمے درستگی اور صداقت کو یقینی بنانے کے لیے سخت تصدیقی عمل سے گزرتے ہیں۔",
        forAllLevels: "تمام سطحوں کے لیے",
        beginnersToScholars:
          "ابتدائی سے لے کر اعلیٰ درجے کے علماء تک، ہمارے وسائل ہر سطح کے تجربے کے قارئین کی خدمت کرتے ہیں۔",
        browseByCategory: "قسم کے ذریعے تلاش کریں",
        poweredByAI: "جدید AI سے طاقت یافتہ",
        aiDescription:
          "ہماری ملکیتی LLM پائپ لائن خاص طور پر کلاسیکی عربی متون کے لیے ڈیزائن کیا گیا ہے، سیاقی باریکیوں، قدیم الفاظ، اور پیچیدہ جملے کی ساختوں میں بہترین ہے جن کے ساتھ روایتی ترجمہ کے آلات جدوجہد کرتے ہیں۔",
        contextualUnderstanding: "سیاقی فہم",
        advancedComprehension: "کلاسیکی عربی باریکیوں کی اعلیٰ درجے کی فہم",
        continuousLearning: "مسلسل سیکھنا",
        improvingModels: "AI ماڈلز جو ہر ترجمے کے ساتھ بہتر ہوتے ہیں",
        qualityAssurance: "معیار کی یقین دہانی",
        multiLayerValidation: "کثیر پرتی تصدیق اور جائزہ کے عمل",
        joinMission: "ہمارے مشن میں شامل ہوں",
        helpDemocratize:
          "اسلامی علم تک رسائی کو جمہوری بنانے میں ہماری مدد کریں۔ چاہے آپ قاری، مترجم، یا حامی ہوں، ہماری بڑھتی ہوئی کمیونٹی میں آپ کے لیے جگہ ہے۔",
        exploreLibrary: "ہماری لائبریری کو دریافت کریں",
      },
    },
    turkish: {
      code: "tr",
      name: "Türkçe",
      translations: {
        aboutDeenMastery: "Deen Mastery Hakkında",
        panLingualLibrary:
          "Deen Mastery, dünyanın ilk çok dilli, harici olarak doğrulanmış klasik İslami metinler kütüphanesidir. Daha önce dil engelleri ve akademik vesayet arkasında kilitli olan eserlere erişimi demokratikleştirmeye kararlıyız - onları her deneyim seviyesindeki okuyuculara erişilebilir kılarak.",
        shamela:
          "Bugüne kadar Shamela korpusunu entegre ettik, genişlemeye devam ederken ek klasik ve çağdaş korpuslar planlanıyor.",
        supportedLanguages: "Desteklenen Diller",
        languageList: ["İngilizce", "İspanyolca", "Almanca", "Portekizce", "Urduca", "Türkçe", "Bahasa", "Arapça"],
        legacy:
          "Bu proje, İngilizce, İspanyolca, Fransızca, Almanca ve Bahasa'da Kur'an erişilebilirliğinde 15 yılı aşkın öncü çalışma üzerine inşa edilmiştir. Deen Mastery ile bu mirası daha geniş bir İslami edebiyat yelpazesine genişletiyoruz - sadece çok dilli kaynaklar sunmakla kalmayıp, aynı zamanda bölgesel lehçelerde ve büyük dünya dillerinin yerel formlarında çeviriler de sunuyoruz.",
        whetherYouAre: "İster:",
        parent: "aileniz için hikaye kitapları arayan bir ebeveyn,",
        academic: "güvenilir referans çevirilere ihtiyaç duyan bir akademisyen, ya da",
        learner: "kişisel büyüme yolculuğunda yaşam boyu öğrenen biri olun,",
        designedForYou: "Deen Mastery ihtiyaçlarınızı karşılamak için tasarlanmıştır.",
        qualityAccuracy: "Kalite ve Doğruluk",
        currentDevelopment:
          "Bu kütüphane şu anda aktif geliştirme aşamasındadır. Özel LLM hattımız bağlamsal nüanslar, arkaik kelimeler, olağandışı cümle yapısında mükemmeldir. Bu, klasik Arapça çeviri görevine mükemmel şekilde uygun olduğu anlamına gelir... ve sadece daha da iyileşiyor.",
        currentAccuracy: "Mevcut Doğruluk: ~85%",
        hallucinations:
          "Kalan sorunların çoğu, doğrudan yanlış çevirilerden ziyade halüsinasyonlardan (yani AI modelleri tarafından aşırı yaratıcı eklemeler) kaynaklanmaktadır.",
        knownIssues: "Bilinen Sorunlar Şunları İçerir:",
        issue1: "Zamansız transliterasyon (modelin çevrilmesi gereken içeriği translitere ettiği veya tam tersi)",
        issue2: "Uygunsuz zamir seçimi",
        issue3: "Model geniş anlamlar yerine dar anlam seçer",
        patience:
          "İyileştirme ve geliştirme yaparken sabrınızı ve geri bildirimlerinizi takdir ediyoruz. Taahhüdümüz akademik dürüstlük, dilsel hassasiyet ve okuyucu güvenidir.",
        whatMakesDifferent: "Bizi Farklı Kılan Nedir",
        panLingualAccess: "Çok Dilli Erişim",
        breakingBarriers: "Birden fazla dilde ve bölgesel lehçelerde çevirilerle dil engellerini yıkmak.",
        externallyValidated: "Harici Olarak Doğrulanmış",
        rigorousValidation: "Çevirilerimiz doğruluk ve özgünlüğü sağlamak için titiz doğrulama süreçlerinden geçer.",
        forAllLevels: "Tüm Seviyeler İçin",
        beginnersToScholars:
          "Yeni başlayanlardan ileri düzey akademisyenlere kadar, kaynaklarımız her deneyim seviyesindeki okuyuculara hitap eder.",
        browseByCategory: "Kategoriye Göre Gözat",
        poweredByAI: "Gelişmiş AI ile Güçlendirilmiş",
        aiDescription:
          "Özel LLM hattımız özellikle klasik Arapça metinler için tasarlanmış olup, geleneksel çeviri araçlarının zorlandığı bağlamsal nüanslar, arkaik kelime dağarcığı ve karmaşık cümle yapılarında mükemmeldir.",
        contextualUnderstanding: "Bağlamsal Anlayış",
        advancedComprehension: "Klasik Arapça nüanslarının ileri düzey kavranması",
        continuousLearning: "Sürekli Öğrenme",
        improvingModels: "Her çeviriyle gelişen AI modelleri",
        qualityAssurance: "Kalite Güvencesi",
        multiLayerValidation: "Çok katmanlı doğrulama ve inceleme süreçleri",
        joinMission: "Misyonumuza Katılın",
        helpDemocratize:
          "İslami bilgiye erişimi demokratikleştirmemize yardım edin. İster okuyucu, çevirmen veya destekçi olun, büyüyen topluluğumuzda sizin için bir yer var.",
        exploreLibrary: "Kütüphanemizi Keşfedin",
      },
    },
    bahasa: {
      code: "id",
      name: "Bahasa",
      translations: {
        aboutDeenMastery: "Tentang Deen Mastery",
        panLingualLibrary:
          "Deen Mastery adalah perpustakaan teks-teks Islam klasik pan-lingual pertama di dunia yang divalidasi secara eksternal. Kami berkomitmen untuk mendemokratisasi akses ke karya-karya yang sebelumnya terkunci di balik hambatan bahasa dan penjagaan akademis—membuatnya tersedia bagi pembaca di semua tingkat keahlian.",
        shamela:
          "Hingga saat ini, kami telah mengintegrasikan korpus Shamela, dengan korpus klasik dan kontemporer tambahan direncanakan saat kami terus berkembang.",
        supportedLanguages: "Bahasa yang Didukung",
        languageList: ["Inggris", "Spanyol", "Jerman", "Portugis", "Urdu", "Turki", "Bahasa", "Arab"],
        legacy:
          "Proyek ini dibangun atas lebih dari 15 tahun kerja perintis dalam aksesibilitas Al-Qur'an di seluruh bahasa Inggris, Spanyol, Prancis, Jerman, dan Bahasa. Dengan Deen Mastery, kami memperluas warisan itu ke rentang literatur Islam yang lebih luas—menawarkan tidak hanya sumber daya multibahasa, tetapi juga terjemahan dalam dialek regional dan bentuk vernakular bahasa-bahasa dunia utama.",
        whetherYouAre: "Apakah Anda:",
        parent: "orang tua yang mencari buku cerita untuk keluarga Anda,",
        academic: "akademisi yang membutuhkan terjemahan referensi yang dapat diandalkan, atau",
        learner: "pembelajar seumur hidup dalam perjalanan pertumbuhan pribadi,",
        designedForYou: "Deen Mastery dirancang untuk memenuhi kebutuhan Anda.",
        qualityAccuracy: "Kualitas & Akurasi",
        currentDevelopment:
          "Perpustakaan ini saat ini dalam pengembangan aktif. Pipeline LLM proprietary kami unggul dalam nuansa kontekstual, kata-kata kuno, struktur kalimat yang tidak biasa. Itu berarti sangat cocok untuk tugas terjemahan Arab klasik... dan hanya semakin baik.",
        currentAccuracy: "Akurasi Saat Ini: ~85%",
        hallucinations:
          "Sebagian besar masalah yang tersisa disebabkan oleh halusinasi (yaitu, penyisipan yang terlalu kreatif oleh model AI) daripada kesalahan terjemahan langsung.",
        knownIssues: "Masalah yang Diketahui Meliputi:",
        issue1:
          "Transliterasi yang tidak tepat waktu (di mana model mentransliterasi konten yang seharusnya diterjemahkan, atau sebaliknya)",
        issue2: "Pemilihan kata ganti yang tidak tepat",
        issue3: "Model memilih makna sempit alih-alih makna luas",
        patience:
          "Kami menghargai kesabaran dan umpan balik Anda saat kami memperbaiki dan meningkatkan. Komitmen kami adalah pada integritas akademis, presisi linguistik, dan kepercayaan pembaca.",
        whatMakesDifferent: "Apa yang Membuat Kami Berbeda",
        panLingualAccess: "Akses Pan-Lingual",
        breakingBarriers: "Mendobrak hambatan bahasa dengan terjemahan dalam berbagai bahasa dan dialek regional.",
        externallyValidated: "Divalidasi Secara Eksternal",
        rigorousValidation:
          "Terjemahan kami menjalani proses validasi yang ketat untuk memastikan akurasi dan keaslian.",
        forAllLevels: "Untuk Semua Tingkat",
        beginnersToScholars:
          "Dari pemula hingga sarjana lanjutan, sumber daya kami melayani pembaca di setiap tingkat keahlian.",
        browseByCategory: "Jelajahi berdasarkan Kategori",
        poweredByAI: "Didukung oleh AI Canggih",
        aiDescription:
          "Pipeline LLM proprietary kami dirancang khusus untuk teks Arab klasik, unggul dalam nuansa kontekstual, kosakata kuno, dan struktur kalimat kompleks yang sulit ditangani oleh alat terjemahan tradisional.",
        contextualUnderstanding: "Pemahaman Kontekstual",
        advancedComprehension: "Pemahaman lanjutan tentang nuansa Arab klasik",
        continuousLearning: "Pembelajaran Berkelanjutan",
        improvingModels: "Model AI yang meningkat dengan setiap terjemahan",
        qualityAssurance: "Jaminan Kualitas",
        multiLayerValidation: "Proses validasi dan tinjauan multi-lapisan",
        joinMission: "Bergabunglah dengan Misi Kami",
        helpDemocratize:
          "Bantu kami mendemokratisasi akses ke pengetahuan Islam. Apakah Anda pembaca, penerjemah, atau pendukung, ada tempat untuk Anda di komunitas kami yang berkembang.",
        exploreLibrary: "Jelajahi Perpustakaan Kami",
      },
    },
  }

  // Get current translations - NO LANGUAGE SWITCHING
  const t = languageConfig[currentLanguage]?.translations || languageConfig.english.translations

  const handleCategoryClick = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category)
      onBack() // Navigate back to home with the selected category
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-600 text-white rounded-full mb-6">
              <BookOpen className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">{t.aboutDeenMastery}</h2>
            <p className="text-xl text-amber-700 mb-6 max-w-4xl mx-auto leading-relaxed">{t.panLingualLibrary}</p>
          </div>

          {/* Main Description */}
          <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-8 mb-12">
            <p className="text-gray-700 leading-relaxed mb-6">{t.shamela}</p>

            {/* Language Support - NO SWITCHING */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-amber-900 mb-4 flex items-center">
                <Languages className="w-5 h-5 mr-2" />
                {t.supportedLanguages}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {t.languageList.map((lang, index) => (
                  <div key={index} className="px-3 py-2 rounded-lg text-center font-medium bg-amber-50 text-amber-800">
                    {lang}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">{t.legacy}</p>

            {/* Target Audience */}
            <div className="bg-amber-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-amber-900 mb-4">{t.whetherYouAre}</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <Heart className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{t.parent}</span>
                </li>
                <li className="flex items-start">
                  <Award className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{t.academic}</span>
                </li>
                <li className="flex items-start">
                  <Target className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{t.learner}</span>
                </li>
              </ul>
              <p className="mt-4 font-bold text-amber-900">{t.designedForYou}</p>
            </div>
          </div>

          {/* Quality & Accuracy Section */}
          <div className="mb-12">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center text-2xl">
                  <Shield className="w-6 h-6 mr-3" />
                  {t.qualityAccuracy}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{t.currentDevelopment}</p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">{t.currentAccuracy}</span>
                  </div>
                  <p className="text-green-700 text-sm">{t.hallucinations}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">{t.knownIssues}</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span>{t.issue1}</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span>{t.issue2}</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span>{t.issue3}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 leading-relaxed">{t.patience}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-amber-900 mb-8 text-center">{t.whatMakesDifferent}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-amber-200 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t.panLingualAccess}</h4>
                  <p className="text-gray-600 text-sm">{t.breakingBarriers}</p>
                </CardContent>
              </Card>

              <Card className="border-amber-200 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t.externallyValidated}</h4>
                  <p className="text-gray-600 text-sm">{t.rigorousValidation}</p>
                </CardContent>
              </Card>

              <Card className="border-amber-200 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t.forAllLevels}</h4>
                  <p className="text-gray-600 text-sm">{t.beginnersToScholars}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Browse Categories Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-amber-900 mb-6 text-center">{t.browseByCategory}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Belief (Aqeeda)",
                "Organized Hadith",
                "Biographies and Classes",
                "Research and Issues",
                "Grammar and Morphology",
                "Quranic Sciences",
                "General jurisprudence",
                "Science of Hadith",
              ].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-white border border-amber-200 p-3 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-colors text-amber-800 font-medium text-sm"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Technology Section */}
          <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-8 mb-12">
            <h3 className="text-2xl font-bold text-amber-900 mb-6 text-center flex items-center justify-center">
              <Zap className="w-6 h-6 mr-3" />
              {t.poweredByAI}
            </h3>
            <p className="text-gray-700 text-center mb-6 leading-relaxed">{t.aiDescription}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="font-semibold text-amber-900 mb-1">{t.contextualUnderstanding}</div>
                <div className="text-sm text-amber-700">{t.advancedComprehension}</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="font-semibold text-amber-900 mb-1">{t.continuousLearning}</div>
                <div className="text-sm text-amber-700">{t.improvingModels}</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="font-semibold text-amber-900 mb-1">{t.qualityAssurance}</div>
                <div className="text-sm text-amber-700">{t.multiLayerValidation}</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-amber-100 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">{t.joinMission}</h3>
            <p className="text-amber-800 mb-6 max-w-2xl mx-auto">{t.helpDemocratize}</p>
            <Button onClick={onBack} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
              {t.exploreLibrary}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
