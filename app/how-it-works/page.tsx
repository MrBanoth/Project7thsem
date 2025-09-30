"use client"

import { Layout } from "@/components/layout"
import { motion } from "framer-motion"
import { Search, ShoppingCart, CreditCard, Truck, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: "Find Local Stores",
      description: "Browse nearby kirana stores in your area. See their products, ratings, and delivery times.",
      step: "01"
    },
    {
      icon: ShoppingCart,
      title: "Add to Cart",
      description: "Select fresh groceries, daily essentials, and household items from multiple stores.",
      step: "02"
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Pay safely with UPI, cards, or cash on delivery. Your payment is protected.",
      step: "03"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Get your order delivered in 15-30 minutes by your local store's delivery team.",
      step: "04"
    },
    {
      icon: CheckCircle,
      title: "Enjoy Fresh Products",
      description: "Receive fresh, quality products and support your local community at the same time.",
      step: "05"
    }
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
                How <span className="text-primary">BharatShop</span> Works
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Getting your daily essentials from local stores has never been easier. 
                Here's how our platform works:
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}
                >
                  <div className="flex-1">
                    <Card className="h-full">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <step.icon className="w-8 h-8 text-primary" />
                          </div>
                          <div className="text-4xl font-bold text-primary/20">
                            {step.step}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-4">
                          {step.title}
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex-1">
                    <div className="w-full h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <step.icon className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">Step {step.step} Illustration</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="container mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Why Choose BharatShop?
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Support Local",
                  description: "Every purchase supports your neighborhood kirana store and local economy."
                },
                {
                  title: "Fresh Products",
                  description: "Get the freshest produce and daily essentials, handpicked by local experts."
                },
                {
                  title: "Fast Delivery",
                  description: "Quick delivery in 15-30 minutes from stores just around the corner."
                },
                {
                  title: "Trusted Quality",
                  description: "Products from stores you know and trust, with quality you can rely on."
                },
                {
                  title: "Fair Prices",
                  description: "Competitive prices with no hidden fees or surge pricing."
                },
                {
                  title: "Personal Service",
                  description: "The personal touch of local shopping with modern convenience."
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center p-6 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of customers who are already enjoying the convenience 
                of local shopping with BharatShop.
              </p>
              <a
                href="/"
                className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 text-lg font-semibold"
              >
                Start Shopping Now
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
