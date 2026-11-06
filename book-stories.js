/* Existing case studies supply documented outcomes. Hobby project details also use their implementation sources.
   The owner supplied the notification topology, data-retention setback, and book categorization. */
window.OCHI_BOOKS = [
  {
    id: 'career',
    title: 'Professional career',
    subtitle: 'Systems, decisions, and lessons from the work.',
    intro: 'I care about the decisions behind a system: understanding the problem, making trade-offs, automating repeatable work, learning quickly, and carrying the work through to a testable result.',
    theme: 'blue',
    strengths: [
      { title: 'System design', text: 'I make responsibilities and constraints clear, then connect the architecture to the outcome it needs to support.', chapterId: 'notifications' },
      { title: 'Problem solving', text: 'I follow a problem across services and data, then change the part that holds the work back.', chapterId: 'order-history' },
      { title: 'Trade-offs & tools', text: 'I weigh a tool’s role, the constraints around it, and cost as part of the design decision.', chapterId: 'data-platform' },
      { title: 'Automation', text: 'I turn repeatable checks into scripts, interfaces, and verifiers so mistakes can be caught earlier.', chapterId: 'pipeline-setup' },
      { title: 'Learning quickly', text: 'I follow new evidence across layers, ask focused questions, and update my understanding with the people who rely on the system.', chapterId: 'data-retention' },
      { title: 'Ownership', text: 'I connect the data, implementation, and validation, and carry the work through to its result.', chapterId: 'loan-scoring' }
    ],
    chapters: [
      {
        id: 'notifications',
        title: 'A monolith, untangled.',
        context: 'Khan Bank / Notifications',
        kind: 'success',
        summary: 'From a monolith to an event-driven notification system with category topics, channel services, and recorded delivery outcomes.',
        skills: ['System design', 'Service boundaries', 'Problem solving'],
        sections: [
          { heading: 'Situation', paragraphs: ['The earlier notification setup used RabbitMQ, a .NET monolith, and a database server shared with other systems. Scaling the application, maintaining it, and sharing infrastructure were all constraints.'] },
          { heading: 'Decisions', paragraphs: ['The migration used Java and Spring Boot, Kafka, and Cassandra. The core transaction microservice produces records into a Kafka notification topic. Notification processing microservices consume that topic and publish to category topics.', 'Each channel-specific service consumes its own topic with priority, sends notifications, and records whether delivery succeeded or failed in Cassandra.'] },
          { heading: 'Outcome', paragraphs: ['Guaranteed SLA downtime changed from roughly 2,000 to 20 minutes per year. The work was recognized by the Head of IT.'] },
          { heading: 'Lesson', paragraphs: ['A scaling discussion needs to include service responsibilities and the infrastructure around them. This design separates transaction events, notification processing, and channel delivery, while keeping the delivery result visible in Cassandra.'] }
        ],
        outcome: { label: 'Guaranteed SLA downtime per year', value: '2,000 → 20 minutes' },
        architectureStory: 'notifications'
      },
      {
        id: 'loan-scoring',
        title: 'A shorter path to a loan decision.',
        context: 'Khan Bank / Behavioral loan scoring',
        kind: 'success',
        summary: 'Owning the path from Oracle data to a behavioral loan-scoring platform, with a measurable change in approval time.',
        skills: ['Ownership', 'Data engineering', 'Problem solving'],
        sections: [
          { heading: 'Situation', paragraphs: ['Loan approval took three days. The bank needed a behavioral loan-scoring platform supported by a data pipeline.'] },
          { heading: 'Decisions', paragraphs: ['I led delivery of the platform end to end, building PySpark pipelines from Oracle into Spark and Hadoop as part of the scoring platform.'] },
          { heading: 'Outcome', paragraphs: ['Approval time fell from three days to three hours. The platform was nominated among the bank’s projects of the year.'] },
          { heading: 'Lesson', paragraphs: ['Owning a result means following the whole path: where data starts, how it is processed, and the decision it supports.'] }
        ],
        outcome: { label: 'Loan approval time', value: '3 days → 3 hours' },
        architectureStory: 'loan-scoring'
      },
      {
        id: 'order-history',
        title: 'Let order history work asynchronously.',
        context: 'Thermo Fisher Scientific / Order history',
        kind: 'success',
        summary: 'Changing the processing model of an order-history service to improve API response time.',
        skills: ['Problem solving', 'Asynchronous processing', 'Kafka'],
        sections: [
          { heading: 'Situation', paragraphs: ['The order-history service in the e-commerce platform processed work synchronously. Its processing model was the focus of the refactor.'] },
          { heading: 'Decisions', paragraphs: ['I converted order-history processing to asynchronous work using Kafka topics.'] },
          { heading: 'Outcome', paragraphs: ['The asynchronous refactor reduced the order-history API’s response time by 50%.'] },
          { heading: 'Lesson', paragraphs: ['A processing change should be judged against the result it is intended to improve. Here, the useful measure was the time taken for the API to respond.'] }
        ],
        outcome: { label: 'Order-history API response time', value: '50% lower' },
        architectureStory: 'order-history'
      },
      {
        id: 'pipeline-setup',
        title: 'Catch mistakes before a data run.',
        context: 'Thermo Fisher Scientific / Data pipelines',
        kind: 'learning',
        summary: 'Pre-run validation and a better initialization interface made pipeline setup more reliable.',
        skills: ['Automation', 'Reliability', 'Critical thinking'],
        sections: [
          { heading: 'Situation', paragraphs: ['Pipeline setup errors occurred in roughly three to four out of ten runs. Input quality and initialization both needed attention.'] },
          { heading: 'Decisions', paragraphs: ['I wrote a pre-run validation script to flag bad inputs and built an initialization interface to reduce setup mistakes.'] },
          { heading: 'Outcome', paragraphs: ['The initialization interface reduced setup errors to roughly one in ten runs.'] },
          { heading: 'Lesson', paragraphs: ['Reliability starts before processing begins. Validation and a clear setup experience can turn recurring mistakes into a problem the tooling helps prevent.'] }
        ],
        outcome: { label: 'Setup errors per 10 runs, approximately', value: '3–4 → 1' },
        architectureStory: 'pipeline-setup'
      },
      {
        id: 'data-platform',
        title: 'A new foundation for bank analytics.',
        context: 'Khan Bank / Distributed data platform',
        kind: 'learning',
        summary: 'Replacing legacy reporting and analytics with a distributed platform, while reducing licensing costs.',
        skills: ['System design', 'Tool judgment', 'Cost awareness'],
        sections: [
          { heading: 'Situation', paragraphs: ['The bank had legacy reporting and analytics systems. I worked on the distributed platform that replaced them.'] },
          { heading: 'Decisions', paragraphs: ['I designed and implemented the bank’s first distributed, multi-layer data platform using Cassandra, Spark, and Hadoop.'] },
          { heading: 'Outcome', paragraphs: ['The replacement platform reduced licensing costs by approximately 50%.'] },
          { heading: 'Lesson', paragraphs: ['Tool selection belongs in the same discussion as the workload and its costs. The platform’s licensing result is one concrete measure of that decision.'] }
        ],
        outcome: { label: 'Licensing costs', value: 'Approximately 50% lower' },
        architectureStory: 'data-platform'
      },
      {
        id: 'data-retention',
        title: 'When the bottleneck was in the data.',
        context: 'Production service / Data lifecycle',
        kind: 'setback',
        summary: 'A slowdown led me beyond the service code and back to a design omission: retention and backups.',
        skills: ['Ownership', 'System thinking', 'Critical thinking'],
        sections: [
          { heading: 'Situation', paragraphs: ['A service I had designed started to slow down. I investigated the service code and found no issue there, then checked the database and found a very large table.'] },
          { heading: 'Decisions', paragraphs: ['Asking why we kept so much data exposed a gap in my design: I had not defined a retention policy or backup strategy. I returned to stakeholders and surveyed their data needs.'] },
          { heading: 'Outcome', paragraphs: ['The investigation clarified the data lifecycle requirements. In that context, most systems did not need data older than roughly one week in the main table. Those needs informed the retention and backup strategy.'] },
          { heading: 'Lesson', paragraphs: ['That omission was mine to own. Retention, backups, and stakeholder requirements belong in the design from the start, and performance investigation needs to follow the data as well as the code.'] }
        ],
        outcome: { label: 'Design lesson', value: 'Make the data lifecycle explicit' }
      }
    ]
  },
  {
    id: 'hobbies',
    title: 'Hobby projects',
    subtitle: 'Built after hours, because I wanted them to exist.',
    intro: 'Personal finance, a community casebook, books, games, and a place on the internet that feels like me. These projects begin with curiosity and become something I can use, share, or play.',
    theme: 'orange',
    chapters: [
      {
        id: 'flowstate',
        title: 'FlowState: a plan for the month.',
        context: 'FlowState / Personal finance',
        kind: 'project',
        summary: 'A monthly view of income, expenses, and recurring bills, with a due-date roadmap and AI-generated financial insights.',
        skills: ['React / TypeScript', 'API integration', 'Gemini'],
        sections: [
          { heading: 'Situation', paragraphs: ['A monthly total does not show which expenses are due next or how income covers them. FlowState brings those details into one view.'] },
          { heading: 'Decisions', paragraphs: ['The interface groups income, expenses, and recurring expenses by month. A roadmap orders expenses by due date and shows how income covers upcoming obligations.', 'I built the interface with React and TypeScript, with Gemini-generated Financial Insight alongside the monthly summary.'] },
          { heading: 'Outcome', paragraphs: ['A personal finance project connecting the monthly summary with a view of upcoming expenses. The website opens with account sign-in.'] },
          { heading: 'Lesson', paragraphs: ['A monthly total is more useful when it is connected to the dates and commitments behind it.'] }
        ],
        url: 'https://flowstate-finance-91547830614.us-west1.run.app/',
        urlLabel: 'Visit FlowState (sign-in required) ↗'
      },
      {
        id: 'unveil',
        title: 'Unveil: look up a suspicious contact.',
        context: 'Unveil / A community casebook',
        kind: 'project',
        summary: 'A searchable community casebook for suspicious contacts, with reports, case details, and community voting.',
        skills: ['React / TypeScript', 'Java / Spring Boot', 'PostgreSQL'],
        sections: [
          { heading: 'Situation', paragraphs: ['When checking an unfamiliar contact, reports and community feedback need to be easy to find and review. Unveil organizes them into a searchable casebook.'] },
          { heading: 'Decisions', paragraphs: ['Readers can search by identifiers such as name, email, phone, or company, browse results, and open the details behind a case. The project also supports reporting and email-verified community voting.', 'The frontend uses React and TypeScript; the backend uses Java, Spring Boot, and PostgreSQL.'] },
          { heading: 'Outcome', paragraphs: ['Search, case reporting, and community voting implemented across a web interface and an API. The source shows how the casebook is built.'] },
          { heading: 'Lesson', paragraphs: ['A search result is more useful when readers can inspect the report behind it and see community feedback in context.'] }
        ],
        sourceUrl: 'https://github.com/ochirtulga/unveil-frontend'
      },
      {
        id: 'bookworm',
        title: 'One more chapter.',
        context: 'Bookworm / An independent iOS project',
        kind: 'project',
        summary: 'A personal reading habit became a companion for books, challenges, and achievements.',
        skills: ['Product thinking', 'React Native', 'Supabase'],
        sections: [
          { heading: 'Situation', paragraphs: ['I wanted one home for my books, reading goals, and the small victories that keep a habit going.'] },
          { heading: 'Decisions', paragraphs: ['Bookworm brings a personal library, reading challenges, and achievements together in an iOS app built with React Native, Expo, and Supabase.'] },
          { heading: 'Outcome', paragraphs: ['A reading companion built around a habit I care about. The walkthrough shows the local app using sample data.'] },
          { heading: 'Lesson', paragraphs: ['A personal project has a useful starting point: a problem close enough to understand and an experience worth returning to.'] }
        ],
        demo: true
      },
      {
        id: 'garden',
        title: 'A little room to explore.',
        context: 'The garden / This portfolio',
        kind: 'project',
        summary: 'A portfolio with books to open, seasonal stories to find, and a little room to play.',
        skills: ['Interaction design', 'Accessibility', 'Iteration'],
        sections: [
          { heading: 'Situation', paragraphs: ['I wanted a portfolio that showed my work and felt personal, with a clear way to move through it.'] },
          { heading: 'Decisions', paragraphs: ['The garden uses book-shaped stories, a tree that follows the calendar, interactive leaves, and seasonal weather. Direct section links, keyboard controls, and motion preferences support the experience.'] },
          { heading: 'Outcome', paragraphs: ['A place to explore the work alongside the reading, games, food, travel, and basketball that fill the rest of my life.'] },
          { heading: 'Lesson', paragraphs: ['Playful details work best with clear navigation, readable content, and control over motion.'] }
        ],
        linkedSection: 'home'
      },
      {
        id: 'leaf-keeper',
        title: 'A small game with a shared scoreboard.',
        context: 'Leaf keeper / A portfolio mini-game',
        kind: 'project',
        summary: 'An original game cartridge grew into a playable break with a public leaderboard.',
        skills: ['Game interaction', 'API design', 'Failure handling'],
        sections: [
          { heading: 'Situation', paragraphs: ['The portfolio needed a little room to play. Leaf keeper is an original 25-second game for catching falling leaves.'] },
          { heading: 'Decisions', paragraphs: ['Players can use an optional nickname. Ranked rounds use server-issued tokens and idempotent score saving, with a shared leaderboard holding each browser’s best result.'] },
          { heading: 'Outcome', paragraphs: ['The game is playable here, with a public top ten. If the shared service is unavailable, play continues as an unranked round.'] },
          { heading: 'Lesson', paragraphs: ['Even a small shared game needs clear states, validation, and a useful way to continue when a service is unavailable.'] }
        ],
        linkedSection: 'game'
      }
    ]
  },
  {
    id: 'independent',
    title: 'Freelance & temporary work',
    subtitle: 'Practical work. Real responsibilities.',
    intro: 'Focused work across coding-agent evaluation and business tools: testable PR implementation tasks and reviewed agent runs at Stellar AI, and the public website and internal tools for Express Window.',
    theme: 'sage',
    chapters: [
      {
        id: 'express-window',
        title: 'Made for real work.',
        context: 'Express Window / Erdenet, Mongolia',
        kind: 'project',
        summary: 'The public website and internal tools for a family window-and-door business, delivered end to end.',
        skills: ['Solutions architecture', 'Ownership', 'Full stack delivery'],
        sections: [
          { heading: 'Situation', paragraphs: ['The business needed an online presence and practical tools to manage orders and inventory.'] },
          { heading: 'Decisions', paragraphs: ['I built the public website alongside internal order and inventory management tools, using Next.js, React, Java, Spring Boot, and AWS.'] },
          { heading: 'Outcome', paragraphs: ['A live public website and internal tools for the company’s day-to-day work, delivered end to end.'] },
          { heading: 'Lesson', paragraphs: ['Owning a build means connecting the public experience with the operational work behind it. Both need to serve the business.'] }
        ],
        url: 'https://expresswindow.online'
      },
      {
        id: 'ai-verification',
        title: 'Put coding agents to the test.',
        context: 'Stellar AI / Coding-agent evaluation',
        kind: 'learning',
        summary: 'Turning real open-source pull requests into tested coding-agent tasks, then reviewing the work across ten agents.',
        skills: ['Codebase learning', 'Test design', 'Agent instructions', 'Evaluation & feedback'],
        sections: [
          { heading: 'Situation', paragraphs: ['The work started with real pull requests in open-source projects such as Checkstyle and Black. I first became familiar with the codebase and the PR so I understood the change an agent would need to implement.'] },
          { heading: 'Decisions', paragraphs: ['I created the tests a successful implementation needed to pass, then wrote instructions for agents to implement the same PR. Tests ran before and after their changes to validate whether the implementation was correct.', 'I also prepared hints explaining pitfalls and the approach to the solution, without giving direct answers. Agents that could not implement the PR without hints tried again with those hints.'] },
          { heading: 'Outcome', paragraphs: ['Ten coding agents attempted the PR implementation. After all runs, I checked every output and gave feedback on what agents missed in failed attempts and what they did well.'] },
          { heading: 'Lesson', paragraphs: ['Evaluating an agent takes more than a pass/fail result. It also takes a well-understood task, useful tests, guidance that supports reasoning, and a review of the decisions behind each attempt.'] }
        ],
        outcome: { label: 'Evaluation workflow', value: '10 agents, with every output reviewed' },
        architectureStory: 'ai-verification'
      }
    ]
  }
];
