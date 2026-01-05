import { FAQSection } from '../components/FAQSection';
import { Phone, Mail } from 'lucide-react';
import { storeConfig } from '../config/store';

export function FAQPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-neutral-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-neutral-300 max-w-3xl">
            Find answers to common questions about our stores, products, and services.
            Can't find what you're looking for? Contact us directly.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />

      {/* Contact Section */}
      <section className="bg-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl mb-4">Still Have Questions?</h2>
            <p className="text-neutral-600 mb-6">
              Our friendly staff is here to help. Contact us by phone or email.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${storeConfig.phone}`}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Us
              </a>
              <a
                href={`mailto:${storeConfig.email}`}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Send Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

