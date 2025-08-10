"use client"

import { ArrowLeft, BookOpen, Users, Globe, Heart, Award, Target, Languages, Shield, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AboutPageProps {
  onBack: () => void
  onCategorySelect?: (category: string) => void
}

const AboutPage = ({ onBack, onCategorySelect }: AboutPageProps) => {
  const handleCategoryClick = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category)
      onBack() // Navigate back to home with the selected category
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <Button onClick={onBack} variant="ghost" className="mr-4 hover:bg-amber-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
          <h1 className="text-2xl font-bold text-amber-900">About Deen Mastery</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-600 text-white rounded-full mb-6">
              <BookOpen className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">About Deen Mastery</h2>
            <p className="text-xl text-amber-700 mb-6 max-w-4xl mx-auto leading-relaxed">
              Deen Mastery is the world's first pan-lingual, externally validated library of classical Islamic texts. We
              are committed to democratizing access to works that were previously locked behind language barriers and
              scholarly gatekeeping—making them available to readers at all levels of expertise.
            </p>
          </div>

          {/* Main Description */}
          <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-8 mb-12">
            <p className="text-gray-700 leading-relaxed mb-6">
              To date, we have integrated the Shamela corpus, with additional classical and contemporary corpora planned
              as we continue to expand.
            </p>

            {/* Language Support */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-amber-900 mb-4 flex items-center">
                <Languages className="w-5 h-5 mr-2" />
                Supported Languages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["English", "Spanish", "German", "Portuguese", "Urdu", "Turkish", "Bahasa"].map((lang) => (
                  <div key={lang} className="bg-amber-50 px-3 py-2 rounded-lg text-center text-amber-800 font-medium">
                    {lang}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              This project builds on over 15 years of pioneering work in Qur'anic accessibility across English, Spanish,
              French, German, and Bahasa. With Deen Mastery, we extend that legacy to a broader range of Islamic
              literature—offering not only multilingual resources, but also translations in regional dialects and
              vernacular forms of major world languages.
            </p>

            {/* Target Audience */}
            <div className="bg-amber-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-amber-900 mb-4">Whether you are:</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <Heart className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>a parent seeking storybooks for your family,</span>
                </li>
                <li className="flex items-start">
                  <Award className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>an academic in need of reliable reference translations, or</span>
                </li>
                <li className="flex items-start">
                  <Target className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>a lifelong learner on a personal journey of growth,</span>
                </li>
              </ul>
              <p className="mt-4 font-bold text-amber-900">Deen Mastery is designed to meet your needs.</p>
            </div>
          </div>

          {/* Quality & Accuracy Section */}
          <div className="mb-12">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center text-2xl">
                  <Shield className="w-6 h-6 mr-3" />
                  Quality & Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  This library is currently in active development. Our proprietary LLM pipeline excels at contextual
                  nuance, archaic words, unusual sentence structure. That means it's perfectly suited at the task of
                  classical Arabic translation….and only getting better.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">Current Accuracy: ~85%</span>
                  </div>
                  <p className="text-green-700 text-sm">
                    Most remaining issues are due to hallucinations (i.e., overly creative insertions by AI models)
                    rather than outright mistranslations.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Known Issues Include:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span>
                        Untimely transliteration (where the model transliterates content that should be translated, or
                        vice versa)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span>Improper pronoun selection</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span>Model selects narrow meaning instead of broad meanings</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 leading-relaxed">
                    We appreciate your patience and feedback as we refine and improve. Our commitment is to academic
                    integrity, linguistic precision, and reader trust.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-amber-900 mb-8 text-center">What Makes Us Different</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-amber-200 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Pan-Lingual Access</h4>
                  <p className="text-gray-600 text-sm">
                    Breaking down language barriers with translations in multiple languages and regional dialects.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-200 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Externally Validated</h4>
                  <p className="text-gray-600 text-sm">
                    Our translations undergo rigorous validation processes to ensure accuracy and authenticity.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-200 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">For All Levels</h4>
                  <p className="text-gray-600 text-sm">
                    From beginners to advanced scholars, our resources cater to readers at every level of expertise.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Browse Categories Section - FIXED */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-amber-900 mb-6 text-center">Browse by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Hadith", "Fiqh", "Tafsir", "Aqeedah", 
                "Seerah", "Arabic Language", "Islamic History", "Miscellaneous"
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
              Powered by Advanced AI
            </h3>
            <p className="text-gray-700 text-center mb-6 leading-relaxed">
              Our proprietary LLM pipeline is specifically designed for classical Arabic texts, excelling at contextual
              nuance, archaic vocabulary, and complex sentence structures that traditional translation tools struggle
              with.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="font-semibold text-amber-900 mb-1">Contextual Understanding</div>
                <div className="text-sm text-amber-700">Advanced comprehension of classical Arabic nuances</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="font-semibold text-amber-900 mb-1">Continuous Learning</div>
                <div className="text-sm text-amber-700">AI models that improve with each translation</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="font-semibold text-amber-900 mb-1">Quality Assurance</div>
                <div className="text-sm text-amber-700">Multi-layer validation and review processes</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-amber-100 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Join Our Mission</h3>
            <p className="text-amber-800 mb-6 max-w-2xl mx-auto">
              Help us democratize access to Islamic knowledge. Whether you're a reader, translator, or supporter,
              there's a place for you in our growing community.
            </p>
            <Button onClick={onBack} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
              Explore Our Library
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
