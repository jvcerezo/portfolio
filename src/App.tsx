import { useState, useEffect } from 'react';
import { Menu, X, ExternalLink, Mail, Phone, MapPin, Github, Linkedin, Download, Code, Palette, Database, Server, Award, Calendar, Users, Star, ChevronRight, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Progress } from './components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-sm border-b border-white/20' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-light tracking-wide">Jet Timothy Cerezo</div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-12">
              {['Home', 'About', 'Projects', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-sm font-light tracking-wide hover:text-gray-400 transition-colors duration-300"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-8 pb-6 border-t border-white/20">
              <div className="flex flex-col space-y-6 mt-6">
                {['Home', 'About', 'Projects', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-left text-lg font-light tracking-wide hover:text-gray-400 transition-colors duration-300"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - New Layout with Large Photo */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Large Photo */}
            <div className="relative order-2 lg:order-1">
              <div className="relative group">
                {/* Main Photo Container */}
                <div className="relative w-full max-w-lg mx-auto">
                  <div className="aspect-[4/5] relative overflow-hidden rounded-3xl border-4 border-white/20 shadow-2xl">
                    <img 
                      src="/profile.jpg" 
                      alt="Jet Timothy Cerezo" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-white/30 rounded-tl-3xl"></div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-white/30 rounded-br-3xl"></div>
                  
                  {/* Floating Badges */}
                  <Card className="absolute -top-6 right-8 bg-black/80 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm font-medium">Available</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="absolute -bottom-8 -left-6 bg-black/80 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Code className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white text-sm font-medium">5+ Years</p>
                          <p className="text-gray-400 text-xs">Experience</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-white/30 text-white">
                    <MapPin className="w-3 h-3 mr-1" />
                    Philippines
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white">
                    <Award className="w-3 h-3 mr-1" />
                    Senior Developer
                  </Badge>
                </div>
                
                <h1 className="text-6xl lg:text-8xl font-light tracking-tight">
                  <span className="block">Jet Timothy</span>
                  <span className="block text-gray-400">Cerezo</span>
                </h1>
                
                <div className="space-y-4">
                  <h2 className="text-2xl lg:text-3xl font-light text-gray-300">
                    Full Stack Developer & UI/UX Enthusiast
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
                    Crafting exceptional digital experiences with modern technologies. 
                    Specialized in React, Node.js, and creating seamless user interfaces 
                    that bridge design and functionality.
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">50+</div>
                    <div className="text-xs text-gray-400">Projects</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">5+</div>
                    <div className="text-xs text-gray-400">Years</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">100%</div>
                    <div className="text-xs text-gray-400">Satisfaction</div>
                  </CardContent>
                </Card>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-200 font-medium"
                  onClick={() => scrollToSection('projects')}
                >
                  View My Work
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => scrollToSection('contact')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Get In Touch
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 pt-4">
                <span className="text-sm text-gray-400">Follow me:</span>
                <div className="flex gap-3">
                  <Button size="sm" variant="ghost" className="text-white hover:text-gray-300">
                    <Github className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white hover:text-gray-300">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Enhanced with Tabs and Skills */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-light mb-6 tracking-wide">About Me</h2>
            <Separator className="w-32 mx-auto bg-white/30" />
            <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
              Passionate about creating digital solutions that make a difference
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 bg-white/5 border border-white/20">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                Overview
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                Skills
              </TabsTrigger>
              <TabsTrigger value="experience" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                Experience
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-12">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div className="space-y-8">
                  <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <Palette className="w-6 h-6" />
                        My Philosophy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">
                        I believe in creating digital experiences that are not just functional, 
                        but truly meaningful. Every line of code I write is crafted with purpose, 
                        user experience in mind, and a commitment to excellence.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <Star className="w-6 h-6" />
                        What Drives Me
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">
                        The intersection of technology and human needs fascinates me. I'm driven 
                        by the challenge of solving complex problems with elegant solutions that 
                        users actually enjoy using.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-8">
                  <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <Award className="w-6 h-6" />
                        Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Projects Completed</span>
                        <Badge variant="secondary">50+</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Client Satisfaction</span>
                        <Badge variant="secondary">100%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Years of Experience</span>
                        <Badge variant="secondary">5+</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <Users className="w-6 h-6" />
                        Collaboration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">
                        I thrive in collaborative environments, working closely with designers, 
                        product managers, and fellow developers to bring visions to life.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { category: 'Frontend', icon: Code, skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vue.js'], level: 95 },
                  { category: 'Backend', icon: Server, skills: ['Node.js', 'Express', 'Python', 'MongoDB', 'PostgreSQL'], level: 90 },
                  { category: 'Tools & DevOps', icon: Database, skills: ['Git', 'Docker', 'AWS', 'Vercel', 'CI/CD'], level: 85 },
                ].map((skillGroup, index) => (
                  <Card key={index} className="bg-white/5 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <skillGroup.icon className="w-6 h-6" />
                        {skillGroup.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Proficiency</span>
                          <span className="text-white">{skillGroup.level}%</span>
                        </div>
                        <Progress value={skillGroup.level} className="bg-white/10" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="border-white/30 text-white text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-8">
              <div className="space-y-8">
                {[
                  {
                    role: 'Senior Full Stack Developer',
                    company: 'Freelance',
                    period: '2022 - Present',
                    description: 'Leading development of modern web applications using React, Node.js, and cloud technologies.',
                    achievements: ['Built 20+ production applications', 'Improved client efficiency by 40%', 'Mentored junior developers']
                  },
                  {
                    role: 'Frontend Developer',
                    company: 'Tech Startup',
                    period: '2020 - 2022',
                    description: 'Specialized in creating responsive, user-friendly interfaces with modern JavaScript frameworks.',
                    achievements: ['Redesigned main product UI', 'Reduced load times by 60%', 'Implemented design system']
                  },
                  {
                    role: 'Web Developer',
                    company: 'Digital Agency',
                    period: '2019 - 2020',
                    description: 'Developed custom websites and web applications for various clients across different industries.',
                    achievements: ['Delivered 15+ client projects', 'Maintained 99% uptime', 'Built reusable component library']
                  }
                ].map((job, index) => (
                  <Card key={index} className="bg-white/5 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white">{job.role}</CardTitle>
                          <CardDescription className="text-gray-400 mt-1">
                            {job.company} • {job.period}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="border-white/30 text-white">
                          <Calendar className="w-3 h-3 mr-1" />
                          {job.period.split(' - ')[1]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{job.description}</p>
                      <div className="space-y-2">
                        <h4 className="text-white font-medium text-sm">Key Achievements:</h4>
                        <ul className="space-y-1">
                          {job.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="text-gray-300 text-sm flex items-center gap-2">
                              <ChevronRight className="w-3 h-3 text-gray-400" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Projects Section - Enhanced with Detailed Cards */}
      <section id="projects" className="py-32 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-light mb-6 tracking-wide">Featured Projects</h2>
            <Separator className="w-32 mx-auto bg-white/30" />
            <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
              A showcase of my recent work and technical expertise
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {[
              {
                title: 'Task Manager App',
                description: 'A comprehensive task management application with real-time updates and collaborative features.',
                link: 'https://task-manager-jet-cerezo.vercel.app/',
                tech: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
                features: ['Real-time collaboration', 'Task prioritization', 'Team management', 'Progress tracking'],
                status: 'Live Production',
                image: '/api/placeholder/600/400'
              },
              {
                title: 'Budget Tracker',
                description: 'Personal finance management tool with expense tracking and budget planning capabilities.',
                link: 'https://budget-tracker-jet-cerezo.vercel.app/',
                tech: ['Next.js', 'TypeScript', 'Chart.js', 'Prisma'],
                features: ['Expense categorization', 'Budget alerts', 'Financial insights', 'Data export'],
                status: 'Live Production',
                image: '/api/placeholder/600/400'
              },
              {
                title: 'Portfolio Website',
                description: 'A responsive portfolio website showcasing projects and professional experience.',
                link: 'https://portfolio-jet-cerezo.vercel.app/',
                tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
                features: ['Responsive design', 'Smooth animations', 'SEO optimized', 'Fast loading'],
                status: 'Live Production',
                image: '/api/placeholder/600/400'
              },
              {
                title: 'E-commerce Platform',
                description: 'Full-featured e-commerce solution with payment integration and admin dashboard.',
                link: 'https://ecommerce-jet-cerezo.vercel.app/',
                tech: ['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind'],
                features: ['Payment processing', 'Inventory management', 'Order tracking', 'Admin dashboard'],
                status: 'Live Production',
                image: '/api/placeholder/600/400'
              }
            ].map((project, index) => (
              <Card key={index} className="bg-black/50 border-white/20 backdrop-blur-sm overflow-hidden group hover:border-white/40 transition-all duration-500">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.slice(0, 3).map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="border-white/30 text-white text-xs bg-black/50">
                          {tech}
                        </Badge>
                      ))}
                      {project.tech.length > 3 && (
                        <Badge variant="outline" className="border-white/30 text-white text-xs bg-black/50">
                          +{project.tech.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white text-xl group-hover:text-gray-300 transition-colors">
                      {project.title}
                    </CardTitle>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-white hover:text-gray-300 p-2"
                      asChild
                    >
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                  <CardDescription className="text-gray-400 leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-white font-medium text-sm mb-3">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {project.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium text-sm mb-3">Tech Stack:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="border-white/30 text-white text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-white text-black hover:bg-gray-200 font-medium"
                    asChild
                  >
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      View Live Project
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              View All Projects
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section - Enhanced */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-light mb-6 tracking-wide">Let's Work Together</h2>
            <Separator className="w-32 mx-auto bg-white/30" />
            <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
              Ready to bring your ideas to life? Let's create something amazing together.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl mb-4">Get In Touch</CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                    I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Email</h3>
                      <p className="text-gray-400">jet.cerezo@example.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Phone</h3>
                      <p className="text-gray-400">+63 (917) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Location</h3>
                      <p className="text-gray-400">Philippines</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Follow My Journey</CardTitle>
                  <CardDescription className="text-gray-400">
                    Stay updated with my latest projects and insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/10 flex-1"
                      asChild
                    >
                      <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                        <Github className="w-5 h-5 mr-2" />
                        GitHub
                      </a>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/10 flex-1"
                      asChild
                    >
                      <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-5 h-5 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Ready to Start a Project?</CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                    Let's discuss your ideas and turn them into reality
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Available for new projects</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Typically responds within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Free initial consultation</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Button 
                      size="lg" 
                      className="w-full bg-white text-black hover:bg-gray-200 font-medium"
                      asChild
                    >
                      <a href="mailto:jet.cerezo@example.com">
                        <Mail className="w-5 h-5 mr-2" />
                        Send Message
                      </a>
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full border-white/30 text-white hover:bg-white/10"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Project Timeline</CardTitle>
                  <CardDescription className="text-gray-400">
                    Typical project phases and estimated duration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { phase: 'Discovery & Planning', duration: '1-2 weeks' },
                    { phase: 'Design & Prototyping', duration: '2-3 weeks' },
                    { phase: 'Development & Testing', duration: '4-8 weeks' },
                    { phase: 'Launch & Support', duration: 'Ongoing' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-gray-300">{item.phase}</span>
                      <Badge variant="outline" className="border-white/30 text-white">
                        {item.duration}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 font-light">
            © 2025 Jet Timothy Cerezo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;