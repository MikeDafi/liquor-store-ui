import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../data/faqs';

export function FAQSection({ limit }: { limit?: number }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const displayFaqs = limit ? faqs.slice(0, limit) : faqs;

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl mb-2">Frequently Asked Questions</h2>
        <p className="text-neutral-600">
          Everything you need to know about our stores and services
        </p>
      </div>

      <div className="space-y-4">
        {displayFaqs.map(faq => (
          <div
            key={faq.id}
            className="border border-neutral-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
            >
              <span className="pr-8">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 flex-shrink-0 transition-transform ${
                  openId === faq.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {openId === faq.id && (
              <div className="px-4 pb-4 text-neutral-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {limit && (
        <div className="text-center mt-8">
          <a
            href="/faq"
            className="inline-block px-6 py-3 border border-neutral-900 rounded-lg hover:bg-neutral-900 hover:text-white transition-colors"
          >
            View All FAQs
          </a>
        </div>
      )}
    </section>
  );
}

