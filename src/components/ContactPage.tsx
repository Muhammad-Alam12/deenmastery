"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ContactPageProps {
  onBack: () => void
}

const ContactPage = ({ onBack }: ContactPageProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    setError(null)

    try {
      const response = await fetch("https://formspree.io/f/xovwgypq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          subject: formData.subject,
          message: formData.message,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        // Track successful form submission
        if (window.gtag) {
          window.gtag("event", "form_submit", {
            event_category: "contact",
            event_label: "success",
          })
        }

        // Reset form after 5 seconds
        setTimeout(() => {
          setSubmitted(false)
          setFormData({ name: "", email: "", subject: "", message: "" })
        }, 5000)
      } else {
        throw new Error("Failed to send message")
      }
    } catch (err) {
      setError("Failed to send message. Please try again or contact us directly.")
      if (window.gtag) {
        window.gtag("event", "form_submit", {
          event_category: "contact",
          event_label: "error",
        })
      }
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
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Get in Touch</h2>
            <p className="text-amber-700 text-lg max-w-2xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">contact@deenmastery.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">Available via email contact</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">Global Digital Library</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">General Inquiries</span>
                      <span className="text-gray-900 font-medium">24-48 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Technical Support</span>
                      <span className="text-gray-900 font-medium">2-3 business days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Content Suggestions</span>
                      <span className="text-gray-900 font-medium">7-10 days</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-800">
                      We appreciate your patience as we work to provide thoughtful, comprehensive responses to all
                      inquiries.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-600 mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-600 mb-4">
                      Thank you for contacting us. We'll get back to you within 24-48 hours.
                    </p>
                    <p className="text-sm text-gray-500">This form will reset automatically in a few seconds.</p>
                  </div>
                ) : (
                  <form
                    action="https://formspree.io/f/xovwgypq"
                    method="POST"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
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
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
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
                        placeholder="Please describe your inquiry in detail..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
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
                )}
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          {/* <div className="mt-12">
            <h3 className="text-2xl font-bold text-amber-900 mb-6 text-center">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-amber-200">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">How can I download books?</h4>
                  <p className="text-gray-600 text-sm">
                    Simply click on any book to open it in our reader, then use the download button in the top toolbar
                    to save the EPUB file to your device.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Are all books free?</h4>
                  <p className="text-gray-600 text-sm">
                    Yes, all books in our digital library are freely available for reading and download. Our mission is
                    to make Islamic knowledge accessible to everyone.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Can I suggest new books?</h4>
                  <p className="text-gray-600 text-sm">
                    We welcome suggestions for new books to add to our collection. Please use the contact form above
                    with your recommendations and we'll review them within 7-10 days.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">How accurate are the translations?</h4>
                  <p className="text-gray-600 text-sm">
                    Our AI-powered translations are currently at approximately 85% accuracy and continuously improving.
                    We use advanced LLM pipelines specifically designed for classical Arabic texts.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Is there a mobile app?</h4>
                  <p className="text-gray-600 text-sm">
                    Our website is fully responsive and works great on mobile devices. We're also working on dedicated
                    mobile apps for iOS and Android.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">How can I contribute?</h4>
                  <p className="text-gray-600 text-sm">
                    We welcome volunteers, translators, and contributors. Contact us to learn about opportunities to
                    help expand our library or improve our platform.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div> */}

        </div>
      </div>
    </div>
  )
}

export default ContactPage
