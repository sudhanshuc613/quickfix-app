export type ServicePageData = {
  slug: string;
  imagePath: string;
  imageAlt: string;
  label: string;
  title: string;
  summary: string;
  intro: string;
  steps: string[];
  faqs: { question: string; answer: string }[];
};

export const servicePages: ServicePageData[] = [
  {
    slug: 'ro-repair-in-patna', imagePath: '/images/ro-service-technician-patna.jpg', imageAlt: 'Illustrative RO repair inspection scene', label: 'RO repair', title: 'RO Repair in Patna',
    summary: 'Get help diagnosing leaks, low flow, unusual taste and other home RO purifier problems in Patna.',
    intro: 'Tell us the purifier brand, model and symptoms. The team can confirm visit availability and explain the next steps before a repair is booked. Parts and repair work should be approved after diagnosis.',
    steps: ['Share your area, purifier brand/model and the issue.', 'Confirm a visit window with the QuickFix team.', 'Ask for the diagnosis and estimate before approving repair or replacement parts.'],
    faqs: [
      { question: 'Which RO brands can I ask about?', answer: 'You can enquire about Kent, Aquaguard, Pureit, Livpure, Havells, Blue Star, AO Smith, Whirlpool and other common purifier brands. Service availability for a particular model must be confirmed with the team.' },
      { question: 'Can you tell the final repair price before inspecting the purifier?', answer: 'The final cost may depend on the fault and parts required. Ask for the current visit charge and estimate before approving work.' },
      { question: 'Do you guarantee a same-day visit?', answer: 'Availability depends on the address, technician schedule and time of request. Confirm the timing directly before relying on a visit.' }
    ]
  },
  {
    slug: 'ro-installation-in-patna', imagePath: '/images/ro-installation-patna.jpg', imageAlt: 'Illustrative water purifier installation scene', label: 'RO installation', title: 'RO Installation in Patna',
    summary: 'Enquire about new purifier installation, shifting and re-installation for homes and businesses in Patna.',
    intro: 'Share the purifier make/model, installation address and whether the unit is new or being shifted. The team can confirm requirements, availability and the applicable estimate before a visit.',
    steps: ['Share the brand/model and whether the purifier is new, shifted or being re-installed.', 'Confirm the address, water inlet and visit availability with the team.', 'Review any installation charges and extra material requirements before work begins.'],
    faqs: [
      { question: 'Can you install a purifier bought elsewhere?', answer: 'You can enquire with the purifier brand/model and purchase details. The team will confirm whether the installation can be supported.' },
      { question: 'Are pipes or fittings included?', answer: 'Inclusions can vary by job. Confirm the estimate and any material charges before approving installation.' },
      { question: 'Can you shift an existing RO?', answer: 'Ask the team about shifting and re-installation. Share both the current and new address so availability can be checked.' }
    ]
  },
  {
    slug: 'ro-amc-in-patna', imagePath: '/images/ro-filter-maintenance.jpg', imageAlt: 'Illustrative RO filter maintenance scene', label: 'AMC & maintenance', title: 'RO AMC in Patna',
    summary: 'Ask about annual maintenance and planned filter-care options for your water purifier in Patna.',
    intro: 'Maintenance needs differ by purifier model, usage and the parts already fitted. Share your model and service history to discuss the available plan, coverage, visit limits and exclusions before purchase.',
    steps: ['Share the purifier model and recent service/filter history.', 'Ask for plan inclusions, visit limits, exclusions and renewal terms in writing.', 'Keep the invoice and service record for future visits.'],
    faqs: [
      { question: 'What does an AMC include?', answer: 'Coverage depends on the specific plan. Confirm the number of visits, included labour, excluded parts, response terms and expiry date before purchasing.' },
      { question: 'Are filters and membranes included?', answer: 'Do not assume consumables or replacement parts are included. Ask for the written plan terms.' },
      { question: 'Can I renew an existing AMC?', answer: 'Share the previous plan details and expiry date with the team to confirm renewal options.' }
    ]
  },
  {
    slug: 'commercial-ro-service-in-patna', imagePath: '/images/commercial-ro-plant-service.jpg', imageAlt: 'Illustrative commercial RO plant maintenance scene', label: 'Commercial RO', title: 'Commercial RO Service in Patna',
    summary: 'Enquire about commercial purifier and RO plant maintenance for offices, schools, clinics and other sites in Patna.',
    intro: 'For a useful estimate, share the system type, approximate capacity, site address, operating hours, water source and known issues. A site assessment may be needed before a quote can be confirmed.',
    steps: ['Describe the system and its capacity (LPH/LPD if known).', 'Share the site address, operating schedule and symptoms/service history.', 'Request a written scope, exclusions, visit frequency and quote before approving work.'],
    faqs: [
      { question: 'Can you quote an industrial RO plant from a phone call?', answer: 'Some requirements need a site assessment or system details. Share capacity, water source and plant information first; the team can advise what is needed.' },
      { question: 'Do you offer commercial AMC?', answer: 'Enquire with your system details and required visit schedule. Coverage and pricing must be confirmed in a written proposal.' },
      { question: 'What should I include in a commercial request?', answer: 'Include site locality, system capacity, water source, number of users, current symptoms, service history and any test reports available.' }
    ]
  }
];

export const brands = [
  { name: 'Kent', slug: 'kent-ro-service-patna' },
  { name: 'Aquaguard', slug: 'aquaguard-ro-service-patna' },
  { name: 'Pureit', slug: 'pureit-ro-service-patna' },
  { name: 'Livpure', slug: 'livpure-ro-service-patna' },
  { name: 'Havells', slug: 'havells-ro-service-patna' },
  { name: 'Blue Star', slug: 'blue-star-ro-service-patna' },
  { name: 'AO Smith', slug: 'ao-smith-ro-service-patna' },
  { name: 'Whirlpool', slug: 'whirlpool-ro-service-patna' },
  { name: 'Tata Swach', slug: 'tata-swach-ro-service-patna' },
  { name: 'Eureka Forbes', slug: 'eureka-forbes-ro-service-patna' },
  { name: 'Zero B', slug: 'zero-b-ro-service-patna' },
  { name: 'Pentair', slug: 'pentair-ro-service-patna' }
];
