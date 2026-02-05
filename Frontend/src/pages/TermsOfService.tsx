import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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
            Terms of Service
          </h1>
          <p className="text-gray-500 text-sm mb-12">
            Last updated: February 2025
          </p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By accessing or using Cre8Hub, you agree to be bound by these Terms of Service.
                If you do not agree, do not use our services. We may update these terms from
                time to time; continued use constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                2. Description of Service
              </h2>
              <p className="leading-relaxed">
                Cre8Hub provides AI-powered tools and insights for content creators, including
                project management, promotional asset generation, multi-platform formatting,
                and analytics. We reserve the right to modify, suspend, or discontinue any
                part of the service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                3. Account and Eligibility
              </h2>
              <p className="leading-relaxed">
                You must be at least 13 years old (or the minimum age in your jurisdiction) to
                use Cre8Hub. You are responsible for maintaining the confidentiality of your
                account and for all activities under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                4. User Content and Conduct
              </h2>
              <p className="leading-relaxed">
                You retain ownership of content you create. By using our services, you grant
                Cre8Hub a limited license to use, process, and display your content as needed
                to provide the service. You agree not to upload content that infringes
                others&apos; rights, is illegal, or violates our community guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                5. Acceptable Use
              </h2>
              <p className="leading-relaxed">
                You agree to use Cre8Hub only for lawful purposes. Prohibited conduct includes
                misuse of AI features, attempting to gain unauthorized access, interfering
                with the service, or using it to harass or harm others.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                6. Limitation of Liability
              </h2>
              <p className="leading-relaxed">
                Cre8Hub is provided &quot;as is.&quot; To the maximum extent permitted by law, we
                disclaim warranties and shall not be liable for indirect, incidental, special,
                or consequential damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                7. Termination
              </h2>
              <p className="leading-relaxed">
                We may suspend or terminate your account for violations of these terms. You
                may delete your account at any time. Upon termination, your right to use the
                service ceases immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                8. Contact
              </h2>
              <p className="leading-relaxed">
                For questions about these Terms of Service, contact us at legal@cre8hub.com.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <Link
              to="/privacy"
              className="text-cre8-blue hover:text-cre8-purple transition-colors"
            >
              View Privacy Policy →
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default TermsOfService;
