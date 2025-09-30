"use client"

import { Layout } from "@/components/layout"
import { motion } from "framer-motion"
import { ShoppingBag, Users, Heart, Globe, Shield, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
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
                About <span className="text-primary">BharatShop</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Connecting local kirana stores with their communities through technology, 
                one order at a time.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                BharatShop was born from a simple idea: to bridge the gap between traditional 
                local kirana stores and modern convenience. We believe that every neighborhood 
                store deserves to thrive in the digital age while maintaining their personal 
                touch and community connection.
              </p>
            </motion.div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: "Community First",
                  description: "We prioritize supporting local businesses and strengthening neighborhood bonds."
                },
                {
                  icon: Users,
                  title: "Inclusive Growth",
                  description: "Every shopkeeper, regardless of size, gets equal opportunities to grow."
                },
                {
                  icon: Shield,
                  title: "Trust & Safety",
                  description: "Secure transactions and reliable delivery with complete customer satisfaction."
                },
                {
                  icon: Globe,
                  title: "Digital Empowerment",
                  description: "Bringing modern technology to traditional businesses without losing their essence."
                },
                {
                  icon: Truck,
                  title: "Fast Delivery",
                  description: "Quick, reliable delivery that respects both customer time and shopkeeper resources."
                },
                {
                  icon: ShoppingBag,
                  title: "Quality Products",
                  description: "Fresh, authentic products from trusted local suppliers and manufacturers."
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center p-6 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <value.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="container mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  BharatShop started as a conversation between friends who noticed that while 
                  big e-commerce platforms were growing, the local kirana stores that had 
                  served communities for generations were struggling to adapt to the digital world.
                </p>
                <p>
                  We realized that these stores weren't just businesses—they were the heart 
                  of neighborhoods, places where people knew each other, where credit was 
                  given on trust, and where fresh produce was handpicked daily.
                </p>
                <p>
                  Today, BharatShop connects thousands of local stores with their communities, 
                  helping them serve customers better while preserving the personal touch 
                  that makes local shopping special.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Get in Touch
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Have questions about BharatShop? Want to partner with us? We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:hello@bharatshop.com"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  Contact Us
                </a>
                <a
                  href="mailto:shopkeeper@bharatshop.com"
                  className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors duration-200"
                >
                  For Shopkeepers
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
