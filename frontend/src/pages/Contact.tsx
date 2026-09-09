import { useState } from 'react';
import { motion } from 'framer-motion';
import { TerminalHeader } from '../components/TerminalHeader';
import { Typewriter } from '../components/Typewriter';
import { Mail, MapPin, Phone, Send, Github, Linkedin, Twitter, ExternalLink, CheckCircle } from 'lucide-react';
import { usePublicSettings } from '../hooks/usePublicSettings';
import { useContactForm } from '../queries/useContactForm';
import { ApiClientError } from '../api/client';
import { FaXTwitter } from "react-icons/fa6";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMutation = useContactForm();
  const { data: settings, isLoading: settingsLoading } = usePublicSettings();

  const contactEmail = settings?.email ?? '';
  const contactPhone = settings?.phone ?? '';
  const contactAddress = settings?.address ?? '';
  const githubUrl = settings?.github ?? '#';
  const linkedinUrl = settings?.linkedin ?? '#';
  const twitterUrl = settings?.twitter ?? '#';
  // Alias so the JSX below (which already reads `isSubmitting` in three
  // places) needs no further changes — M6 only swaps where the form
  // submits to, not how the UI reflects submission state.
  const isSubmitting = contactMutation.isPending;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    contactMutation.mutate(formData, {
      onSuccess: () => {
        setIsSubmitted(true);

        // Reset form after success
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
      },
      onError: (error) => {
        const message =
          error instanceof ApiClientError ? error.message : 'Failed to send message. Please try again.';
        setErrors((prev) => ({ ...prev, message }));
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: contactEmail,
      href: `mailto:${contactEmail}`,
      color: 'text-blue-500',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: contactPhone,
      href: `tel:${contactPhone}`,
      color: 'text-green-500',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: contactAddress,
      href: '#',
      color: 'text-purple-500',
    },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      url: githubUrl,
      icon: Github,
      color: 'hover:text-white',
    },
    {
      name: 'LinkedIn',
      url: linkedinUrl,
      icon: Linkedin,
      color: 'hover:text-blue-500',
    },
    {
      name: 'X',
      url: twitterUrl,
      icon: FaXTwitter,
      color: 'hover:text-white',
    },
  ];

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-mono text-primary-500">
          Loading contact information...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Terminal Header */}
      <TerminalHeader
        command="ping contact.server"
        description="Establishing connection to communication endpoint"
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <div className="bg-bg-surface border border-neutral-700 rounded-xl p-8 shadow-card">
                <div className="mb-8">
                  <h2 className="font-mono text-2xl font-bold text-primary-500 mb-4">
                    Send Message
                  </h2>
                  <div className="font-mono text-sm text-accent-500">
                    <span>$</span>
                    <span className="text-primary-500 ml-2">cat message_template.txt</span>
                  </div>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle size={64} className="text-primary-500 mx-auto mb-4" />
                    <h3 className="font-mono text-xl font-semibold text-primary-500 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <Typewriter
                      text="> Message delivered. Expect response within 24 hours."
                      delay={50}
                      className="text-neutral-400 text-sm"
                    />
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label className="block font-mono text-sm text-accent-500 mb-2">
                        <span className="text-primary-500 mr-2">&gt;</span>
                        name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full bg-bg-elevated border ${errors.name ? 'border-red-500' : 'border-neutral-700'} rounded-md px-4 py-3 text-neutral-200 placeholder-neutral-600 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-2">{errors.name}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block font-mono text-sm text-accent-500 mb-2">
                        <span className="text-primary-500 mr-2">&gt;</span>
                        email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full bg-bg-elevated border ${errors.email ? 'border-red-500' : 'border-neutral-700'} rounded-md px-4 py-3 text-neutral-200 placeholder-neutral-600 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                      )}
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label className="block font-mono text-sm text-accent-500 mb-2">
                        <span className="text-primary-500 mr-2">&gt;</span>
                        subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full bg-bg-elevated border ${errors.subject ? 'border-red-500' : 'border-neutral-700'} rounded-md px-4 py-3 text-neutral-200 placeholder-neutral-600 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                        placeholder="What's this about?"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-2">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className="block font-mono text-sm text-accent-500 mb-2">
                        <span className="text-primary-500 mr-2">&gt;</span>
                        message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className={`w-full bg-bg-elevated border ${errors.message ? 'border-red-500' : 'border-neutral-700'} rounded-md px-4 py-3 text-neutral-200 placeholder-neutral-600 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none`}
                        placeholder="Tell me about your project or inquiry..."
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-2">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 px-6 rounded-lg font-mono font-bold text-lg transition-all duration-200 ${
                        isSubmitting
                          ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                          : 'bg-primary-500 text-bg-surface hover:bg-primary-700 shadow-glow hover:shadow-card-hover'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
                          <span>SENDING...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Send size={20} />
                          <span>[ SEND MESSAGE ]</span>
                        </div>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-5 space-y-8"
            >
              {/* Contact Methods */}
              <div className="bg-[#030506] border border-neutral-700 rounded-xl p-6 transition-all duration-300 hover:border-primary-500/60 hover:shadow-[0_0_25px_rgba(0,255,80,0.08)] hover:-translate-y-1">
                <h3 className="font-mono text-lg font-semibold text-primary-500 mb-6">
                  Contact Methods
                </h3>
                <div className="space-y-4">
                  {contactMethods.map((method) => {
                    const IconComponent = method.icon;
                    if (settingsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-mono text-primary-500">
          Loading contact information...
        </div>
      </div>
    );
  }

  return (
                      <div key={method.label} className="flex items-center space-x-4">
                        <div className={`p-3 bg-black border border-neutral-800 rounded-lg ${method.color}`}>
                          <IconComponent size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-neutral-200">{method.label}</div>
                          <div className="text-sm text-neutral-400">{method.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Availability Status */}
              <div className="bg-[#030506] border border-neutral-700 rounded-xl p-6 transition-all duration-300 hover:border-primary-500/60 hover:shadow-[0_0_25px_rgba(0,255,80,0.08)] hover:-translate-y-1">
                <h3 className="font-mono text-lg font-semibold text-primary-500 mb-6">
                  Availability Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
                    <span className="font-mono text-sm text-neutral-200">Available for new projects</span>
                  </div>
                  <div className="text-sm text-neutral-400">
                    <div className="mb-2">Response time: Within 24 hours</div>
                    <div>Time zone: IST (UTC+5:30)</div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-[#030506] border border-neutral-700 rounded-xl p-6 transition-all duration-300 hover:border-primary-500/60 hover:shadow-[0_0_25px_rgba(0,255,80,0.08)] hover:-translate-y-1">
                <h3 className="font-mono text-lg font-semibold text-primary-500 mb-6">
                  Connect With Me
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {socialLinks.map((link) => {
                    const IconComponent = link.icon;
                    if (settingsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-mono text-primary-500">
          Loading contact information...
        </div>
      </div>
    );
  }

  return (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col items-center p-4 bg-black border border-neutral-800 rounded-lg text-neutral-400 ${link.color} transition-all duration-200 hover:scale-105 hover:shadow-card`}
                      >
                        <IconComponent size={24} className="mb-2" />
                        <span className="text-xs font-mono">{link.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Terminal-style footer message */}
      <section className="py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-bg-surface border border-neutral-700 rounded-xl p-8 font-mono"
          >
            <div className="text-accent-500 mb-4">
              $ echo "Thank you for visiting!"
            </div>
            <div className="space-y-2 text-neutral-200">
              <p>I'm always interested in discussing new opportunities and challenging projects.</p>
              <p className="text-primary-500">
                Let's build something amazing together.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-700 text-sm text-neutral-400">
              <div className="flex items-center justify-center space-x-2">
                <ExternalLink size={16} />
                <span>Connection established. Awaiting your message...</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
