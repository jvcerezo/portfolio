import { useState, useEffect } from 'react';
import { Menu, X, ExternalLink, Mail, Phone, MapPin, Github, Linkedin, Download, Code, Palette, Database, Server, Award, Calendar, Users, Star, ChevronRight, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
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
                  
                  <Card className="absolute -bottom-8 -left-6 bg-black/90 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Code className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white text-sm font-medium">3 Years</p>
                          <p className="text-gray-300 text-xs">Experience</p>
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
                  <Badge variant="outline" className="border-white/30 text-white bg-white/5">
                    <MapPin className="w-3 h-3 mr-1" />
                    University of the Philippines Los Baños Graduate
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white bg-white/5">
                    <Award className="w-3 h-3 mr-1" />
                    Full-Stack Developer
                  </Badge>
                </div>
                
                <h1 className="text-6xl lg:text-8xl font-light tracking-tight">
                  <span className="block">Jet Timothy</span>
                  <span className="block text-gray-400">Cerezo</span>
                </h1>
                
                <div className="space-y-4">
                  <h2 className="text-2xl lg:text-3xl font-light text-gray-300">
                    Full-Stack Developer
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
                    Computer Science graduate from University of the Philippines Los Baños Batch 2025. 
                    Passionate about building scalable web applications using MongoDB, Express.js, React, and Node.js.
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">11</div>
                    <div className="text-xs text-gray-300">Projects</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">3</div>
                    <div className="text-xs text-gray-300">Years Exp</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">MERN</div>
                    <div className="text-xs text-gray-300">Stack</div>
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
                  className="bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-black transition-all"
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
                  <Button size="sm" variant="ghost" className="text-white hover:text-gray-300 hover:bg-white/10" asChild>
                    <a href="https://github.com/jvcerezo" target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white hover:text-gray-300 hover:bg-white/10" asChild>
                    <a href="https://www.linkedin.com/in/jet-timothy-cerezo-126903254" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                    </a>
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
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 bg-white/10 border border-white/20">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white data-[state=active]:text-black font-medium">
                Overview
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-white data-[state=active]:bg-white data-[state=active]:text-black font-medium">
                Skills
              </TabsTrigger>
              <TabsTrigger value="experience" className="text-white data-[state=active]:bg-white data-[state=active]:text-black font-medium">
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
                        My Journey
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">
                        I am a fresh Computer Science graduate from University of the Philippines Los Baños, 
                        I love everything about full-stack development, from concept making to deployment. I believe in writing 
                        clean, efficient code that creates meaningful digital experiences.
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
                        I consider coding solutions that work toward building scalable web applications that solve real-world problems as a hobby. From Junior year until now
                        the MERN stack excites me because it allows for full-stack development with JavaScript, 
                        creating seamless experiences from database to user interface.
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
                        <span className="text-gray-300">University Projects</span>
                        <Badge variant="secondary" className="bg-white/10 text-white">4+</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Years Experience</span>
                        <Badge variant="secondary" className="bg-white/10 text-white">3 Years</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">MERN Stack Projects</span>
                        <Badge variant="secondary" className="bg-white/10 text-white">4+</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">University of the Philippines Los Baños Graduate</span>
                        <Badge variant="secondary" className="bg-white/10 text-white">2025</Badge>
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
                  { 
                    category: 'Backend Development', 
                    icon: Server, 
                    skills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'RESTful APIs', 'Supabase', 'Firebase', 'Drupal']
                  },
                  { 
                    category: 'Frontend Development', 
                    icon: Code, 
                    skills: ['React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Tailwind CSS', 'Bootstrap', 'Vite', 'Flutter', 'Dart']
                  },
                  { 
                    category: 'Tools & DevOps', 
                    icon: Database, 
                    skills: ['Git', 'GitHub', 'GitLab CI/CD', 'Vercel', 'AWS', 'Docker', 'Render']
                  },
                  { 
                    category: 'AI & APIs', 
                    icon: Star, 
                    skills: ['Gemini API', 'API Integration', 'Data Visualization', 'Machine Learning']
                  },
                  { 
                    category: 'Mobile & Game Dev', 
                    icon: Palette, 
                    skills: ['Flutter', 'Dart', 'Unity', 'C#', 'Mobile Apps', 'Game Mechanics']
                  },
                  { 
                    category: 'Database & Cloud', 
                    icon: Database, 
                    skills: ['MongoDB', 'PostgreSQL', 'Firebase', 'Supabase', 'Cloud Firestore', 'AWS']
                  },
                ].map((skillGroup, index) => (
                  <Card key={index} className="bg-white/5 border-white/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <skillGroup.icon className="w-6 h-6" />
                        {skillGroup.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    role: 'Bachelor of Science in Computer Science',
                    company: 'University of the Philippines Los Baños',
                    period: 'September 2021 - July 2025',
                    description: 'Completed comprehensive computer science education with focus on software engineering, data structures, algorithms, and web development.',
                    achievements: ['Graduated Honor Roll', 'College Scholar and Honor Roll for multiple semesters', 'Special problem in bioinformatics in collaboration with International Rice Research Institute(IRRI)', 'Active member of UPLB Computer Science Society']
                  },
                  {
                    role: 'Codebreak 2.0 Champion',
                    company: 'Tenext.ai Codebreak 2.0 Hackathon',
                    period: 'May 2025',
                    description: 'Won as Champion in Tenext.ai Codebreak 2.0 Hackathon for developing an innovative AI agent in under 24 hours.',
                    achievements: ['Developed an MVP with AI Integration', 'Implemented real-time QA analytics for voice calls', 'Full audio support and real-time script generation during calls', 'Received recognition for technical excellence']
                  },
                  {
                    role: '41st CS Week Code Wars Co-Head / Team Lead / Project Manager',
                    company: 'UPLB Computer Science Society',
                    period: 'January 2025 - March 2025',
                    description: 'Led the web development of the organization\'s flagship event. Managed a team of developers to create a seamless online experience for participants and judges.',
                    achievements: ['AWS Deployment', 'Shipped 8 features in 2 months', 'Successfully launched the app used by 20 teams and 4 judges without any downtimes', 'Leadership']
                  },
                  {
                    role: 'Bioinformatics Software Development Intern',
                    company: 'International Rice Research Institute (IRRI)',
                    period: 'July 2024 - May 2025',
                    description: 'Created an authentication module from scratch using Drupal and Docker, and redeveloped IRRI\'s SNPSeek into SNP-MERN, utilizing modern web technologies and microservices architecture',
                    achievements: ['Learned Drupal and Dockerization', 'Developed SNPSeek and its core functionalities into a new tech stack (MERN) in under 5 months', 'Successfully converted SNPSeek monolithic architecture to microservices', 'Deployed SNP-MERN completely free using my own laptop as a server XD']
                  },
                  {
                    role: '2 Weeks - Full Stack Developer',
                    company: 'Client Project',
                    period: 'August 2024',
                    description: 'Created a responsive story game using ReactJS and Vercel with 2 members for a client in a span of 3 weeks.',
                    achievements: ['Built responsive story game interface', 'Collaborated with team of 3 developers', 'Delivered project within 3-week timeline', 'Deployed using Vercel platform']
                  },
                  {
                    role: 'eLBigayan - Team Lead',
                    company: 'Flutter Development Project',
                    period: 'May 2024 - June 2024',
                    description: 'Led a team of 2 members in developing a Flutter and Dart donation system.',
                    achievements: ['Led team of 3 developers', 'Integrated 4 Firebase services', 'Created secure and scalable backend', 'Delivered fully functional donation platform']
                  },
                  {
                    role: 'Fire Nation Invasion - Game Developer',
                    company: 'Game Development Project',
                    period: 'April 2024 - June 2024',
                    description: 'Worked with 2 members to develop key features, including character abilities and game mechanics.',
                    achievements: ['Developed character abilities and game mechanics', 'Implemented multiplayer feature for up to 4 players', 'Enabled cross-computer connectivity', 'Collaborated in 3-member development team']
                  },
                  {
                    role: 'PICSEL - Backend Developer',
                    company: 'Reservation System Development',
                    period: 'February 2024 - June 2024',
                    description: 'Developed backend components for a reservation system with PostgreSQL, Express.js, Node.js, and React, contributing 94 commits and 12 merged pull requests to 7 features in a 20-developer team over 5 months.',
                    achievements: ['Successfully integrated Google authentication', 'Enhanced security and streamlined user login process', '94 commits and 12 merged pull requests', 'Contributed to 7 features in 20-developer team']
                  },
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
                          {job.period.includes(' - ') ? job.period.split(' - ')[1] : job.period}
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
                title: 'IskOS - Academic Management System',
                description: 'Comprehensive academic system for students to manage their schedules, track absences, and calculate GWA. Features Google Calendar integration and subjects database.',
                link: 'https://isk-os.vercel.app',
                tech: ['React', 'TypeScript', 'Google Calendar API', 'Database'],
                features: ['Schedule import', 'Google Calendar sync', 'Absence tracker', 'GWA Calculator', 'Subjects database'],
                status: 'In Development',
                image: '📚'
              },
              {
                title: 'Ottodot Assessment',
                description: 'Full-stack coding assessment project showcasing modern web development practices with AI integration. Built with TypeScript and Supabase backend.',
                link: 'https://ottodot-coding-task-full-stack-eta.vercel.app',
                tech: ['TypeScript', 'JavaScript', 'Supabase', 'Gemini API'],
                features: ['AI integration', 'Database management', 'Modern TypeScript', 'Supabase backend'],
                status: 'Live Production',
                image: '🤖'
              },
              {
                title: 'SNP-MERN',
                description: 'Full-stack bioinformatics web application for genetic variant analysis and interpretation with advanced filtering capabilities. Developed during IRRI internship.',
                link: 'https://snpseek-mern.vercel.app',
                tech: ['React', 'Node.js', 'Express.js', 'MongoDB'],
                features: ['Genetic variant analysis', 'Interactive charts', 'Advanced filtering', 'Data visualization'],
                status: 'Live Production',
                image: '🧬'
              },
              {
                title: 'SOSC3 Advocacy App',
                description: 'Social advocacy web application promoting community engagement and social awareness campaigns.',
                link: 'https://sosc3-advocacy-app.vercel.app',
                tech: ['React', 'Tailwind CSS', 'HTML', 'Vercel'],
                features: ['Advocacy campaigns', 'Research', 'Social sharing', 'Community features'],
                status: 'Live Production',
                image: '🏛️'
              },
              {
                title: 'Diet Plan Calculator',
                description: 'Health and nutrition application for creating personalized diet plans with calorie tracking and meal recommendations.',
                link: 'https://diet-plan-calculator.vercel.app',
                tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
                features: ['Nutrition calculation', 'Meal planning', 'Calorie tracking', 'Personalized recommendations'],
                status: 'MVP',
                image: '🍎'
              },
              {
                title: 'Maralit Dental Clinic Appointment System',
                description: 'Comprehensive dental clinic management system with appointment scheduling and patient record management.',
                link: 'https://mdcas-fe.vercel.app',
                tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
                features: ['Appointment scheduling', 'Patient management', 'Medical records', 'Clinic administration'],
                status: 'MVP',
                image: '🏥'
              },
            ].map((project, index) => (
              <Card key={index} className="bg-black/50 border-white/20 backdrop-blur-sm overflow-hidden group hover:border-white/40 transition-all duration-500">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl opacity-50">{project.image}</div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.slice(0, 3).map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="border-white/30 text-white text-xs bg-black/70 backdrop-blur-sm">
                          {tech}
                        </Badge>
                      ))}
                      {project.tech.length > 3 && (
                        <Badge variant="outline" className="border-white/30 text-white text-xs bg-black/70 backdrop-blur-sm">
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
        </div>
      </section>

      {/* Contact Section - Enhanced */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-light mb-6 tracking-wide">Let's Connect</h2>
            <Separator className="w-32 mx-auto bg-white/30" />
            <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
              Always open to connecting with fellow developers and exploring new opportunities.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl mb-4">Get In Touch</CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                    I'm always interested in connecting with fellow developers, discussing technology, and exploring potential collaboration opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Email</h3>
                      <p className="text-gray-400">jetjetcerezo@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Phone</h3>
                      <p className="text-gray-400">+63 998 914 8907</p>
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
                    Stay updated with my latest projects and professional growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button 
                      size="lg" 
                      className="bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-black transition-all flex-1"
                      asChild
                    >
                      <a href="https://github.com/jvcerezo" target="_blank" rel="noopener noreferrer">
                        <Github className="w-5 h-5 mr-2" />
                        GitHub
                      </a>
                    </Button>
                    <Button 
                      size="lg" 
                      className="bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-black transition-all flex-1"
                      asChild
                    >
                      <a href="https://www.linkedin.com/in/jet-timothy-cerezo-126903254" target="_blank" rel="noopener noreferrer">
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
                  <CardTitle className="text-white text-2xl">Let's Network</CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                    Always open to connecting with fellow professionals and exploring opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Open to networking opportunities</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Interested in technology discussions</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Always learning and growing</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Button 
                      size="lg" 
                      className="w-full bg-white text-black hover:bg-gray-200 font-medium"
                      asChild
                    >
                      <a href="mailto:jetjetcerezo@gmail.com">
                        <Mail className="w-5 h-5 mr-2" />
                        Send Message
                      </a>
                    </Button>
                    
                    <Button 
                      size="lg" 
                      className="w-full bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-black transition-all"
                      asChild
                    >
                      <a href="/JetCerezo_Resume.pdf" download="Jet_Timothy_Cerezo_Resume.pdf" target="_blank" rel="noopener noreferrer">
                        <Download className="w-5 h-5 mr-2" />
                        Download Resume
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Professional Interests</CardTitle>
                  <CardDescription className="text-gray-400">
                    Areas I'm passionate about and always eager to discuss
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { interest: 'Full-Stack Development', focus: 'MERN Stack' },
                    { interest: 'Software Architecture', focus: 'Scalable Systems' },
                    { interest: 'Technology Innovation', focus: 'Emerging Trends' },
                    { interest: 'Professional Growth', focus: 'Continuous Learning' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-gray-300">{item.interest}</span>
                      <Badge variant="outline" className="border-white/30 text-white">
                        {item.focus}
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