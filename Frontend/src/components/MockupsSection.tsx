
import { Monitor, Smartphone, Tablet } from "lucide-react";

const MockupsSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Beautiful Design,
            <span className="bg-gradient-to-r from-cre8-blue to-cre8-purple bg-clip-text text-transparent">
              {" "}Every Device
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            CRE8HUB looks and works perfectly on desktop, tablet, and mobile devices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="text-center">
            <div className="bg-gradient-to-r from-cre8-blue/20 to-cre8-purple/20 rounded-2xl p-8 mb-6">
              <Monitor className="h-16 w-16 text-cre8-blue mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Desktop</h3>
            <p className="text-gray-300">Full-featured experience with advanced tools</p>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-r from-cre8-blue/20 to-cre8-purple/20 rounded-2xl p-8 mb-6">
              <Tablet className="h-16 w-16 text-cre8-purple mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Tablet</h3>
            <p className="text-gray-300">Optimized interface for touch interactions</p>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-r from-cre8-blue/20 to-cre8-purple/20 rounded-2xl p-8 mb-6">
              <Smartphone className="h-16 w-16 text-cre8-blue mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Mobile</h3>
            <p className="text-gray-300">Create and manage content on the go</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MockupsSection;
