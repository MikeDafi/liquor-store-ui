export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'Do you sell full liquor in San Francisco?',
    answer: 'Yes! All three of our San Francisco locations carry a full selection of spirits including whiskey, vodka, tequila, rum, gin, and more. We are fully licensed liquor stores with extensive selections of both premium and everyday brands.',
    category: 'Products'
  },
  {
    id: 'faq-2',
    question: 'Are you near Union Square?',
    answer: 'Our flagship Union Square Liquor & Market is located at 123 Powell Street, just steps from Union Square. We also have locations in North Beach and the Financial District for your convenience.',
    category: 'Locations'
  },
  {
    id: 'faq-3',
    question: 'Do you offer delivery?',
    answer: 'Delivery service is coming soon! Currently, all purchases must be made in-store. Sign up for our newsletter to be notified when delivery becomes available in your area.',
    category: 'Services'
  },
  {
    id: 'faq-4',
    question: 'Do prices online match in-store prices?',
    answer: 'The prices listed on our website are for reference and may vary slightly from in-store pricing. We recommend calling your preferred location to confirm current pricing and availability.',
    category: 'Pricing'
  },
  {
    id: 'faq-5',
    question: 'Do you carry international brands?',
    answer: 'Absolutely! We specialize in both local California wines and spirits as well as international selections including Japanese whiskey and sake, Scotch, Irish whiskey, French wines, Italian liqueurs, and much more.',
    category: 'Products'
  },
  {
    id: 'faq-6',
    question: 'Are you open late?',
    answer: 'Yes! Our Union Square location is open until 11:00 PM on weekdays and midnight on weekends. Hours vary by location, so please check our location pages for specific times.',
    category: 'Hours'
  },
  {
    id: 'faq-7',
    question: 'Can I check if a specific product is in stock?',
    answer: 'Yes! Call any of our locations directly and our staff will be happy to check availability for you. We update our inventory daily but recommend calling ahead for rare or high-demand items.',
    category: 'Products'
  },
  {
    id: 'faq-8',
    question: 'Do you have pharmacy and grocery items?',
    answer: 'Yes! In addition to our full liquor selection, we carry pharmacy essentials, dairy products, frozen foods, and home goods for your convenience.',
    category: 'Products'
  },
  {
    id: 'faq-9',
    question: 'What are your most popular items for tourists?',
    answer: 'Tourists love our local selections including Anchor Steam Beer (brewed in SF), Napa Valley wines, and our premium Japanese whiskey collection. We also carry travel-friendly sizes perfect for hotel rooms.',
    category: 'Products'
  },
  {
    id: 'faq-10',
    question: 'Do you offer bulk discounts?',
    answer: 'We offer competitive pricing on case purchases of wine and spirits. Ask our staff in-store about current promotions and bulk pricing options.',
    category: 'Pricing'
  }
];
