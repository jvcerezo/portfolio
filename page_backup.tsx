export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Hi, I'm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Jet Timothy Cerezo
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            A passionate developer creating beautiful and functional web experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              View My Work
            </button>
            <button className="px-8 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Contact Me
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                I'm a full-stack developer specializing in modern web technologies and healthcare applications. 
                With expertise in the MERN stack and Next.js, I create scalable solutions that solve real-world problems 
                in healthcare, nutrition, social advocacy, and bioinformatics.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                My projects span diverse domains from diet planning and healthcare management systems 
                to genetic data analysis platforms, showcasing my ability to adapt technology to various industries and user needs.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'MERN Stack', 'MongoDB', 'Express.js', 'Tailwind CSS', 'Vercel'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
          Featured Projects
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Diet Plan Calculator */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <div className="text-white text-4xl font-bold">🥗</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Diet Plan Calculator
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                A comprehensive health application that calculates personalized diet plans and nutrition recommendations based on user goals and preferences.
              </p>
              <div className="flex justify-between items-center">
                <a 
                  href="https://diet-plan-calculator.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Project →
                </a>
                <span className="text-sm text-gray-500 dark:text-gray-400">Health & Nutrition</span>
              </div>
            </div>
          </div>

          {/* SOSC3 Advocacy App */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <div className="text-white text-4xl font-bold">📢</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                SOSC3 Advocacy App
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                A social advocacy platform designed to promote community engagement and social awareness through interactive features and campaigns.
              </p>
              <div className="flex justify-between items-center">
                <a 
                  href="https://sosc3-advocacy-app.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Project →
                </a>
                <span className="text-sm text-gray-500 dark:text-gray-400">Social Impact</span>
              </div>
            </div>
          </div>

          {/* MDCAS Frontend */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
              <div className="text-white text-4xl font-bold">🏥</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                MDCAS Healthcare System
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                A modern healthcare management system frontend with intuitive user interface for medical data and appointment scheduling.
              </p>
              <div className="flex justify-between items-center">
                <a 
                  href="https://mdcas-fe.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Project →
                </a>
                <span className="text-sm text-gray-500 dark:text-gray-400">Healthcare</span>
              </div>
            </div>
          </div>

          {/* SNPSeek MERN */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <div className="text-white text-4xl font-bold">🧬</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                SNPSeek MERN App
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                A full-stack MERN application for genetic data analysis and SNP (Single Nucleotide Polymorphism) research with advanced search capabilities.
              </p>
              <div className="flex justify-between items-center">
                <a 
                  href="https://snpseek-mern.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Project →
                </a>
                <span className="text-sm text-gray-500 dark:text-gray-400">Bioinformatics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Get In Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            I'm always interested in new opportunities and collaborations. 
            Let's connect and create something amazing together!
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
