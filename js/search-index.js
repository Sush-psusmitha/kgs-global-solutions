/* =========================================================
   KGS SITE SEARCH — SEARCH INDEX
   =========================================================
   A hand-maintained index of every searchable page on the
   site. Loaded as a plain global (not fetched as JSON) so the
   search feature also works when pages are opened directly
   from disk (file://), where fetch() of local files is
   blocked by the browser.

   HOW TO ADD A NEW PAGE
   ----------------------
   1. Create an object below with:
        title       - short, human-readable name shown in results
        url         - path to the page, relative to the SITE ROOT,
                       no leading slash (e.g. "services/new-page.html")
        category    - one of: "Service", "Industry", "Product",
                       "Blog", "Case Study", "Company", "Insights",
                       "Legal", "Page"
        description - 1-2 sentence summary (reuse the page's meta
                       description if you have one)
        heading     - the page's main H1/H2 text, for extra matching
        keywords    - optional array of synonyms/acronyms people
                       might search for (e.g. "RPA" for Automation)
   2. Save the file — no build step is required.
   ========================================================= */

window.KGS_SEARCH_INDEX = [

  /* ---------------- General / Company pages ---------------- */
  {
    title: 'Home',
    url: 'index.html',
    category: 'Page',
    description: 'Kotnani Global Solutions (KGS) delivers world-class BPO, technology, and professional services across Banking, Logistics, Healthcare, Energy, and more — powering enterprise growth globally.',
    heading: 'Building Smarter Operations with AI-Driven Business Models',
    keywords: ['Kotnani Global Solutions', 'KGS', 'BPO', 'home']
  },
  {
    title: 'About Us',
    url: 'about.html',
    category: 'Company',
    description: 'Learn about Kotnani Global Solutions — our mission, vision, and the values driving digital transformation and business excellence for enterprises worldwide.',
    heading: 'About KGS: The Team Behind the Teams That Win',
    keywords: ['mission', 'vision', 'company overview']
  },
  {
    title: 'Careers',
    url: 'careers.html',
    category: 'Company',
    description: 'Explore career opportunities at Kotnani Global Solutions. Join a team of passionate experts delivering innovation across BPO, technology, and consulting services.',
    heading: 'Where Good People Grow',
    keywords: ['jobs', 'hiring', 'join us', 'openings']
  },
  {
    title: 'Certifications & Awards',
    url: 'certifications.html',
    category: 'Company',
    description: 'View the certifications, accreditations, and awards earned by Kotnani Global Solutions, reflecting our commitment to quality, security, and service excellence.',
    heading: 'Quality You Can Audit',
    keywords: ['ISO', 'awards', 'accreditation', 'recognition']
  },
  {
    title: 'Contact Us',
    url: 'contact.html',
    category: 'Company',
    description: 'Get in touch with Kotnani Global Solutions. Book a consultation or speak to an expert about your business process outsourcing and technology transformation needs.',
    heading: 'We’re here to help you',
    keywords: ['get in touch', 'support', 'consultation', 'enquiry']
  },
  {
    title: 'Corporate Social Responsibility',
    url: 'corporate-social-responsibility.html',
    category: 'Company',
    description: 'Learn about Kotnani Global Solutions’ Corporate Social Responsibility and ESG initiatives — our commitment to people, communities, and sustainable business practices.',
    heading: 'We Support the Communities Around Us',
    keywords: ['CSR', 'ESG', 'sustainability', 'community']
  },
  {
    title: 'Customers',
    url: 'customers.html',
    category: 'Company',
    description: 'Trusted by leading enterprises worldwide. Explore the clients and partners who rely on Kotnani Global Solutions for BPO, technology, and operational excellence.',
    heading: 'Relationships, Not Transactions',
    keywords: ['clients', 'partners']
  },
  {
    title: 'Locations',
    url: 'locations.html',
    category: 'Company',
    description: 'Find Kotnani Global Solutions offices and delivery centres across India and the US — strategically located to serve global clients with local expertise.',
    heading: 'Always On, Across Every Time Zone',
    keywords: ['offices', 'delivery centers', 'India', 'US', 'address']
  },
  {
    title: 'Management Team',
    url: 'management-team.html',
    category: 'Company',
    description: 'Meet the leadership team at Kotnani Global Solutions — experienced professionals guiding strategy, innovation, and client success across global markets.',
    heading: 'The People Behind the Work',
    keywords: ['leadership', 'executives', 'founders']
  },
  {
    title: 'News & Events',
    url: 'news-and-events.html',
    category: 'Company',
    description: 'Stay updated with the latest news, press releases, and events from Kotnani Global Solutions — milestones, partnerships, and industry participation.',
    heading: 'The Latest News and Events From KGS',
    keywords: ['press', 'media', 'announcements']
  },
  {
    title: 'Our Work Culture',
    url: 'our-work-culture.html',
    category: 'Company',
    description: 'Discover the work culture at KGS — a people-first environment built on integrity, collaboration, continuous learning, and delivering measurable impact.',
    heading: 'A Better Way to Work',
    keywords: ['culture', 'values', 'people first']
  },
  {
    title: 'Sitemap',
    url: 'sitemap.html',
    category: 'Page',
    description: 'Browse the complete sitemap of Kotnani Global Solutions — all pages including services, industries, insights, and company information in one place.',
    heading: 'All Pages',
    keywords: ['site map', 'all pages']
  },
  {
    title: 'Testimonials',
    url: 'testimonials.html',
    category: 'Company',
    description: 'Read what our clients say about Kotnani Global Solutions — testimonials and reviews reflecting the impact of our BPO and technology services.',
    heading: 'Real Words From Real Clients',
    keywords: ['reviews', 'client feedback']
  },
  {
    title: 'Blog',
    url: 'insights.html',
    category: 'Insights',
    description: 'Read the latest insights, articles, and thought leadership from Kotnani Global Solutions on BPO, AI, data, automation, and industry trends.',
    heading: 'Blog',
    keywords: ['articles', 'insights', 'thought leadership']
  },
  {
    title: 'Case Studies',
    url: 'case-studies.html',
    category: 'Insights',
    description: 'Explore KGS case studies — real-world results and success stories across Banking, Logistics, Healthcare, Manufacturing, and other industries.',
    heading: 'Case Studies: Real Problems, Real Outcomes',
    keywords: ['success stories', 'results']
  },
  {
    title: 'Privacy Policy',
    url: 'privacy-policy.html',
    category: 'Legal',
    description: 'Read the Kotnani Global Solutions Privacy Policy to understand how we collect, use, and protect your personal information in compliance with applicable laws.',
    heading: 'Privacy Policy',
    keywords: ['data protection', 'legal']
  },
  {
    title: 'Terms & Conditions',
    url: 'terms-and-conditions.html',
    category: 'Legal',
    description: 'Review the Terms and Conditions governing use of the Kotnani Global Solutions website and engagement with our services.',
    heading: 'Terms & Conditions',
    keywords: ['legal', 'terms of use']
  },

  /* ---------------- Blog posts ---------------- */
  {
    title: 'Optimizing Global Freight Operations with Automation',
    url: 'insights/logistics-bpo/global-freight-operations.html',
    category: 'Blog',
    description: 'Kotnani Global Solutions delivers expert BPO and technology services to help enterprises achieve operational excellence and growth.',
    heading: 'Optimizing Global Freight Operations with Automation',
    keywords: ['freight', 'logistics', 'automation', 'supply chain']
  },

  /* ---------------- Case studies ---------------- */
  {
    title: 'Case Study: Optimizing Global Freight Operations with Automation',
    url: 'case-studies/logistics-bpo/global-freight-operations.html',
    category: 'Case Study',
    description: 'Logistics Industry — Optimizing Global Freight Operations with Automation. See how KGS delivered measurable operational impact.',
    heading: 'Optimizing Global Freight Operations With Automation',
    keywords: ['logistics', 'freight', 'automation', 'case study']
  },

  /* ---------------- Services ---------------- */
  {
    title: 'Gen AI Services',
    url: 'services/generative-ai.html',
    category: 'Service',
    description: 'Transform your business with AI-driven business services, software engineering, data, automation, cybersecurity, and enterprise solutions from KGS.',
    heading: 'Custom Generative AI Solutions for Enterprises',
    keywords: ['AI', 'artificial intelligence', 'machine learning', 'GenAI', 'LLM']
  },
  {
    title: 'Data Management',
    url: 'services/data-management.html',
    category: 'Service',
    description: 'Improve data quality, governance and business intelligence with enterprise data management services including MDM, data integration, migration and governance.',
    heading: 'Enterprise Data Management Services for Dependable Data',
    keywords: ['MDM', 'master data management', 'data governance', 'data quality']
  },
  {
    title: 'Logistics',
    url: 'services/logistics-bpo.html',
    category: 'Service',
    description: 'Optimize logistics operations with supply chain management, freight management, warehouse support and logistics consulting services for global enterprises.',
    heading: 'Logistics and Supply Chain Management Services That Keep Freight Moving',
    keywords: ['supply chain', 'freight', 'warehouse']
  },
  {
    title: 'Data Science & BI Services',
    url: 'services/data-science-business-intelligence.html',
    category: 'Service',
    description: 'Unlock actionable insights with business intelligence, predictive analytics, Power BI, data science consulting and enterprise analytics solutions.',
    heading: 'Business Intelligence and Data Science Services That Guide Decisions',
    keywords: ['BI', 'business intelligence', 'analytics', 'Power BI', 'predictive analytics']
  },
  {
    title: 'Legal Process Outsourcing (LPO)',
    url: 'services/legal-process-outsourcing.html',
    category: 'Service',
    description: 'Streamline legal operations with LPO services including legal research, contract management, document review, litigation support and compliance solutions.',
    heading: 'Legal Process Outsourcing (LPO) Services That Return Billable Hours',
    keywords: ['LPO', 'legal', 'contract management', 'litigation support']
  },
  {
    title: 'Cybersecurity',
    url: 'services/cybersecurity.html',
    category: 'Service',
    description: 'Protect your enterprise with cybersecurity consulting, managed security services, SOC monitoring, VAPT, cloud security and compliance solutions.',
    heading: 'Cybersecurity and Managed Security Services That Protect Enterprises Data',
    keywords: ['security', 'SOC', 'VAPT', 'managed security', 'infosec']
  },
  {
    title: 'Software Development',
    url: 'services/software-development.html',
    category: 'Service',
    description: 'Accelerate digital transformation with custom software development, web and mobile applications, SaaS solutions and enterprise software tailored to your business needs.',
    heading: 'Custom Software Development Services Delivered on Schedule',
    keywords: ['web development', 'mobile apps', 'SaaS', 'engineering']
  },
  {
    title: 'ESG Consulting',
    url: 'services/esg-consulting.html',
    category: 'Service',
    description: 'Drive sustainable growth with ESG consulting, ESG reporting, compliance, sustainability strategy, ESG data management and reporting solutions.',
    heading: 'ESG Consulting and Sustainability Reporting Services',
    keywords: ['ESG', 'sustainability', 'compliance reporting']
  },
  {
    title: 'Automation',
    url: 'services/business-process-automation.html',
    category: 'Service',
    description: 'Improve productivity with business process automation, intelligent automation, RPA services, workflow automation and enterprise automation consulting.',
    heading: 'Business Process Automation and RPA Services That Give Time Back',
    keywords: ['RPA', 'robotic process automation', 'workflow automation', 'intelligent automation']
  },
  {
    title: 'Finance & Accounting',
    url: 'services/finance-accounting.html',
    category: 'Service',
    description: 'Reduce operational costs with finance and accounting services including bookkeeping, AP/AR management, payroll processing and financial reporting.',
    heading: 'Finance and Accounting Services That Close Faster',
    keywords: ['F&A', 'bookkeeping', 'AP/AR', 'payroll', 'financial reporting']
  },
  {
    title: 'Data Engineering',
    url: 'services/data-engineering.html',
    category: 'Service',
    description: 'Build modern data platforms with cloud data engineering, ETL pipelines, data warehousing, big data engineering and enterprise data architecture services.',
    heading: 'Data Engineering Services That Make Enterprise Data Usable',
    keywords: ['ETL', 'data pipelines', 'cloud data', 'big data', 'data warehousing']
  },
  {
    title: 'Healthcare Services',
    url: 'services/healthcare-bpo.html',
    category: 'Service',
    description: 'Enhance healthcare operations with healthcare outsourcing, medical data management, healthcare BPO, support services and digital healthcare solutions.',
    heading: 'Healthcare Services That Protect Revenue and Time',
    keywords: ['RCM', 'revenue cycle', 'medical billing', 'healthcare BPO']
  },
  {
    title: 'Insurance Services',
    url: 'services/insurance-bpo.html',
    category: 'Service',
    description: 'Streamline insurance operations with insurance BPO, claims processing, policy administration, back-office support and digital transformation services.',
    heading: 'Insurance Services That Speed Claims and Policies',
    keywords: ['claims processing', 'policy administration', 'insurance BPO']
  },
  {
    title: 'Custom Brokerage Services',
    url: 'services/customs-brokerage.html',
    category: 'Service',
    description: 'Simplify global trade with customs brokerage, customs clearance, trade compliance, documentation and import-export consulting services.',
    heading: 'Custom Brokerage Services That Clear Customs Cleanly',
    keywords: ['customs', 'brokerage', 'trade compliance', 'import export']
  },

  /* ---------------- Industries ---------------- */
  {
    title: 'Banking & Finance',
    url: 'industries/banking-finance.html',
    category: 'Industry',
    description: 'Empower banks and financial institutions with banking BPO, digital banking, automation, compliance, customer operations and managed services.',
    heading: 'Banking and Finance Operations Managed With Precision',
    keywords: ['fintech', 'financial services', 'compliance']
  },
  {
    title: 'Custom Brokerage',
    url: 'industries/customs-brokerage.html',
    category: 'Industry',
    description: 'Deliver faster customs clearance with brokerage services, trade compliance, customs documentation and logistics support for global businesses.',
    heading: 'End-to-End Customs Clearance Support',
    keywords: ['customs', 'trade compliance']
  },
  {
    title: 'Energy & Utilities',
    url: 'industries/energy-utilities.html',
    category: 'Industry',
    description: 'Transform utility operations with energy consulting, smart utility solutions, data management, analytics and digital transformation services.',
    heading: 'Services We Offer for the Energy and Utilities Industry',
    keywords: ['utilities', 'energy consulting', 'smart utility']
  },
  {
    title: 'Logistics',
    url: 'industries/logistics.html',
    category: 'Industry',
    description: 'Optimize logistics and supply chain operations with automation, analytics, outsourcing, warehouse management and freight solutions.',
    heading: 'Freight, Customs and Track-and-Trace Support for Logistics Industry',
    keywords: ['supply chain', 'freight', 'warehouse management']
  },
  {
    title: 'Mortgage',
    url: 'industries/mortgage.html',
    category: 'Industry',
    description: 'Streamline mortgage operations with mortgage processing, loan servicing, underwriting support, back-office services and mortgage BPO solutions.',
    heading: 'Mortgage Processing and Servicing Support',
    keywords: ['loan servicing', 'underwriting', 'mortgage BPO']
  },
  {
    title: 'Manufacturing',
    url: 'industries/manufacturing.html',
    category: 'Industry',
    description: 'Improve manufacturing performance with Industry 4.0, automation, smart factory solutions, AI, analytics and digital transformation services.',
    heading: 'Services We Offer for Manufacturing Industry',
    keywords: ['Industry 4.0', 'smart factory', 'production']
  },
  {
    title: 'E-commerce',
    url: 'industries/ecommerce.html',
    category: 'Industry',
    description: 'Scale your online business with eCommerce outsourcing, automation, fulfillment, omnichannel commerce and digital transformation solutions.',
    heading: 'Catalog, Support, and Order Operations for E-Commerce',
    keywords: ['online retail', 'omnichannel', 'fulfillment']
  },
  {
    title: 'Real Estate',
    url: 'industries/real-estate.html',
    category: 'Industry',
    description: 'Enhance real estate operations with property management outsourcing, PropTech, data management, back-office support and consulting services.',
    heading: 'Smoother Real Estate Operations, Quicker Closings',
    keywords: ['proptech', 'property management']
  },
  {
    title: 'Insurance',
    url: 'industries/insurance.html',
    category: 'Industry',
    description: 'Modernize insurance operations with claims processing, policy administration, insurance BPO, automation and digital transformation solutions.',
    heading: 'Support for Insurers, From Claim to Close',
    keywords: ['claims processing', 'policy administration']
  },
  {
    title: 'Retail',
    url: 'industries/retail.html',
    category: 'Industry',
    description: 'Empower retailers with omnichannel solutions, retail automation, analytics, AI, outsourcing and digital transformation services.',
    heading: 'Retail Catalog, Support and Finance Operations',
    keywords: ['omnichannel', 'retail automation']
  },
  {
    title: 'Telecommunications',
    url: 'industries/telecommunications.html',
    category: 'Industry',
    description: 'KGS Telecommunications solutions support billing operations, customer service, network data management, and compliance for telecom providers.',
    heading: 'Millions of Connections. Zero Room for Downtime.',
    keywords: ['telecom', 'billing operations', 'network data']
  },
  {
    title: 'Information Technology',
    url: 'industries/information-technology.html',
    category: 'Industry',
    description: 'KGS IT industry services deliver reliable software development, data management, cybersecurity, and automation solutions for technology enterprises.',
    heading: 'You Build the Product. We’ll Run Everything Else.',
    keywords: ['IT', 'technology', 'software']
  },

  /* ---------------- Products ----------------
     No dedicated pages exist yet — link to the homepage's
     "Our Expertise" > Products tab. Update `url` once each
     product gets its own page. */
  {
    title: 'MapMyClasses',
    url: 'index.html',
    category: 'Product',
    description: 'Smart class scheduling & management platform from KGS.',
    heading: 'MapMyClasses',
    keywords: ['product', 'class scheduling']
  },
  {
    title: 'MapLibrarySuite',
    url: 'index.html',
    category: 'Product',
    description: 'Digital library management system from KGS.',
    heading: 'MapLibrarySuite',
    keywords: ['product', 'library management']
  },
  {
    title: 'Threedify',
    url: 'index.html',
    category: 'Product',
    description: '3D product visualisation platform from KGS.',
    heading: 'Threedify',
    keywords: ['product', '3D visualisation']
  },
  {
    title: 'PublishGridIQ',
    url: 'index.html',
    category: 'Product',
    description: 'End-to-end publishing workflow platform from KGS.',
    heading: 'PublishGridIQ',
    keywords: ['product', 'publishing workflow']
  }

];
