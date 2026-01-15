import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Play, Trophy, Users, Target, Activity, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import Container from '../components/ui/lib/Container';
import Section from '../components/ui/lib/Section';
import StatsCard from '../components/ui/lib/StatsCard';
import Grid from '../components/ui/lib/Grid';
import CompactScoreCard from '../components/ui/lib/CompactScoreCard';

const LandingPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const featuredMatches = [
    {
      teamA: { name: 'Mumbai Indians', short: 'MI', score: '187/4', overs: '20.0' },
      teamB: { name: 'Chennai Super Kings', short: 'CSK', score: '142/6', overs: '16.3' },
      status: 'Live',
      matchType: 'IPL'
    },
    {
      teamA: { name: 'Royal Challengers', short: 'RCB', score: '201/3', overs: '20.0' },
      teamB: { name: 'Delhi Capitals', short: 'DC', score: '156/8', overs: '18.2' },
      status: 'Live',
      matchType: 'IPL'
    },
    {
      teamA: { name: 'Kolkata Knight Riders', short: 'KKR', score: '165/7', overs: '20.0' },
      teamB: { name: 'Rajasthan Royals', short: 'RR', score: '168/4', overs: '19.1' },
      status: 'RR won by 6 wickets',
      matchType: 'IPL'
    },
    {
      teamA: { name: 'Sunrisers Hyderabad', short: 'SRH', score: '145/9', overs: '20.0' },
      teamB: { name: 'Punjab Kings', short: 'PBKS', score: '149/3', overs: '18.4' },
      status: 'PBKS won by 7 wickets',
      matchType: 'IPL'
    },
    {
      teamA: { name: 'Gujarat Titans', short: 'GT', score: '178/6', overs: '20.0' },
      teamB: { name: 'Lucknow Super Giants', short: 'LSG', score: '162/8', overs: '20.0' },
      status: 'GT won by 16 runs',
      matchType: 'IPL'
    }
  ];

  const features = [
    { icon: Play, title: 'Live Scoring', description: 'Real-time match scoring with ball-by-ball updates' },
    { icon: Trophy, title: 'Tournament Management', description: 'Create and manage complete cricket tournaments' },
    { icon: Users, title: 'Team Management', description: 'Organize players, teams, and squad selections' },
    { icon: Target, title: 'Advanced Analytics', description: 'Detailed statistics and performance insights' }
  ];

  const stats = [
    { icon: Trophy, title: 'Matches Hosted', value: '10K+' },
    { icon: Users, title: 'Active Users', value: '5K+' },
    { icon: Activity, title: 'Live Now', value: '12' }
  ];

  return (
    <div className={cn('min-h-screen relative', isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-white')}>      
      {/* Hero Section */}
      <div className="text-center py-16 md:py-24">
        <Container>
          <h1 className={cn('text-4xl md:text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-6', isDark ? 'from-white via-blue-200 to-green-200' : 'from-gray-900 via-blue-600 to-green-600')}>
            Cricket Score Management System
          </h1>
          <p className={cn('text-lg md:text-xl max-w-3xl mx-auto mb-8', isDark ? 'text-gray-300' : 'text-gray-600')}>
            Professional cricket scoring, live match tracking, and tournament management platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => navigate('/login')} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xs font-semibold text-lg transition-all duration-200 hover:scale-105 flex items-center gap-2">
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/matches/match/1/score')} className={cn('px-8 py-4 rounded-xs font-semibold text-lg transition-all duration-200 hover:scale-105', isDark ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300')}>
              View Live Demo
            </button>
          </div>
        </Container>
      </div>

      <Container className="space-y-16 pb-16">
        {/* Live Matches - Horizontal Scroll */}
        <Section title="Live Matches" subtitle="Currently happening around the world" className="text-center">
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {featuredMatches.map((match, index) => (
              <CompactScoreCard
                key={index}
                {...match}
                onClick={() => navigate(`/matches/match/${index + 1}/score`)}
              />
            ))}
          </div>
        </Section>

        {/* Features */}
        <Section title="Why Choose CSMS?" subtitle="Everything you need for cricket management" className="text-center">
          <Grid cols={{ default: 1, sm: 2, lg: 4 }}>
            {features.map((feature, index) => (
              <div key={index} className={cn('p-6 rounded-xs text-center transition-all duration-200 hover:scale-105', isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm')}>
                <feature.icon className={cn('w-12 h-12 mx-auto mb-4', isDark ? 'text-blue-400' : 'text-blue-600')} />
                <h3 className={cn('text-lg font-semibold mb-2', isDark ? 'text-white' : 'text-gray-900')}>{feature.title}</h3>
                <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>{feature.description}</p>
              </div>
            ))}
          </Grid>
        </Section>

        {/* Statistics */}
        <Section title="Trusted by Cricket Communities" subtitle="Join thousands of cricket enthusiasts" className="text-center">
          <Grid cols={{ default: 1, sm: 3 }}>
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} className="text-center" />
            ))}
          </Grid>
        </Section>

        {/* CTA Section */}
        <Section className="text-center">
          <div className={cn('p-8 md:p-12 rounded-xs', isDark ? 'bg-gradient-to-r from-blue-900 to-green-900 border border-gray-700' : 'bg-gradient-to-r from-blue-600 to-green-600')}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Scoring?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Join the professional cricket scoring platform used by clubs worldwide</p>
            <button onClick={() => navigate('/login')} className="px-8 py-4 bg-white text-blue-600 rounded-xs font-semibold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105">
              Start Free Trial
            </button>
          </div>
        </Section>
      </Container>

      {/* Footer */}
      <footer className={cn('border-t py-8', isDark ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-600')}>
        <Container>
          <div className="text-center space-y-4">
            <p className="text-sm">© 2024 Cricket Score Management System. All rights reserved.</p>
            <p className="text-xs">Professional cricket scoring made simple and accessible.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;