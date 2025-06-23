import React from 'react';
import { Play, BookOpen, Clock } from 'lucide-react';

const Dashboard = ({ onVideoSelect }) => {
  const courses = [
      {
      id: 3,
      title: 'Mathematics Part 3',
      description: 'Quadratic Functions and Polynomial Operations',
      duration: '2h 45m',
      level: 'SSC',
      videoUrl: 'https://iframe.mediadelivery.net/embed/458316/b7e4922a-2438-4f87-b92b-be444b1ef848',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 2,
      title: 'Mathematics Part 2',
      description: 'Linear Equations and Graphing Techniques',
      duration: '3h 15m',
      level: 'Beginner',
      videoUrl: 'https://www.youtube.com/embed/aZdUhs_v9Ps?autoplay=1&rel=0&modestbranding=1',
      thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400',
      color: 'from-green-500 to-emerald-500'
    },
  
    {
      id: 4,
      title: 'Mathematics Part 4',
      description: 'Trigonometry and Circular Functions',
      duration: '4h 20m',
      level: 'Intermediate',
      videoUrl: 'https://www.youtube.com/embed/WwlykEBKgwM?autoplay=1&rel=0&modestbranding=1',
      thumbnail: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 5,
      title: 'Mathematics Part 5',
      description: 'Calculus Fundamentals and Derivatives',
      duration: '5h 10m',
      level: 'Advanced',
      videoUrl: 'https://www.youtube.com/embed/ZIX3hmBUZqE?autoplay=1&rel=0&modestbranding=1',
      thumbnail: 'https://images.unsplash.com/photo-1606134842536-87d4b76e6ac4?w=400',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 6,
      title: 'Mathematics Part 6',
      description: 'Advanced Calculus and Integration Techniques',
      duration: '3h 45m',
      level: 'Advanced',
      videoUrl: 'https://www.youtube.com/embed/91jHyXUSIH0?autoplay=1&rel=0&modestbranding=1',
      thumbnail: 'https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=400',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 7,
      title: 'Mathematics Part 7',
      description: 'Trigonometry and Circular Functions',
      duration: '4h 20m',
      level: 'Intermediate',
      videoUrl: 'https://www.youtube.com/embed/WwlykEBKgwM?autoplay=1&rel=0&modestbranding=1',
      thumbnail: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 8,
      title: 'Mathematics Part 8',
      description: 'Fundamentals of Algebra and Basic Operations',
      duration: '2h 30m',
      level: 'Beginner',
      videoUrl: 'https://player.vimeo.com/video/1089631711?h=02c7a70e35&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 9,
      title: 'Mathematics Part 9',
      description: 'Fundamentals of Algebra and Basic Operations',
      duration: '2h 30m',
      level: 'Beginner',
      videoUrl: 'https://player.vimeo.com/video/1089631711?h=02c7a70e35&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
      color: 'from-blue-500 to-cyan-500'
    },
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mathematics Learning Hub</h1>
              <p className="text-gray-600 mt-1">Master mathematics with our comprehensive video courses</p>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="font-semibold text-gray-800">Welcome, Naveen!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in border border-white/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${course.color} opacity-90`}></div>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{course.duration}</span>
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                

                <button
                  onClick={() => onVideoSelect(course)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 mt-4"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Learning</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/80 backdrop-blur-lg border-t border-white/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-blue-600">5</div>
              <div className="text-gray-600">Course Modules</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="text-3xl font-bold text-green-600">18h+</div>
              <div className="text-gray-600">Total Content</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="text-3xl font-bold text-purple-600">100%</div>
              <div className="text-gray-600">Interactive Learning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
