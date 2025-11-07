import { motion } from 'framer-motion';
import { DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

const DeviceMockup = ({ children, type = 'mobile', className = '' }) => {
  const isMobile = type === 'mobile';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative ${className}`}
    >
      {/* Device Frame */}
      <div className={`
        relative mx-auto bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] shadow-2xl
        ${isMobile ? 'w-80 h-[600px] p-4' : 'w-full max-w-4xl h-96 p-6'}
      `}>
        {/* Screen */}
        <div className={`
          w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl overflow-hidden
          ${isMobile ? 'rounded-[1.5rem]' : 'rounded-xl'}
        `}>
          {/* Dynamic Island */}
          {isMobile && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black rounded-full">
              <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          )}
          
          {/* Content Area */}
          <div className={`
            w-full h-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm overflow-hidden
            ${isMobile ? 'rounded-[1.5rem] mt-6' : 'rounded-xl'}
          `}>
            {children}
          </div>
        </div>
        
        {/* Home Button (Mobile) */}
        {isMobile && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-800 rounded-full border-2 border-gray-700">
            <div className="w-6 h-6 bg-gray-700 rounded-full mx-auto mt-1.5"></div>
          </div>
        )}
        
        {/* Device Icon */}
        <div className="absolute -top-2 -right-2 bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-full shadow-lg">
          {isMobile ? (
            <DevicePhoneMobileIcon className="w-5 h-5 text-white" />
          ) : (
            <ComputerDesktopIcon className="w-5 h-5 text-white" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DeviceMockup;