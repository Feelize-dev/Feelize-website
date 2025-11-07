import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_API_ENDPOINT || 'http://localhost:3000';

export const ContactForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    message: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/contact`, formData);
      setSubmitStatus({ type: 'success', message: 'Thank you! We\'ll get back to you soon.' });
      setTimeout(() => {
        onClose();
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          projectType: '',
          message: '',
          budget: ''
        });
      }, 2000);
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#141324] border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-[#0580E8] to-[#7000FF] bg-clip-text text-transparent">
            Let's Build Something Amazing
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-gray-800/50 border-gray-700 text-white"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-gray-800/50 border-gray-700 text-white"
                placeholder="john@company.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-300">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="bg-gray-800/50 border-gray-700 text-white"
                placeholder="Your Company"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-gray-800/50 border-gray-700 text-white"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectType" className="text-gray-300">Project Type *</Label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="">Select type</option>
                <option value="campaign">Campaign Site</option>
                <option value="ecommerce">E-commerce</option>
                <option value="saas">SaaS Platform</option>
                <option value="mobile">Mobile App</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-gray-300">Budget Range</Label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-md px-3 py-2"
              >
                <option value="">Select budget</option>
                <option value="< $5k">Less than $5k</option>
                <option value="$5k - $10k">$5k - $10k</option>
                <option value="$10k - $25k">$10k - $25k</option>
                <option value="$25k+">$25k+</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-300">Project Details *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="bg-gray-800/50 border-gray-700 text-white"
              placeholder="Tell us about your project, goals, and timeline..."
            />
          </div>

          {submitStatus && (
            <div className={`p-4 rounded-lg ${
              submitStatus.type === 'success' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {submitStatus.message}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-[#0580E8] to-[#7000FF] hover:opacity-90 text-white py-6 text-lg"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;
