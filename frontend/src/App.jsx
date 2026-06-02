import { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const [formMessage, setFormMessage] = useState('');

  const BACKEND_URL = 'http://127.0.0.1:8000';

  const [profile, setProfile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProjects();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/profile`, { method: 'GET' });
      if (!res.ok) return;
      const data = await res.json();
      setProfile(data.data || null);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('avatar', avatarFile);
      const res = await fetch(`${BACKEND_URL}/api/profile`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.data);
        setAvatarFile(null);
        setAvatarPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        console.error('Upload failed', data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      setProjectsError(null);
      
      const response = await fetch(`${BACKEND_URL}/api/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjectsError('Failed to load projects. Please try again later.');
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormStatus(null);
    setFormMessage('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus('success');
        setFormMessage('Thank you! Your message has been received. I will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          message: '',
        });
        
        setTimeout(() => {
          setFormStatus(null);
          setFormMessage('');
        }, 5000);
      } else {
        setFormStatus('error');
        if (data.errors) {
          const errorMessages = Object.values(data.errors)
            .flat()
            .join('. ');
          setFormMessage(errorMessages || 'There was an error submitting your message. Please try again.');
        } else {
          setFormMessage(data.message || 'There was an error submitting your message. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      setFormMessage('Network error. Please check your connection and try again.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-slate-900 to-fuchsia-950">
      
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-cyan-700/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-cyan-400">Woldemariam Abi</div>
          <div className="flex gap-8">
            <a href="#hero" className="text-slate-300 hover:text-cyan-300 transition">Home</a>
            <a href="#projects" className="text-slate-300 hover:text-cyan-300 transition">Projects</a>
            <a href="#contact" className="text-slate-300 hover:text-cyan-300 transition">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-40 pb-32 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fadeIn animate-hero-swing">
            <div className="flex flex-col items-center gap-6">
              <div className="slide-up animate-sway-lr">
                {profile && profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar" className="avatar" />
                ) : (
                  <div className="avatar-placeholder">WA</div>
                )}
              </div>

              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Software Engineering
                </span>
                <span className="block text-white mt-2">Student</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Hi! I'm Woldemariam Abi, a passionate software engineering student building modern web applications 
              and exploring full-stack development. I specialize in React, Django, and cloud technologies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <a 
                href="#projects" 
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-semibold rounded-lg transition duration-300 transform hover:scale-105"
              >
                View My Projects
              </a>
              <a 
                href="#contact" 
                className="px-8 py-3 border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 font-semibold rounded-lg transition"
              >
                Get In Touch
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-12 animate-sway-lr">
              <a 
                href="https://github.com/woldemaria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition flex items-center gap-2"
              >
                <span>GitHub</span>
              </a>
              <a 
                href="https://www.tiktok.com/@woldemary" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition flex items-center gap-2"
              >
                <span>TikTok</span>
              </a>
              <a 
                href="https://www.youtube.com/@WoldemaryAbi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition flex items-center gap-2"
              >
                <span>YouTube</span>
              </a>
              <a 
                href="tel:+251920001617" 
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition flex items-center gap-2"
              >
                <span>+251 920 001 617</span>
              </a>
            </div>
            {/* Avatar upload UI (simple) */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <input ref={fileInputRef} onChange={handleAvatarChange} type="file" accept="image/*" className="hidden" id="avatarInput" />
              <label htmlFor="avatarInput" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 cursor-pointer">Choose Avatar</label>
              {avatarPreview && (
                <div className="flex items-center gap-3">
                  <img src={avatarPreview} alt="preview" className="avatar" />
                  <button onClick={uploadAvatar} disabled={uploading} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">{uploading ? 'Uploading...' : 'Upload'}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              My Projects
            </span>
          </h2>

          {projectsLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <div className="border-4 border-slate-700 border-t-blue-500 rounded-full h-12 w-12"></div>
              </div>
              <p className="mt-4 text-slate-400">Loading projects...</p>
            </div>
          )}

          {projectsError && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 text-center text-red-300 mb-8">
              {projectsError}
            </div>
          )}

          {!projectsLoading && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="group bg-slate-700/40 border border-slate-600 rounded-lg p-6 hover:border-blue-400 transition duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
                >
                  <h3 className="text-2xl font-bold mb-3 text-blue-300 group-hover:text-blue-200 transition">
                    {project.title}
                  </h3>
                  <p className="text-slate-300 mb-4 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-400 mb-2">Tech Stack:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack && project.tech_stack.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-blue-500/20 border border-blue-400/50 text-blue-300 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
                  >
                    View on GitHub →
                  </a>
                </div>
              ))}
            </div>
          )}

          {!projectsLoading && projects.length === 0 && !projectsError && (
            <div className="text-center text-slate-400">
              <p>No projects available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-4">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-5xl font-bold mb-16 text-center">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>

          <form onSubmit={handleFormSubmit} className="bg-slate-800/60 border border-slate-600 rounded-lg p-8 backdrop-blur-sm">
            <div className="mb-6">
              <label htmlFor="name" className="block text-slate-300 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                disabled={formLoading}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition disabled:opacity-50"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-slate-300 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                disabled={formLoading}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition disabled:opacity-50"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-slate-300 font-semibold mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Write your message here..."
                disabled={formLoading}
                rows="5"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition resize-none disabled:opacity-50"
                required
              ></textarea>
            </div>

            {formStatus && (
              <div
                className={`mb-6 p-4 rounded-lg border ${
                  formStatus === 'success'
                    ? 'bg-green-500/20 border-green-500 text-green-300'
                    : 'bg-red-500/20 border-red-500 text-red-300'
                }`}
              >
                {formMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={formLoading}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
            >
              {formLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⋯</span>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-600 text-center text-slate-400">
            <p className="mb-4">Or reach out through social media:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://github.com/woldemaria" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition">GitHub</a>
              <a href="https://www.tiktok.com/@woldemary" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition">TikTok</a>
              <a href="https://www.youtube.com/@WoldemaryAbi" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition">YouTube</a>
              <a href="https://www.facebook.com/woldemariam.abi.techane" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition">Facebook</a>
              <a href="https://t.me/myusernamewolde" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition">Telegram</a>
              <a href="tel:+251920001617" className="text-slate-400 hover:text-blue-400 transition">+251 920 001 617</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-700 bg-slate-900/50">
        <div className="container mx-auto text-center text-slate-400">
          <p>© 2026 Woldemariam Abi. All rights reserved. | Crafted with React, Django, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
