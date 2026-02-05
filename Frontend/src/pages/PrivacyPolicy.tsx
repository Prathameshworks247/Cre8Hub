import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-black overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div
            className="absolute w-96 h-96 rounded-full mix-blend-screen filter blur-2xl opacity-20"
            style={{
              top: "-10%",
              left: "-10%",
              background: "radial-gradient(circle, #3b82f6, #1d4ed8)",
            }}
          />
          <div
            className="absolute w-80 h-80 rounded-full mix-blend-screen filter blur-2xl opacity-25"
            style={{
              top: "-5%",
              right: "-5%",
              background: "radial-gradient(circle, #8b5cf6, #7c3aed)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm mb-12">
            Last updated: February 2025
          </p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                1. Information We Collect
              </h2>
              <p className="leading-relaxed">
                Cre8Hub collects information you provide directly, including account details,
                profile data, content you create, and information from connected platforms
                (e.g., YouTube) when you authorize integrations. We may also automatically
                collect usage data, device information, and cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                2. How We Use Your Information
              </h2>
              <p className="leading-relaxed">
                We use your information to provide and improve our services, personalize your
                experience, communicate with you, analyze usage patterns, and ensure platform
                security. We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                3. Data Sharing and Disclosure
              </h2>
              <p className="leading-relaxed">
                We may share data with service providers who assist our operations, when
                required by law, or to protect our rights and safety. Content you choose to
                publish to the Cre8Hub showcase may be visible to other users and the public.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                4. Data Security
              </h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational measures to protect
                your personal data against unauthorized access, alteration, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                5. Your Rights
              </h2>
              <p className="leading-relaxed">
                Depending on your location, you may have rights to access, correct, delete,
                or port your data, and to object to or restrict certain processing. Contact
                us to exercise these rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                6. Contact Us
              </h2>
              <p className="leading-relaxed">
                For questions about this Privacy Policy or our data practices, contact us at
                support@cre8hub.com.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <Link
              to="/terms"
              className="text-cre8-blue hover:text-cre8-purple transition-colors"
            >
              View Terms of Service →
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
