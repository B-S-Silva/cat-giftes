import { motion } from 'framer-motion';
import { StarIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

const ProfileHeader = ({ user, onClaimDaily }) => {
  const [xpProgress, setXpProgress] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [currentXp, setCurrentXp] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const nextLevelXp = currentLevel * 100;
  const userName = user?.name || 'Usuário';
  const avatarUrl = user?.avatarUrl || '';
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const avatarSrc = avatarUrl?.startsWith('/') ? baseURL + avatarUrl : avatarUrl;

  useEffect(() => {
    if (user) {
      const newXp = user.xp || 0;
      const newLevel = user.level || 1;
      const newStreak = user.streak || 0;
      
      // Animate XP progress changes
      if (newXp !== currentXp) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
      
      setCurrentXp(newXp);
      setCurrentLevel(newLevel);
      setCurrentStreak(newStreak);
      setXpProgress(Math.min(100, (newXp % 100)));
    }
  }, [user]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mb-8"
    >
      {/* Background gradient with glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-3xl blur-xl opacity-30"></div>
      
      <div className="relative bg-gradient-to-br from-white/95 to-purple-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 dark:border-gray-600/30 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
          {/* Avatar Section */}
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="relative"
            >
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 p-2">
                  {avatarSrc ? (
                    <img 
                    src={avatarSrc || avatarUrl || '/default-avatar.png'} 
                    alt={userName} 
                    className="w-full h-full rounded-full object-cover"
                  />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 flex items-center justify-center">
                      <span className="text-5xl">🐱</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Level badge with enhanced styling */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="absolute -bottom-3 -right-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 dark:from-yellow-500 dark:via-orange-500 dark:to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl border-2 border-white dark:border-gray-800"
              >
                <StarIcon className="w-4 h-4 inline mr-1 animate-spin" />
                Lvl {currentLevel}
              </motion.div>
            </motion.div>
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-3"
            >
              {userName}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 dark:text-gray-300 text-xl mb-6 font-medium"
            >
              @{user?.username || 'catlover'}
            </motion.p>
            
            {/* Enhanced Streak counter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-6 mb-6"
            >
              <div className="flex items-center gap-3 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 text-orange-800 dark:text-orange-200 px-6 py-3 rounded-full shadow-lg border border-orange-200 dark:border-orange-800">
                 <motion.span 
                   className="text-3xl"
                   animate={{ scale: [1, 1.2, 1] }}
                   transition={{ duration: 2, repeat: Infinity }}
                 >
                   🔥
                 </motion.span>
                 <div className="flex flex-col">
                   <span className="font-bold text-lg">{currentStreak}</span>
                   <span className="text-xs opacity-75">dias</span>
                 </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClaimDaily}
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 dark:from-green-600 dark:via-emerald-600 dark:to-teal-600 text-white px-8 py-3 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border border-green-300 dark:border-green-700"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <SparklesIcon className="w-6 h-6 inline mr-2" />
                </motion.div>
                Check-in Diário
              </motion.button>
            </motion.div>
            
            {/* Enhanced XP Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full"
            >
              <div className="flex justify-between text-sm mb-3">
                <span className="font-semibold text-gray-700 dark:text-gray-300">XP Progress</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{currentXp} / {nextLevelXp}</span>
              </div>
              <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentXp / nextLevelXp) * 100}%` }}
                  transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full shadow-lg ${isAnimating ? 'animate-pulse' : ''}`}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
              <div className="flex justify-between text-xs mt-2 text-gray-500 dark:text-gray-400">
                <span>Nível {currentLevel}</span>
                <span>{Math.floor((currentXp / nextLevelXp) * 100)}% completo</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;