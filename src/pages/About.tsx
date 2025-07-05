import React from 'react';
import { Award, Users, BookOpen, Target, Heart, Star } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Meet Mwatha Njoroge
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                A passionate public speaker, life coach, and author dedicated to empowering 
                individuals to achieve their highest potential and live extraordinary lives.
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">10+</div>
                  <div className="text-blue-200">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">5000+</div>
                  <div className="text-blue-200">Lives Transformed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">50+</div>
                  <div className="text-blue-200">Speaking Events</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Mwatha Njoroge"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-yellow-500 text-blue-900 p-4 rounded-lg shadow-lg">
                <Award className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6">
                <Target className="h-8 w-8 text-blue-800" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600">
                To empower individuals with practical wisdom and transformative insights 
                that enable them to overcome challenges, achieve their goals, and create 
                meaningful, successful lives.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-6">
                <Heart className="h-8 w-8 text-yellow-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-600">
                A world where every individual has access to the knowledge, tools, and 
                inspiration needed to unlock their full potential and contribute positively 
                to society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              The Daring Achievers Story
            </h2>
            <div className="text-lg text-gray-700 space-y-6 text-left">
              <p>
                Mwatha Njoroge's journey began with a simple yet powerful belief: that every 
                person has the potential to achieve greatness, regardless of their background 
                or circumstances. Having overcome his own challenges and achieved success in 
                multiple areas of life, Mwatha felt called to share his insights with others.
              </p>
              <p>
                The Daring Achievers Network was born from this passion to help others. What 
                started as informal mentoring sessions grew into a comprehensive platform 
                offering books, speaking engagements, and coaching services. The name "Daring 
                Achievers" reflects the courage required to pursue one's dreams and the 
                commitment to achieving them.
              </p>
              <p>
                Today, through his books and speaking engagements, Mwatha continues to inspire 
                thousands of individuals across Kenya and beyond. His practical approach to 
                personal development, combined with real-world experience, makes his teachings 
                both accessible and actionable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Areas of Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mwatha brings deep knowledge and practical experience across multiple 
              domains of personal and professional development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <BookOpen className="h-12 w-12 text-blue-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Development</h3>
              <p className="text-gray-600">
                Helping individuals discover their strengths, overcome limiting beliefs, 
                and develop the mindset for success.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Users className="h-12 w-12 text-blue-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Leadership</h3>
              <p className="text-gray-600">
                Training leaders to inspire teams, make effective decisions, and 
                create positive organizational cultures.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Target className="h-12 w-12 text-blue-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Goal Achievement</h3>
              <p className="text-gray-600">
                Providing practical strategies for setting, pursuing, and achieving 
                meaningful personal and professional goals.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Heart className="h-12 w-12 text-blue-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Motivation</h3>
              <p className="text-gray-600">
                Inspiring individuals to maintain momentum, overcome obstacles, 
                and stay committed to their journey.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Award className="h-12 w-12 text-blue-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Growth</h3>
              <p className="text-gray-600">
                Guiding entrepreneurs and business leaders in building sustainable, 
                successful enterprises.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Star className="h-12 w-12 text-blue-800 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Life Coaching</h3>
              <p className="text-gray-600">
                Providing personalized guidance to help individuals create balanced, 
                fulfilling lives aligned with their values.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Transformation?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Join thousands of individuals who have already begun their journey to success 
            with Mwatha Njoroge's transformative books and insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/books"
              className="inline-flex items-center px-8 py-4 bg-yellow-500 text-blue-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Explore Books
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;