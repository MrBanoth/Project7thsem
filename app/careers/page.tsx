"use client"

import { Layout } from "@/components/layout"
import { motion } from "framer-motion"
import { Clock, Users, Heart, Zap, Mail, Linkedin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function CareersPage() {
  const comingSoonRoles = [
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote / Mumbai",
      type: "Full-time",
      description: "Build beautiful, responsive user interfaces for our web and mobile applications."
    },
    {
      title: "Backend Developer",
      department: "Engineering", 
      location: "Remote / Bangalore",
      type: "Full-time",
      description: "Develop scalable backend systems and APIs to power our platform."
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Mumbai",
      type: "Full-time",
      description: "Lead product strategy and work with cross-functional teams to deliver great user experiences."
    },
    {
      title: "Business Development Manager",
      department: "Business",
      location: "Delhi",
      type: "Full-time",
      description: "Build partnerships with local businesses and expand our network of shopkeepers."
    },
    {
      title: "Customer Success Manager",
      department: "Operations",
      location: "Hyderabad",
      type: "Full-time",
      description: "Help our shopkeepers succeed and ensure excellent customer experiences."
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Create compelling content and campaigns to grow our brand and user base."
    }
  ]

  const values = [
    {
      icon: Users,
      title: "Collaborative",
      description: "We work together as one team, supporting each other to achieve common goals."
    },
    {
      icon: Heart,
      title: "Community-Focused",
      description: "Everything we do is centered around supporting local communities and businesses."
    },
    {
      icon: Zap,
      title: "Innovative",
      description: "We embrace new ideas and technologies to solve real-world problems."
    },
    {
      icon: Clock,
      title: "Fast-Paced",
      description: "We move quickly, iterate fast, and deliver value to our users every day."
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
                Join Our <span className="text-primary">Team</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                We're building the future of local commerce. Join us in empowering 
                local businesses and strengthening communities across India.
              </p>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                🚀 Growing Fast - New Roles Coming Soon!
              </Badge>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
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
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                These core values guide everything we do and shape our company culture.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
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

        {/* Coming Soon Roles Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="container mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Open Positions
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We're growing fast and will be hiring for these roles soon. 
                Stay tuned for updates!
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comingSoonRoles.map((role, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full p-6 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {role.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline">{role.department}</Badge>
                            <Badge variant="outline">{role.location}</Badge>
                            <Badge variant="outline">{role.type}</Badge>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          Coming Soon
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {role.description}
                      </p>
                      <Button variant="outline" size="sm" disabled>
                        Notify Me When Available
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Join Us Section */}
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
                Why Join BharatShop?
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Make a Real Impact
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Join a mission-driven company that's making a real difference in local communities. 
                    Every line of code, every feature, and every decision helps local businesses thrive.
                  </p>
                  <p>
                    You'll work on problems that matter - from helping a small kirana store 
                    increase their sales to ensuring fresh groceries reach families on time.
                  </p>
                  <p>
                    Be part of a team that's building the infrastructure for the future of 
                    local commerce in India.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-primary/5 p-8 rounded-2xl"
              >
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  What We Offer
                </h3>
                <ul className="space-y-4">
                  {[
                    "Competitive salary and equity",
                    "Flexible work arrangements",
                    "Health insurance and wellness benefits",
                    "Learning and development budget",
                    "Modern tech stack and tools",
                    "Inclusive and diverse team culture"
                  ].map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
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
                Don't see a role that fits? We're always looking for talented people 
                who share our mission. Send us your resume and let's talk!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  <Mail className="w-5 h-5 mr-2" />
                  Send Resume
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Linkedin className="w-5 h-5 mr-2" />
                  Connect on LinkedIn
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                Questions? Email us at <a href="mailto:careers@bharatshop.com" className="text-primary hover:underline">careers@bharatshop.com</a>
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
