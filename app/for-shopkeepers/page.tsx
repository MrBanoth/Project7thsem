"use client"

import { Layout } from "@/components/layout"
import { motion } from "framer-motion"
import { Store, TrendingUp, Users, Smartphone, Headphones, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ForShopkeepersPage() {
  const features = [
    {
      icon: Store,
      title: "Digital Storefront",
      description: "Create your online presence with a beautiful digital store that showcases your products."
    },
    {
      icon: TrendingUp,
      title: "Sales Analytics",
      description: "Track your sales, popular products, and customer preferences with detailed analytics."
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Build and maintain relationships with your customers through our platform."
    },
    {
      icon: Smartphone,
      title: "Easy Management",
      description: "Manage orders, inventory, and deliveries through our simple mobile-friendly interface."
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team."
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Ensure customer satisfaction with our quality control and feedback system."
    }
  ]

  const benefits = [
    "Increase your customer base by 3-5x",
    "Reduce manual order taking and errors",
    "Get paid faster with digital payments",
    "Access detailed sales reports and insights",
    "Join a network of successful local businesses",
    "No setup fees or hidden charges"
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
                For <span className="text-primary">Shopkeepers</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                Grow your kirana store business with BharatShop. Join thousands of successful 
                shopkeepers who are already serving more customers and increasing their revenue.
              </p>
              <Button size="lg" className="text-lg px-8 py-4">
                Join BharatShop Today
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
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
                Everything You Need to Grow
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our platform provides all the tools and features you need to manage and grow your business.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
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
                        <feature.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  Why Join BharatShop?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Join the digital revolution and take your kirana store to the next level. 
                  Our platform is designed specifically for local businesses like yours.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-primary/5 p-8 rounded-2xl"
              >
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Success Stories
                </h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-primary pl-4">
                    <p className="text-muted-foreground italic mb-2">
                      "Since joining BharatShop, my daily sales have increased by 40%. 
                      The platform is easy to use and my customers love the convenience."
                    </p>
                    <p className="font-semibold text-foreground">- Rajesh Kumar, Mumbai</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <p className="text-muted-foreground italic mb-2">
                      "The analytics feature helps me understand what products are popular 
                      and when to stock them. It's like having a business consultant."
                    </p>
                    <p className="font-semibold text-foreground">- Priya Sharma, Delhi</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How to Join Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                How to Join
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Getting started with BharatShop is simple and takes just a few minutes.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Sign Up",
                  description: "Create your account and provide basic store information."
                },
                {
                  step: "02",
                  title: "Setup Store",
                  description: "Add your products, set prices, and upload store photos."
                },
                {
                  step: "03",
                  title: "Start Selling",
                  description: "Begin receiving orders and serving customers online."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Ready to Grow Your Business?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join BharatShop today and start serving more customers in your area. 
                No setup fees, no hidden charges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  Join Now - It's Free
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Contact Sales Team
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Questions? Email us at <a href="mailto:shopkeeper@bharatshop.com" className="text-primary hover:underline">shopkeeper@bharatshop.com</a>
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
