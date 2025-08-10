"use client"

import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageSquare, Globe, Facebook, Youtube, Twitter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface ContactPageProps {
  onBack: () => void
}

const ContactPage = ({ onBack }: ContactPageProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData)
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
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
          <h1 className="text-2xl font-bold text-amber-900">Contact Us</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-600 text-white rounded-full mb-6">
              <Mail className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-amber-700 mb-6 max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you. Whether you have questions, feedback, or suggestions, 
              our team is here to help you on your journey of Islamic knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900 flex items-center text-2xl">
                    <MessageSquare className="w-6 h-6 mr-3" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="border-amber-200 focus:border-amber-500"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="border-amber-200 focus:border-amber-500"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="border-amber-200 focus:border-amber-500"
                        placeholder="What is this regarding?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="border-amber-200 focus:border-amber-500"
                        placeholder="Please share your thoughts, questions, or feedback..."
                      />
                    </div>

                    {submitStatus === 'success' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 text-sm">
                          ✅ Thank you for your message! We'll get back to you within 24-48 hours.
                        </p>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">
                          ❌ There was an error sending your message. Please try again or contact us directly.
                        </p>
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
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
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
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">contact@deenmastery.com</p>
                      <p className="text-sm text-gray-500">We respond within 24-48 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Response Time</p>
                      <p className="text-gray-600">Monday - Friday: 9 AM - 6 PM EST</p>
                      <p className="text-sm text-gray-500">Weekend messages answered on Monday</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Languages</p>
                      <p className="text-gray-600">English, Arabic, Spanish, German</p>
                      <p className="text-sm text-gray-500">Portuguese, Urdu, Turkish, Bahasa</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900 text-xl">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">How can I suggest a book for the library?</h4>
                    <p className="text-sm text-gray-600">
                      Send us an email with the book title, author, and why you think it would be valuable for our community.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Can I contribute translations?</h4>
                    <p className="text-sm text-gray-600">
                      Yes! We welcome qualified translators. Please contact us with your credentials and language expertise.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Is the library free to use?</h4>
                    <p className="text-sm text-gray-600">
                      Yes, Deen Mastery is completely free. Our mission is to democratize access to Islamic knowledge.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">How do I report an error in translation?</h4>
                    <p className="text-sm text-gray-600">
                      Please email us with the specific book, page, and error details. We take accuracy very seriously.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900 text-xl">Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
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
                  <p className="text-sm text-gray-600 mt-4">
                    Stay updated with new books, features, and community discussions.
                  </p>
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
