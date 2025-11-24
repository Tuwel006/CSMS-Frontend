import React, { useState } from 'react';
import { Shield, TrendingUp, Users, Award, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import ThemeToggle from '../components/ui/ThemeToggle';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level security with encrypted data transmission and secure authentication protocols."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Comprehensive performance metrics and predictive analytics for strategic decision making."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Seamless team management with role-based access control and real-time collaboration tools."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Professional Standards",
      description: "Industry-compliant scoring system meeting international cricket board standards."
    }
  ];

  return (
    <div className={cn(
      'min-h-screen flex flex-col lg:flex-row relative',
      isDark ? 'bg-slate-900' : 'bg-slate-50'
    )}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Left Side - Professional Branding */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <div className={cn(
          'absolute inset-0',
          isDark 
            ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800' 
            : 'bg-gradient-to-br from-slate-100 via-white to-slate-200'
        )}></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Header */}
          <div>
            <div className="flex items-center mb-8">
              <div className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center mr-4',
                isDark ? 'bg-blue-600' : 'bg-blue-600'
              )}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                  Cricket Score Management System
                </h1>
                <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
                  Enterprise-Grade Cricket Analytics Platform
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="flex-1 flex items-center">
            <div className="grid grid-cols-2 gap-6 w-full">
              {features.map((feature, index) => (
                <div key={index} className={cn(
                  'p-6 rounded-xl border transition-all duration-200 hover:shadow-lg',
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' 
                    : 'bg-white/80 border-slate-200 hover:bg-white backdrop-blur-sm'
                )}>
                  <div className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
                    isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                  )}>
                    {feature.icon}
                  </div>
                  <h3 className={cn('font-semibold mb-2', isDark ? 'text-white' : 'text-slate-900')}>
                    {feature.title}
                  </h3>
                  <p className={cn('text-sm leading-relaxed', isDark ? 'text-slate-400' : 'text-slate-600')}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8">
            <div className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-500')}>
              © 2024 Cricket Score Management System. All rights reserved.
            </div>
          </div>
        </div>
        
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-6 sm:mb-8 pt-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                    CSMS
                  </h1>
                  <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
                    Enterprise Platform
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {features.slice(0, 2).map((feature, index) => (
                  <div key={index} className={cn(
                    'p-3 rounded-lg border text-center',
                    isDark 
                      ? 'bg-slate-800/50 border-slate-700' 
                      : 'bg-white/80 border-slate-200'
                  )}>
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2',
                      isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                    )}>
                      {React.cloneElement(feature.icon, { className: 'w-4 h-4' })}
                    </div>
                    <h3 className={cn('text-xs font-medium', isDark ? 'text-white' : 'text-slate-900')}>
                      {feature.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Card 
            size="md" 
            variant="elevated"
            className={cn(
              'shadow-xl border-0',
              isDark ? 'bg-slate-800' : 'bg-white'
            )}
          >
            {/* Auth Toggle */}
            <div className={cn(
              'flex p-1 mb-8 rounded-lg',
              isDark ? 'bg-slate-700' : 'bg-slate-100'
            )}>
              <button
                onClick={() => setIsLogin(true)}
                className={cn(
                  'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center',
                  isLogin
                    ? 'bg-white text-slate-900 shadow-sm'
                    : isDark 
                      ? 'text-slate-400 hover:text-slate-300'
                      : 'text-slate-600 hover:text-slate-700'
                )}
              >
                Sign In
                {isLogin && <ChevronRight className="w-4 h-4 ml-1" />}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={cn(
                  'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center',
                  !isLogin
                    ? 'bg-white text-slate-900 shadow-sm'
                    : isDark 
                      ? 'text-slate-400 hover:text-slate-300'
                      : 'text-slate-600 hover:text-slate-700'
                )}
              >
                Sign Up
                {!isLogin && <ChevronRight className="w-4 h-4 ml-1" />}
              </button>
            </div>

            {/* Forms */}
            <div className="transition-all duration-300">
              {isLogin ? <LoginForm /> : <SignupForm />}
            </div>

            {/* Footer */}
            <div className={cn(
              'mt-8 pt-6 border-t text-center',
              isDark ? 'border-slate-700' : 'border-slate-200'
            )}>
              <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-500')}>
                Protected by enterprise-grade security protocols
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;