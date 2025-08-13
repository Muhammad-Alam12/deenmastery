"use client"

import type React from "react"

import { Mail, Phone, Clock, Send, MessageSquare, Globe, Facebook, Youtube, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface ContactPageProps {
  onBack: () => void
  currentLanguage?: string
}

const ContactPage = ({ onBack, currentLanguage = "english" }: ContactPageProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  // Language configurations with translations - NO LANGUAGE SWITCHING
  const languageConfig = {
    arabic: {
      code: "ar",
      name: "العربية",
      translations: {
        getInTouch: "تواصل معنا",
        contactDescription:
          "نحب أن نسمع منك. سواء كان لديك أسئلة أو ملاحظات أو اقتراحات، فريقنا هنا لمساعدتك في رحلتك للمعرفة الإسلامية.",
        sendMessage: "أرسل لنا رسالة",
        fullName: "الاسم الكامل *",
        emailAddress: "عنوان البريد الإلكتروني *",
        subject: "الموضوع *",
        message: "الرسالة *",
        fullNamePlaceholder: "اسمك الكامل",
        emailPlaceholder: "your.email@example.com",
        subjectPlaceholder: "ما هو موضوع هذا؟",
        messagePlaceholder: "يرجى مشاركة أفكارك أو أسئلتك أو ملاحظاتك...",
        sending: "جاري الإرسال...",
        sendMessageBtn: "إرسال الرسالة",
        successMessage: "✅ شكراً لك على رسالتك! سنعود إليك خلال 24-48 ساعة.",
        errorMessage: "❌ حدث خطأ في إرسال رسالتك. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.",
        contactInformation: "معلومات الاتصال",
        email: "البريد الإلكتروني",
        emailContact: "contact@deenmastery.com",
        responseTime: "وقت الاستجابة",
        responseTimeDetails: "الاثنين - الجمعة: 9 صباحاً - 6 مساءً بتوقيت شرق الولايات المتحدة",
        weekendNote: "رسائل نهاية الأسبوع يتم الرد عليها يوم الاثنين",
        languages: "اللغات",
        languagesList: "الإنجليزية، العربية، الإسبانية، الألمانية",
        additionalLanguages: "البرتغالية، الأردية، التركية، البهاسا",
        faq: "الأسئلة الشائعة",
        faqQuestion1: "كيف يمكنني اقتراح كتاب للمكتبة؟",
        faqAnswer1: "أرسل لنا بريداً إلكترونياً مع عنوان الكتاب والمؤلف وسبب اعتقادك أنه سيكون قيماً لمجتمعنا.",
        faqQuestion2: "هل يمكنني المساهمة في الترجمات؟",
        faqAnswer2: "نعم! نرحب بالمترجمين المؤهلين. يرجى الاتصال بنا مع أوراق اعتمادك وخبرتك اللغوية.",
        faqQuestion3: "هل المكتبة مجانية الاستخدام؟",
        faqAnswer3: "نعم، إتقان الدين مجاني تماماً. مهمتنا هي إضفاء الطابع الديمقراطي على الوصول إلى المعرفة الإسلامية.",
        faqQuestion4: "كيف أبلغ عن خطأ في الترجمة؟",
        faqAnswer4: "يرجى مراسلتنا بالكتاب المحدد والصفحة وتفاصيل الخطأ. نحن نأخذ الدقة على محمل الجد.",
        followUs: "تابعنا",
        socialMediaDescription: "ابق على اطلاع بالكتب الجديدة والميزات والمناقشات المجتمعية.",
        weRespond: "نرد خلال 24-48 ساعة",
      },
    },
    english: {
      code: "en",
      name: "English",
      translations: {
        getInTouch: "Get in Touch",
        contactDescription:
          "We'd love to hear from you. Whether you have questions, feedback, or suggestions, our team is here to help you on your journey of Islamic knowledge.",
        sendMessage: "Send us a Message",
        fullName: "Full Name *",
        emailAddress: "Email Address *",
        subject: "Subject *",
        message: "Message *",
        fullNamePlaceholder: "Your full name",
        emailPlaceholder: "your.email@example.com",
        subjectPlaceholder: "What is this regarding?",
        messagePlaceholder: "Please share your thoughts, questions, or feedback...",
        sending: "Sending...",
        sendMessageBtn: "Send Message",
        successMessage: "✅ Thank you for your message! We'll get back to you within 24-48 hours.",
        errorMessage: "❌ There was an error sending your message. Please try again or contact us directly.",
        contactInformation: "Contact Information",
        email: "Email",
        emailContact: "contact@deenmastery.com",
        responseTime: "Response Time",
        responseTimeDetails: "Monday - Friday: 9 AM - 6 PM EST",
        weekendNote: "Weekend messages answered on Monday",
        languages: "Languages",
        languagesList: "English, Arabic, Spanish, German",
        additionalLanguages: "Portuguese, Urdu, Turkish, Bahasa",
        faq: "Frequently Asked Questions",
        faqQuestion1: "How can I suggest a book for the library?",
        faqAnswer1:
          "Send us an email with the book title, author, and why you think it would be valuable for our community.",
        faqQuestion2: "Can I contribute translations?",
        faqAnswer2:
          "Yes! We welcome qualified translators. Please contact us with your credentials and language expertise.",
        faqQuestion3: "Is the library free to use?",
        faqAnswer3: "Yes, Deen Mastery is completely free. Our mission is to democratize access to Islamic knowledge.",
        faqQuestion4: "How do I report an error in translation?",
        faqAnswer4: "Please email us with the specific book, page, and error details. We take accuracy very seriously.",
        followUs: "Follow Us",
        socialMediaDescription: "Stay updated with new books, features, and community discussions.",
        weRespond: "We respond within 24-48 hours",
      },
    },
    spanish: {
      code: "es",
      name: "Español",
      translations: {
        getInTouch: "Ponte en Contacto",
        contactDescription:
          "Nos encantaría saber de ti. Ya sea que tengas preguntas, comentarios o sugerencias, nuestro equipo está aquí para ayudarte en tu viaje del conocimiento islámico.",
        sendMessage: "Envíanos un Mensaje",
        fullName: "Nombre Completo *",
        emailAddress: "Dirección de Correo Electrónico *",
        subject: "Asunto *",
        message: "Mensaje *",
        fullNamePlaceholder: "Tu nombre completo",
        emailPlaceholder: "tu.email@ejemplo.com",
        subjectPlaceholder: "¿De qué se trata esto?",
        messagePlaceholder: "Por favor comparte tus pensamientos, preguntas o comentarios...",
        sending: "Enviando...",
        sendMessageBtn: "Enviar Mensaje",
        successMessage: "✅ ¡Gracias por tu mensaje! Te responderemos dentro de 24-48 horas.",
        errorMessage: "❌ Hubo un error al enviar tu mensaje. Por favor intenta de nuevo o contáctanos directamente.",
        contactInformation: "Información de Contacto",
        email: "Correo Electrónico",
        emailContact: "contact@deenmastery.com",
        responseTime: "Tiempo de Respuesta",
        responseTimeDetails: "Lunes - Viernes: 9 AM - 6 PM EST",
        weekendNote: "Mensajes de fin de semana respondidos el lunes",
        languages: "Idiomas",
        languagesList: "Inglés, Árabe, Español, Alemán",
        additionalLanguages: "Portugués, Urdu, Turco, Bahasa",
        faq: "Preguntas Frecuentes",
        faqQuestion1: "¿Cómo puedo sugerir un libro para la biblioteca?",
        faqAnswer1:
          "Envíanos un correo con el título del libro, autor y por qué crees que sería valioso para nuestra comunidad.",
        faqQuestion2: "¿Puedo contribuir con traducciones?",
        faqAnswer2:
          "¡Sí! Damos la bienvenida a traductores calificados. Por favor contáctanos con tus credenciales y experiencia lingüística.",
        faqQuestion3: "¿Es gratuito usar la biblioteca?",
        faqAnswer3:
          "Sí, Deen Mastery es completamente gratuito. Nuestra misión es democratizar el acceso al conocimiento islámico.",
        faqQuestion4: "¿Cómo reporto un error en la traducción?",
        faqAnswer4:
          "Por favor envíanos un correo con el libro específico, página y detalles del error. Tomamos la precisión muy en serio.",
        followUs: "Síguenos",
        socialMediaDescription: "Mantente actualizado con nuevos libros, características y discusiones comunitarias.",
        weRespond: "Respondemos dentro de 24-48 horas",
      },
    },
    german: {
      code: "de",
      name: "Deutsch",
      translations: {
        getInTouch: "Kontakt aufnehmen",
        contactDescription:
          "Wir würden gerne von Ihnen hören. Ob Sie Fragen, Feedback oder Vorschläge haben, unser Team ist hier, um Ihnen auf Ihrer Reise des islamischen Wissens zu helfen.",
        sendMessage: "Senden Sie uns eine Nachricht",
        fullName: "Vollständiger Name *",
        emailAddress: "E-Mail-Adresse *",
        subject: "Betreff *",
        message: "Nachricht *",
        fullNamePlaceholder: "Ihr vollständiger Name",
        emailPlaceholder: "ihre.email@beispiel.com",
        subjectPlaceholder: "Worum geht es?",
        messagePlaceholder: "Bitte teilen Sie Ihre Gedanken, Fragen oder Feedback mit...",
        sending: "Senden...",
        sendMessageBtn: "Nachricht senden",
        successMessage: "✅ Vielen Dank für Ihre Nachricht! Wir melden uns innerhalb von 24-48 Stunden bei Ihnen.",
        errorMessage:
          "❌ Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.",
        contactInformation: "Kontaktinformationen",
        email: "E-Mail",
        emailContact: "contact@deenmastery.com",
        responseTime: "Antwortzeit",
        responseTimeDetails: "Montag - Freitag: 9 - 18 Uhr EST",
        weekendNote: "Wochenend-Nachrichten werden am Montag beantwortet",
        languages: "Sprachen",
        languagesList: "Englisch, Arabisch, Spanisch, Deutsch",
        additionalLanguages: "Portugiesisch, Urdu, Türkisch, Bahasa",
        faq: "Häufig gestellte Fragen",
        faqQuestion1: "Wie kann ich ein Buch für die Bibliothek vorschlagen?",
        faqAnswer1:
          "Senden Sie uns eine E-Mail mit dem Buchtitel, Autor und warum Sie denken, dass es für unsere Gemeinschaft wertvoll wäre.",
        faqQuestion2: "Kann ich Übersetzungen beitragen?",
        faqAnswer2:
          "Ja! Wir begrüßen qualifizierte Übersetzer. Bitte kontaktieren Sie uns mit Ihren Referenzen und Sprachkenntnissen.",
        faqQuestion3: "Ist die Bibliothek kostenlos zu nutzen?",
        faqAnswer3:
          "Ja, Deen Mastery ist völlig kostenlos. Unsere Mission ist es, den Zugang zu islamischem Wissen zu demokratisieren.",
        faqQuestion4: "Wie melde ich einen Übersetzungsfehler?",
        faqAnswer4:
          "Bitte senden Sie uns eine E-Mail mit dem spezifischen Buch, der Seite und den Fehlerdetails. Wir nehmen Genauigkeit sehr ernst.",
        followUs: "Folgen Sie uns",
        socialMediaDescription: "Bleiben Sie auf dem Laufenden mit neuen Büchern, Features und Community-Diskussionen.",
        weRespond: "Wir antworten innerhalb von 24-48 Stunden",
      },
    },
    portuguese: {
      code: "pt",
      name: "Português",
      translations: {
        getInTouch: "Entre em Contato",
        contactDescription:
          "Adoraríamos ouvir de você. Seja você tendo perguntas, feedback ou sugerências, nossa equipe está aqui para ajudá-lo em sua jornada de conhecimento islâmico.",
        sendMessage: "Envie-nos uma Mensagem",
        fullName: "Nome Completo *",
        emailAddress: "Endereço de E-mail *",
        subject: "Assunto *",
        message: "Mensagem *",
        fullNamePlaceholder: "Seu nome completo",
        emailPlaceholder: "seu.email@exemplo.com",
        subjectPlaceholder: "Sobre o que é isso?",
        messagePlaceholder: "Por favor compartilhe seus pensamentos, perguntas ou feedback...",
        sending: "Enviando...",
        sendMessageBtn: "Enviar Mensagem",
        successMessage: "✅ Obrigado pela sua mensagem! Entraremos em contato dentro de 24-48 horas.",
        errorMessage:
          "❌ Houve um erro ao enviar sua mensagem. Por favor tente novamente ou entre em contato conosco diretamente.",
        contactInformation: "Informações de Contato",
        email: "E-mail",
        emailContact: "contact@deenmastery.com",
        responseTime: "Tempo de Resposta",
        responseTimeDetails: "Segunda - Sexta: 9h - 18h EST",
        weekendNote: "Mensagens de fim de semana respondidas na segunda-feira",
        languages: "Idiomas",
        languagesList: "Inglês, Árabe, Espanhol, Alemão",
        additionalLanguages: "Português, Urdu, Turco, Bahasa",
        faq: "Perguntas Frequentes",
        faqQuestion1: "Como posso sugerir um livro para a biblioteca?",
        faqAnswer1:
          "Envie-nos um e-mail com o título do livro, autor e por que você acha que seria valioso para nossa comunidade.",
        faqQuestion2: "Posso contribuir com traduções?",
        faqAnswer2:
          "Sim! Damos as boas-vindas a tradutores qualificados. Por favor entre em contato conosco com suas credenciais e experiência linguística.",
        faqQuestion3: "A biblioteca é gratuita para usar?",
        faqAnswer3:
          "Sim, Deen Mastery é completamente gratuito. Nossa missão é democratizar o acesso ao conhecimento islâmico.",
        faqQuestion4: "Como reporto um erro na tradução?",
        faqAnswer4:
          "Por favor nos envie um e-mail com o livro específico, página e detalhes do erro. Levamos a precisão muito a sério.",
        followUs: "Siga-nos",
        socialMediaDescription: "Mantenha-se atualizado com novos livros, recursos e discussões da comunidade.",
        weRespond: "Respondemos dentro de 24-48 horas",
      },
    },
    urdu: {
      code: "ur",
      name: "اردو",
      translations: {
        getInTouch: "رابطے میں آئیں",
        contactDescription:
          "ہم آپ سے سننا پسند کریں گے۔ چاہے آپ کے پاس سوالات، تاثرات، یا تجاویز ہوں، ہماری ٹیم اسلامی علم کے آپ کے سفر میں آپ کی مدد کے لیے یہاں ہے۔",
        sendMessage: "ہمیں پیغام بھیجیں",
        fullName: "مکمل نام *",
        emailAddress: "ای میل ایڈریس *",
        subject: "موضوع *",
        message: "پیغام *",
        fullNamePlaceholder: "آپ کا مکمل نام",
        emailPlaceholder: "آپ کا.ای میل@مثال.کام",
        subjectPlaceholder: "یہ کس بارے میں ہے؟",
        messagePlaceholder: "براہ کرم اپنے خیالات، سوالات، یا تاثرات شیئر کریں...",
        sending: "بھیجا جا رہا ہے...",
        sendMessageBtn: "پیغام بھیجیں",
        successMessage: "✅ آپ کے پیغام کے لیے شکریہ! ہم 24-48 گھنٹوں کے اندر آپ سے رابطہ کریں گے۔",
        errorMessage: "❌ آپ کا پیغام بھیجنے میں خرابی ہوئی۔ براہ کرم دوبارہ کوشش کریں یا براہ راست ہم سے رابطہ کریں۔",
        contactInformation: "رابطے کی معلومات",
        email: "ای میل",
        emailContact: "contact@deenmastery.com",
        responseTime: "جواب کا وقت",
        responseTimeDetails: "پیر - جمعہ: صبح 9 - شام 6 EST",
        weekendNote: "ہفتے کے آخر کے پیغامات پیر کو جواب دیے جاتے ہیں",
        languages: "زبانیں",
        languagesList: "انگریزی، عربی، ہسپانوی، جرمن",
        additionalLanguages: "پرتگالی، اردو، ترکی، بہاسا",
        faq: "اکثر پوچھے جانے والے سوالات",
        faqQuestion1: "میں لائبریری کے لیے کتاب کی تجویز کیسے دے سکتا ہوں؟",
        faqAnswer1:
          "ہمیں کتاب کا عنوان، مصنف، اور یہ بتاتے ہوئے ای میل بھیجیں کہ آپ کے خیال میں یہ ہماری کمیونٹی کے لیے کیوں قیمتی ہوگی۔",
        faqQuestion2: "کیا میں ترجموں میں تعاون کر سکتا ہوں؟",
        faqAnswer2:
          "جی ہاں! ہم اہل مترجمین کا خیرمقدم کرتے ہیں۔ براہ کرم اپنی اسناد اور زبان کی مہارت کے ساتھ ہم سے رابطہ کریں۔",
        faqQuestion3: "کیا لائبریری استعمال کرنا مفت ہے؟",
        faqAnswer3: "جی ہاں، دین میں مہارت بالکل مفت ہے۔ ہمارا مشن اسلامی علم تک رسائی کو جمہوری بنانا ہے۔",
        faqQuestion4: "میں ترجمے میں خرابی کی اطلاع کیسے دوں؟",
        faqAnswer4:
          "براہ کرم مخصوص کتاب، صفحہ، اور خرابی کی تفصیلات کے ساتھ ہمیں ای میل کریں۔ ہم درستگی کو بہت سنجیدگی سے لیتے ہیں۔",
        followUs: "ہمیں فالو کریں",
        socialMediaDescription: "نئی کتابوں، خصوصیات، اور کمیونٹی کی بحثوں کے ساتھ اپ ڈیٹ رہیں۔",
        weRespond: "ہم 24-48 گھنٹوں کے اندر جواب دیتے ہیں",
      },
    },
    turkish: {
      code: "tr",
      name: "Türkçe",
      translations: {
        getInTouch: "İletişime Geçin",
        contactDescription:
          "Sizden haber almayı çok isteriz. Sorularınız, geri bildirimleriniz veya önerileriniz olsun, ekibimiz İslami bilgi yolculuğunuzda size yardımcı olmak için burada.",
        sendMessage: "Bize Mesaj Gönderin",
        fullName: "Ad Soyad *",
        emailAddress: "E-posta Adresi *",
        subject: "Konu *",
        message: "Mesaj *",
        fullNamePlaceholder: "Adınız soyadınız",
        emailPlaceholder: "sizin.email@ornek.com",
        subjectPlaceholder: "Bu ne hakkında?",
        messagePlaceholder: "Lütfen düşüncelerinizi, sorularınızı veya geri bildirimlerinizi paylaşın...",
        sending: "Gönderiliyor...",
        sendMessageBtn: "Mesaj Gönder",
        successMessage: "✅ Mesajınız için teşekkürler! 24-48 saat içinde size geri döneceğiz.",
        errorMessage:
          "❌ Mesajınızı gönderirken bir hata oluştu. Lütfen tekrar deneyin veya doğrudan bizimle iletişime geçin.",
        contactInformation: "İletişim Bilgileri",
        email: "E-posta",
        emailContact: "contact@deenmastery.com",
        responseTime: "Yanıt Süresi",
        responseTimeDetails: "Pazartesi - Cuma: 09:00 - 18:00 EST",
        weekendNote: "Hafta sonu mesajları Pazartesi günü yanıtlanır",
        languages: "Diller",
        languagesList: "İngilizce, Arapça, İspanyolca, Almanca",
        additionalLanguages: "Portekizce, Urduca, Türkçe, Bahasa",
        faq: "Sık Sorulan Sorular",
        faqQuestion1: "Kütüphane için nasıl kitap önerebilirim?",
        faqAnswer1:
          "Bize kitap başlığı, yazar ve neden topluluğumuz için değerli olacağını düşündüğünüzü içeren bir e-posta gönderin.",
        faqQuestion2: "Çevirilere katkıda bulunabilir miyim?",
        faqAnswer2:
          "Evet! Nitelikli çevirmenleri memnuniyetle karşılıyoruz. Lütfen kimlik bilgileriniz ve dil uzmanlığınızla bizimle iletişime geçin.",
        faqQuestion3: "Kütüphaneyi kullanmak ücretsiz mi?",
        faqAnswer3: "Evet, Deen Mastery tamamen ücretsizdir. Misyonumuz İslami bilgiye erişimi demokratikleştirmektir.",
        faqQuestion4: "Çevirideki bir hatayı nasıl bildirebilirim?",
        faqAnswer4:
          "Lütfen belirli kitap, sayfa ve hata ayrıntılarıyla bize e-posta gönderin. Doğruluğu çok ciddiye alıyoruz.",
        followUs: "Bizi Takip Edin",
        socialMediaDescription: "Yeni kitaplar, özellikler ve topluluk tartışmalarıyla güncel kalın.",
        weRespond: "24-48 saat içinde yanıtlıyoruz",
      },
    },
    bahasa: {
      code: "id",
      name: "Bahasa",
      translations: {
        getInTouch: "Hubungi Kami",
        contactDescription:
          "Kami ingin mendengar dari Anda. Apakah Anda memiliki pertanyaan, umpan balik, atau saran, tim kami di sini untuk membantu Anda dalam perjalanan pengetahuan Islam.",
        sendMessage: "Kirim Pesan kepada Kami",
        fullName: "Nama Lengkap *",
        emailAddress: "Alamat Email *",
        subject: "Subjek *",
        message: "Pesan *",
        fullNamePlaceholder: "Nama lengkap Anda",
        emailPlaceholder: "email.anda@contoh.com",
        subjectPlaceholder: "Tentang apa ini?",
        messagePlaceholder: "Silakan bagikan pemikiran, pertanyaan, atau umpan balik Anda...",
        sending: "Mengirim...",
        sendMessageBtn: "Kirim Pesan",
        successMessage: "✅ Terima kasih atas pesan Anda! Kami akan menghubungi Anda dalam 24-48 jam.",
        errorMessage: "❌ Terjadi kesalahan saat mengirim pesan Anda. Silakan coba lagi atau hubungi kami langsung.",
        contactInformation: "Informasi Kontak",
        email: "Email",
        emailContact: "contact@deenmastery.com",
        responseTime: "Waktu Respons",
        responseTimeDetails: "Senin - Jumat: 9 AM - 6 PM EST",
        weekendNote: "Pesan akhir pekan dijawab pada hari Senin",
        languages: "Bahasa",
        languagesList: "Inggris, Arab, Spanyol, Jerman",
        additionalLanguages: "Portugis, Urdu, Turki, Bahasa",
        faq: "Pertanyaan yang Sering Diajukan",
        faqQuestion1: "Bagaimana saya bisa menyarankan buku untuk perpustakaan?",
        faqAnswer1:
          "Kirimkan email kepada kami dengan judul buku, penulis, dan mengapa Anda pikir itu akan berharga bagi komunitas kami.",
        faqQuestion2: "Bisakah saya berkontribusi terjemahan?",
        faqAnswer2:
          "Ya! Kami menyambut penerjemah yang berkualitas. Silakan hubungi kami dengan kredensial dan keahlian bahasa Anda.",
        faqQuestion3: "Apakah perpustakaan gratis untuk digunakan?",
        faqAnswer3: "Ya, Deen Mastery sepenuhnya gratis. Misi kami adalah mendemokratisasi akses ke pengetahuan Islam.",
        faqQuestion4: "Bagaimana saya melaporkan kesalahan dalam terjemahan?",
        faqAnswer4:
          "Silakan email kami dengan buku spesifik, halaman, dan detail kesalahan. Kami sangat serius tentang akurasi.",
        followUs: "Ikuti Kami",
        socialMediaDescription: "Tetap update dengan buku baru, fitur, dan diskusi komunitas.",
        weRespond: "Kami merespons dalam 24-48 jam",
      },
    },
  }

  // Get current translations - NO LANGUAGE SWITCHING
  const t = languageConfig[currentLanguage]?.translations || languageConfig.english.translations

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Here you would typically send the form data to your backend
      console.log("Form submitted:", formData)

      setSubmitStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
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
              <Mail className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">{t.getInTouch}</h2>
            <p className="text-xl text-amber-700 mb-6 max-w-3xl mx-auto leading-relaxed">{t.contactDescription}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900 flex items-center text-2xl">
                    <MessageSquare className="w-6 h-6 mr-3" />
                    {t.sendMessage}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          {t.fullName}
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="border-amber-200 focus:border-amber-500"
                          placeholder={t.fullNamePlaceholder}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          {t.emailAddress}
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="border-amber-200 focus:border-amber-500"
                          placeholder={t.emailPlaceholder}
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        {t.subject}
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="border-amber-200 focus:border-amber-500"
                        placeholder={t.subjectPlaceholder}
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        {t.message}
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="border-amber-200 focus:border-amber-500"
                        placeholder={t.messagePlaceholder}
                      />
                    </div>

                    {submitStatus === "success" && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 text-sm">{t.successMessage}</p>
                      </div>
                    )}

                    {submitStatus === "error" && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">{t.errorMessage}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t.sending}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {t.sendMessageBtn}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900 flex items-center text-xl">
                    <Phone className="w-5 h-5 mr-3" />
                    {t.contactInformation}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{t.email}</p>
                      <p className="text-gray-600">{t.emailContact}</p>
                      <p className="text-sm text-gray-500">{t.weRespond}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{t.responseTime}</p>
                      <p className="text-gray-600">{t.responseTimeDetails}</p>
                      <p className="text-sm text-gray-500">{t.weekendNote}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{t.languages}</p>
                      <p className="text-gray-600">{t.languagesList}</p>
                      <p className="text-sm text-gray-500">{t.additionalLanguages}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900 text-xl">{t.faq}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.faqQuestion1}</h4>
                    <p className="text-sm text-gray-600">{t.faqAnswer1}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.faqQuestion2}</h4>
                    <p className="text-sm text-gray-600">{t.faqAnswer2}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.faqQuestion3}</h4>
                    <p className="text-sm text-gray-600">{t.faqAnswer3}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.faqQuestion4}</h4>
                    <p className="text-sm text-gray-600">{t.faqAnswer4}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900 text-xl">{t.followUs}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                      <Facebook className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                      <Youtube className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                      <Twitter className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors">
                      <span className="text-white font-bold">☁</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{t.socialMediaDescription}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
