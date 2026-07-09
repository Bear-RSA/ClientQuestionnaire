/* ============================================================
   DATA CONFIGURATION
=========================================================== */
const SERVICES = [
  {id:'website', icon:'<i data-lucide="layout"></i>', title:'Website Development', desc:'Marketing sites, portfolios & brochure builds.'},
  {id:'ecommerce', icon:'<i data-lucide="shopping-cart"></i>', title:'E-Commerce Store', desc:'Online stores with payments & inventory.'},
  {id:'mobile', icon:'<i data-lucide="smartphone"></i>', title:'Mobile App', desc:'iOS & Android product builds.'},
  {id:'webapp', icon:'<i data-lucide="app-window"></i>', title:'Web Application', desc:'Custom platforms & SaaS tools.'},
  {id:'internal', icon:'<i data-lucide="database"></i>', title:'Internal Business System', desc:'Tools that run your operations.'},
  {id:'ai_automation', icon:'<i data-lucide="bot"></i>', title:'AI Automation', desc:'Agents, workflows & intelligent tooling.'},
  {id:'branding', icon:'<i data-lucide="palette"></i>', title:'Branding & Design', desc:'Identity systems & visual language.'},
  {id:'enterprise', icon:'<i data-lucide="building-2"></i>', title:'Enterprise Solutions', desc:'Mission-critical, large-scale builds.', enterprise:true},
];

const baseQuestions = [
  {section:'Business Information', key:'businessName', type:'text', title:'What is the name of your organization?', help:'This context helps us tailor our initial discovery.', placeholder:'e.g. Solace Coffee Roasters', required:true},
  {section:'Business Information', key:'industry', type:'single', title:'Which industry best categorizes your operations?', options:['Retail & E-Commerce','Hospitality & Food','Professional Services','Healthcare','Real Estate','Technology','Education','Finance','Manufacturing','Other'], required:true},
];

const endQuestions = [
  {section:'Contact Details', key:'contactName', type:'text', title:'What is your name?', placeholder:'e.g. Jane Doe', required:true},
  {section:'Contact Details', key:'email', type:'text', title:'What is your email address?', help:'We will send your project brief here.', placeholder:'e.g. jane@company.com', required:true},
  {section:'Timeline', key:'timeline', type:'single', title:'What is your targeted go-live date?', options:['ASAP','Within 2 weeks','Within 1 month','Within 2 months','Flexible'], required:true},
  {section:'Budget', key:'budget', type:'single', title:'What is your allocated budget range?', options:['Under R10,000','R10,000 – R20,000','R20,000 – R50,000','R50,000 – R100,000','R100,000+'], required:true},
  {section:'Additional Requirements', key:'notes', type:'textarea', title:'Are there any unique constraints or requirements?', help:'Optional — share any references, compliance needs, or specific challenges.', placeholder:'Special requirements, reference URLs, technical constraints…'},
];

const QUESTION_BANKS = {
  website: [
    ...baseQuestions,
    {section:'Digital Presence', key:'hasWebsite', type:'single', title:'How is your brand currently represented online?', options:['We are establishing our first online presence','We have an outdated site that needs a full rebuild','We have a solid foundation but need a strategic upgrade'], required:true},
    {section:'Strategic Objective', key:'purpose', type:'single', title:'What is the primary business objective for this new website?', options:['Brand awareness','Generate leads','Sell products','Booking appointments','Portfolio','Informational','Membership','Community','Other'], required:true},
    {section:'Architecture', key:'pages', type:'multi', title:'Which core pages will your user journey require?', help:'Select all that apply.', options:['Home','About','Services','Products','Portfolio','Gallery','Testimonials','FAQ','Blog','Contact','Careers','Booking','Privacy Policy','Terms'], required:true},
    {section:'Aesthetics', key:'style', type:'multi', title:'Which visual directions best align with your brand identity?', help:'Select all that apply.', options:['Luxury','Corporate','Minimal','Creative','Modern','Bold','Dark','Light','Animated','Elegant','Professional'], required:true},
    {section:'Functionality', key:'features', type:'multi', title:'Which operational features are critical for your site?', help:'Select the technical integrations needed.', options:['Contact Forms','Newsletter','Live Chat','Bookings','Online Payments','Client Dashboard','Member Login','Multi-language','Blog / CMS','Admin Panel','Analytics & SEO','CRM Integration','WhatsApp Integration','AI Chatbot','API Integrations']},
    {section:'Asset Readiness', key:'content', type:'multi', title:'At what stage is your brand and copywriting collateral?', help:'Select what you already have ready.', options:['Logo','Images','Videos','Written copy','Product information','Pricing','Policies']},
    ...endQuestions
  ],
  ecommerce: [
    ...baseQuestions,
    {section:'Operational Stage', key:'hasStore', type:'single', title:'Are you currently operating an e-commerce storefront?', options:['Yes, on another platform','No, we only have a physical store','No, this is a new business'], required:true},
    {section:'Inventory Scale', key:'catalogSize', type:'single', title:'What is your anticipated SKU (product) volume at launch?', options:['1-10 (Curated)','11-50 (Small catalog)','51-200 (Medium catalog)','200+ (Large catalog)'], required:true},
    {section:'Infrastructure', key:'platform', type:'single', title:'Which ecosystem aligns best with your technical strategy?', options:['Shopify','WooCommerce','Custom build','Not sure, please advise'], required:true},
    {section:'Conversion Engine', key:'features', type:'multi', title:'Which specialized commerce features are critical for growth?', help:'Select all required capabilities.', options:['Subscriptions & Recurring','Multi-currency','Wholesale / B2B portal','Dropshipping integrations','Advanced Inventory Management','Abandoned Cart Recovery','Loyalty Program']},
    {section:'Financial Setup', key:'payments', type:'multi', title:'Which transactional payment models do you need to support?', options:['Credit Card (Stripe/PayFast)','PayPal','Manual EFT','Buy Now, Pay Later (PayJustNow etc)']},
    {section:'Aesthetics', key:'style', type:'multi', title:'Which visual directions best align with your retail brand?', help:'Pick as many as resonate.', options:['Clean & Minimal','Bold & Trendy','Luxury Boutique','Mass Market / Retail','Editorial']},
    {section:'Asset Readiness', key:'content', type:'multi', title:'What brand and product collateral do you have ready?', help:'Select all that apply.', options:['Product Photography','Product Descriptions','Logo & Branding','Lifestyle Images','Policies']},
    ...endQuestions
  ],
  mobile: [
    ...baseQuestions,
    {section:'Product Strategy', key:'appType', type:'single', title:'What best describes the nature of this application?', options:['A standalone digital product or SaaS','A mobile companion to an existing web platform','An internal tool for our workforce'], required:true},
    {section:'Platform Targets', key:'platforms', type:'multi', title:'Which ecosystems are you targeting for this release?', help:'Select your launch platforms.', options:['iOS (Apple App Store)','Android (Google Play Store)','Both iOS and Android (Cross-platform)','Tablet / iPad Optimized']},
    {section:'User Personas', key:'userRoles', type:'multi', title:'Which user types will interact with the application?', help:'Select all applicable roles.', options:['Public Consumers (B2C)','Business Clients (B2B)','Internal Employees / Admins','Service Providers / Partners']},
    {section:'Core Capabilities', key:'features', type:'multi', title:'Which device-specific capabilities are essential?', help:'Select required native features.', options:['Push Notifications','GPS & Geolocation','Camera & Photo Library Access','Biometric Authentication (FaceID/TouchID)','Offline Mode / Data Sync','Bluetooth / IoT Device Pairing','In-App Purchases / Subscriptions']},
    {section:'Infrastructure', key:'backendInfrastructure', type:'single', title:'How will the application\'s data and logic be managed?', options:['We need a custom backend and API built','We have an existing API to connect to','We prefer a BaaS (Firebase, Supabase)'], required:true},
    {section:'Monetization', key:'monetization', type:'single', title:'What is the primary monetization model?', options:['Free / Internal Use','Paid Download','Freemium with In-App Purchases','Recurring Subscription','E-Commerce Transactions within the app'], required:true},
    ...endQuestions
  ],
  webapp: [
    ...baseQuestions,
    {section:'Product Vision', key:'appPurpose', type:'single', title:'What core problem does this web application solve?', options:['Digitizing and automating manual business workflows','Providing a SaaS product to external customers','Creating a centralized dashboard for data reporting','Managing complex operational logistics'], required:true},
    {section:'Scale & Concurrency', key:'userVolume', type:'single', title:'What is the anticipated active user scale within the first year?', options:['Under 100 (Internal team only)','100–1,000 (Targeted B2B client base)','1,000–10,000 (Growing B2C/SaaS)','10,000+ (High volume scale)'], required:true},
    {section:'Access Control', key:'authentication', type:'multi', title:'What security and access models do you require?', help:'Select all access control features.', options:['Standard Email/Password Login','Social SSO (Google, GitHub, Apple)','Enterprise SSO (SAML, Okta)','Role-Based Access Control (RBAC)','Two-Factor Authentication (2FA)']},
    {section:'Technical Requirements', key:'features', type:'multi', title:'Which advanced functionalities are necessary for your users?', help:'Select the critical features.', options:['Real-time Data Updates (WebSockets)','Complex Data Grids & Exporting','Interactive Charts & Dashboards','Document Generation (PDFs, Reports)','In-App Messaging or Chat','File Uploads & Cloud Storage']},
    {section:'Data Architecture', key:'dataComplexity', type:'single', title:'How complex is the underlying data structure?', options:['Simple (Users and basic records)','Moderate (Multiple relational entities)','Complex (High volume, audit trails, analytics)'], required:true},
    {section:'Ecosystem', key:'integrations', type:'multi', title:'Which third-party systems must we connect to?', help:'Select all necessary integrations.', options:['Payment Gateways (Stripe, Braintree)','CRM Systems (Salesforce, HubSpot)','Marketing Automation (Mailchimp, ActiveCampaign)','Accounting (Xero, QuickBooks)','Custom Legacy APIs']},
    ...endQuestions
  ],
  ai_automation: [
    ...baseQuestions,
    {section:'Automation Objective', key:'aiGoal', type:'single', title:'Where can AI deliver the most transformative impact for your operations?', options:['Automating high-volume customer support queries','Streamlining complex internal data processing','Generating dynamic content or reporting insights','Analyzing historical data for predictive forecasting','Building a standalone, custom AI-powered product'], required:true},
    {section:'Operational Friction', key:'bottleneck', type:'textarea', title:'What specific operational bottleneck are you aiming to eliminate?', help:'Briefly describe the manual process or inefficiency.', placeholder:'e.g., Our team spends 20 hours a week manually extracting data from PDF invoices...'},
    {section:'Data Ecosystem', key:'integrations', type:'multi', title:'Which existing data sources or systems will feed the AI models?', help:'Select the systems we need to integrate with.', options:['CRM (HubSpot, Salesforce)','Internal Databases (SQL, etc)','Google Workspace / Office 365','Helpdesk (Zendesk, Intercom)','Slack / Teams','Custom APIs']},
    {section:'User Interface', key:'aiInterface', type:'multi', title:'How will your team or customers interact with the AI?', help:'Select all deployment methods.', options:['Chatbot on Website','Internal Slack/Teams Bot','Dashboard / Web App','Voice Assistant','Automated Background Process']},
    {section:'Performance Measurement', key:'successMetric', type:'single', title:'How will we measure the ROI of this implementation?', options:['Reducing manual labor hours','Increasing revenue or lead conversion','Improving customer satisfaction (CSAT)','Unlocking new capabilities we don’t have today'], required:true},
    ...endQuestions
  ],
  default: [
    ...baseQuestions,
    {section:'Project Scope', key:'projectScope', type:'textarea', title:'Can you describe your project in more detail?', help:'The more context you provide, the better we can architect a solution.', placeholder:'e.g. We need a custom web portal for our clients...'},
    {section:'Core Requirements', key:'features', type:'multi', title:'Are there specific technical capabilities you know you need?', help:'Select all that apply.', options:['Secure User Authentication','Complex Database Architecture','Third-Party API Integrations','Payment Processing / Billing','Custom Administrative Dashboards','CMS / Content Management','Advanced Analytics & Reporting']},
    ...endQuestions
  ]
};

const TIERS = {
  foundation:{ name:'Foundation', range:'0–60', timeline:'2–3 weeks', consult:'30-min discovery call',
    desc:'A focused, polished brochure site. Clean design, the pages you need, and a fast path to launch — without unnecessary complexity.' },
  growth:{ name:'Growth', range:'61–130', timeline:'4–6 weeks', consult:'45-min scoping session',
    desc:'Custom functionality with room to grow — CMS, bookings, SEO and the integrations that turn visitors into customers.' },
  innovation:{ name:'Innovation', range:'131–220', timeline:'8–12 weeks', consult:'60-min technical workshop',
    desc:'An advanced platform: dashboards, automation, and AI-assisted features built on infrastructure that scales with you.' },
  enterprise:{ name:'Enterprise', range:'221+', timeline:'Scoped individually', consult:'Enterprise architecture review',
    desc:'Mission-critical systems with complex integrations, compliance requirements, and dedicated delivery teams.' },
};
