import React, { useState } from "react";
import { Share2, User, Mail, MessageSquare, Send, Sparkles } from "lucide-react";
import SocialLinks from "./SocialLinks";
import Swal from "sweetalert2";
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Swal.fire({
      title: 'Sending Message...',
      html: 'Please wait while we send your message',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#0f172a',
      color: '#ffffff',
      confirmButtonColor: '#818cf8',
    });

    try {
      const form = e.target;

      // Submit the native form (keeps existing behaviour with formsubmit.co)
      // calling submit() is synchronous and may navigate away — leaving as-is
      form.submit();

      // If the page doesn't navigate (e.g. when used as an AJAX endpoint), show success
      setTimeout(() => {
        Swal.fire({
          title: 'Success!',
          text: 'Your message has been sent successfully!',
          icon: 'success',
          confirmButtonColor: '#818cf8',
          timer: 2000,
          timerProgressBar: true,
          background: '#0f172a',
          color: '#ffffff'
        });

        setFormData({ name: "", email: "", message: "" });
        setIsSubmitting(false);
      }, 700);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonColor: '#818cf8',
        background: '#0f172a',
        color: '#ffffff'
      });
      setIsSubmitting(false);
    }
  };

  // Motion variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.15 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="Contact">
      <motion.div
        className="text-center lg:mt-[5%] mt-10 mb-2 sm:px-0 px-[5%]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={sectionVariants}
      >
        <motion.div variants={childVariants} className="inline-block relative group">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
            Contact Me
          </h2>
        </motion.div>

        <motion.p
          variants={childVariants}
          className="mt-2 text-slate-300 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-purple-500" />
          Got a question? Send me a message, and I'll get back to you soon.
          <Sparkles className="w-5 h-5 text-purple-500" />
        </motion.p>
      </motion.div>

      <motion.div
        className="h-auto py-10 flex items-center justify-center px-[5%] md:px-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={sectionVariants}
      >
        {/* Single column layout — right column (animation) removed */}
        <div className="w-full max-w-2xl">
          <motion.div
            variants={childVariants}
            className="bg-slate-900/30 backdrop-blur-xl rounded-3xl shadow-2xl p-5 py-10 sm:p-10 transform transition-all duration-300 hover:shadow-purple-500/10 border border-slate-700/50 hover:border-purple-500/30"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
                  Get in Touch
                </h2>
                <p className="text-slate-400">Have something to discuss? Send me a message and let's talk.</p>
              </div>
              <Share2 className="w-10 h-10 text-purple-500 opacity-50" aria-hidden />
            </div>

            <form
              action="https://formsubmit.co/n.zakhrouf.inf@lagh-univ.dz"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-6"
              aria-busy={isSubmitting}
            >
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />

              <motion.div variants={childVariants} className="relative group">
                <User className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-4 pl-12 bg-slate-900/50 rounded-xl border border-slate-700/50 placeholder-slate-500 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 hover:border-purple-500/30 disabled:opacity-50"
                  required
                />
              </motion.div>

              <motion.div variants={childVariants} className="relative group">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-4 pl-12 bg-slate-900/50 rounded-xl border border-slate-700/50 placeholder-slate-500 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 hover:border-purple-500/30 disabled:opacity-50"
                  required
                />
              </motion.div>

              <motion.div variants={childVariants} className="relative group">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full resize-none p-4 pl-12 bg-slate-900/50 rounded-xl border border-slate-700/50 placeholder-slate-500 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 hover:border-purple-500/30 h-[9.9rem] disabled:opacity-50"
                  required
                />
              </motion.div>

              <motion.button
                variants={childVariants}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>

            <motion.div variants={childVariants} className="mt-10 pt-6 border-t border-slate-700/50 flex justify-center space-x-6">
              <SocialLinks />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactPage;
