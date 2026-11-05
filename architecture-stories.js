/* Story facts: resume.pdf, pages 1–2. Diagrams simplify the documented work. */
window.OCHI_ARCHITECTURE_STORIES = [
  {
    id: 'loan-scoring',
    name: 'Loan scoring',
    title: 'A shorter path to a loan decision.',
    project: 'Khan Bank / Lending',
    steps: [
      {
        name: 'Situation',
        title: 'A loan approval took three days.',
        summary: 'Loan approval took three days. I led delivery of a behavioral loan-scoring platform to shorten that process.',
        nodes: [
          { label: 'Loan application', detail: 'The decision starts here' },
          { label: 'Loan approval', detail: 'Previously three days', kind: 'previous' }
        ],
        diagramDescription: 'Before the new behavioral loan-scoring platform, loan approval took three days.',
        note: 'The starting point: a three-day loan approval process.'
      },
      {
        name: 'Challenge',
        title: 'Connect the data to a faster decision.',
        summary: 'I led the platform end to end, bringing Oracle data into distributed processing for behavioral loan scoring.',
        nodes: [
          { label: 'Oracle data', detail: 'Build the data pipelines', kind: 'highlight' },
          { label: 'Distributed processing', detail: 'Use Spark and Hadoop', kind: 'highlight' },
          { label: 'Loan scoring', detail: 'Deliver the platform end to end', kind: 'highlight' }
        ],
        layout: 'constraints',
        diagramDescription: 'Three delivery goals: build Oracle data pipelines, use distributed processing, and deliver behavioral loan scoring.',
        note: 'The work spanned the data pipeline and the scoring platform.'
      },
      {
        name: 'Approach',
        title: 'Build the scoring data pipeline.',
        summary: 'I built PySpark pipelines from Oracle into Spark and Hadoop as part of delivering the behavioral loan-scoring platform.',
        nodes: [
          { label: 'Oracle', detail: 'Source data' },
          { label: 'PySpark pipelines', detail: 'Data processing', kind: 'highlight' },
          { label: 'Spark / Hadoop', detail: 'Distributed platform' },
          { label: 'Behavioral scoring', detail: 'Loan-scoring platform' }
        ],
        diagramDescription: 'Oracle data enters PySpark pipelines and the Spark and Hadoop platform supporting behavioral loan scoring.',
        note: 'From source data to behavioral loan scoring.'
      },
      {
        name: 'Result',
        title: 'From three days to three hours.',
        summary: 'Loan approval time fell from three days to three hours. The platform was nominated among the bank’s projects of the year.',
        nodes: [
          { label: 'Before', detail: 'Three days', kind: 'previous' },
          { label: 'After', detail: 'Three hours', kind: 'highlight' }
        ],
        diagramDescription: 'Loan approval time changed from three days before the platform to three hours after it.',
        fact: { label: 'Loan approval time', value: '3 days → 3 hours' }
      }
    ]
  },
  {
    id: 'order-history',
    name: 'Order history',
    title: 'Let order history work asynchronously.',
    project: 'Thermo Fisher Scientific / Order history',
    steps: [
      {
        name: 'Situation',
        title: 'Order history ran synchronously.',
        summary: 'The order-history service used synchronous processing. I worked on refactoring it within the e-commerce platform.',
        nodes: [
          { label: 'Order-history service', detail: 'Synchronous processing', kind: 'previous' }
        ],
        diagramDescription: 'The earlier order-history service processed work synchronously.',
        note: 'The starting point: synchronous order-history processing.'
      },
      {
        name: 'Challenge',
        title: 'Change how the work gets processed.',
        summary: 'I moved order-history work to asynchronous processing and improved the time it took for the API to respond.',
        nodes: [
          { label: 'Asynchronous work', detail: 'Move away from synchronous processing', kind: 'highlight' },
          { label: 'API response time', detail: 'Improve response speed', kind: 'highlight' }
        ],
        layout: 'constraints',
        diagramDescription: 'The refactor focused on asynchronous processing and faster API responses.',
        note: 'A processing change with a measurable API result.'
      },
      {
        name: 'Approach',
        title: 'Move processing onto Kafka topics.',
        summary: 'I converted order-history processing from synchronous to asynchronous using Kafka topics.',
        nodes: [
          { label: 'Order-history service', detail: 'The refactored service' },
          { label: 'Kafka topics', detail: 'Asynchronous messaging', kind: 'highlight' },
          { label: 'Async processing', detail: 'Order-history work' }
        ],
        diagramDescription: 'The order-history service uses Kafka topics for asynchronous order-history processing.',
        note: 'Kafka provided the asynchronous messaging layer.'
      },
      {
        name: 'Result',
        title: 'API response time cut in half.',
        summary: 'The synchronous-to-asynchronous order-history refactor reduced API response time by 50%.',
        nodes: [
          { label: 'Order-history API', detail: 'The measured service' },
          { label: 'Response time', detail: '50% lower', kind: 'highlight' }
        ],
        diagramDescription: 'The order-history API response time was reduced by 50% after the asynchronous refactor.',
        fact: { label: 'Order-history API response time', value: '50% lower' }
      }
    ]
  },
  {
    id: 'pipeline-setup',
    name: 'Pipeline setup',
    title: 'Catch mistakes before a data run.',
    project: 'Thermo Fisher Scientific / Data pipelines',
    steps: [
      {
        name: 'Situation',
        title: 'Setup errors before a data run.',
        summary: 'Pipeline setup errors occurred in roughly three to four out of ten runs. I worked on making initialization more reliable.',
        nodes: [
          { label: 'Pipeline setup', detail: 'Initialization before a run', kind: 'previous' },
          { label: 'Setup errors', detail: 'About 3–4 in 10 runs', kind: 'previous' }
        ],
        layout: 'components',
        diagramDescription: 'The initial setup-error rate was approximately three to four errors in ten pipeline runs.',
        note: 'A more reliable start for each pipeline run.'
      },
      {
        name: 'Challenge',
        title: 'Make the start of a run more reliable.',
        summary: 'The work addressed two needs: flag bad inputs before processing and reduce mistakes during initialization.',
        nodes: [
          { label: 'Input validation', detail: 'Flag bad inputs before a run', kind: 'highlight' },
          { label: 'Initialization', detail: 'Reduce setup mistakes', kind: 'highlight' }
        ],
        layout: 'constraints',
        diagramDescription: 'Two goals: detect bad inputs before processing and reduce initialization mistakes.',
        note: 'Address input quality and the setup experience.'
      },
      {
        name: 'Approach',
        title: 'Validate inputs. Guide initialization.',
        summary: 'I wrote a pre-run validation script to flag bad inputs and built an initialization interface to reduce setup errors.',
        nodes: [
          { label: 'Pre-run validation', detail: 'Flags bad inputs', kind: 'highlight' },
          { label: 'Initialization interface', detail: 'Supports pipeline setup', kind: 'highlight' },
          { label: 'Data pipeline', detail: 'The processing workload' }
        ],
        layout: 'components',
        diagramDescription: 'A pre-run validation script flags bad inputs, while an initialization interface supports pipeline setup.',
        note: 'Two improvements around the start of a pipeline run.'
      },
      {
        name: 'Result',
        title: 'Fewer errors at the starting line.',
        summary: 'The initialization interface reduced setup errors from roughly three to four in ten runs to roughly one in ten.',
        nodes: [
          { label: 'Before', detail: 'About 3–4 in 10 runs', kind: 'previous' },
          { label: 'After', detail: 'About 1 in 10 runs', kind: 'highlight' }
        ],
        diagramDescription: 'Setup errors decreased from approximately three to four in ten runs to approximately one in ten.',
        fact: { label: 'Setup errors per 10 runs, approximately', value: '3–4 → 1' }
      }
    ]
  },
  {
    id: 'data-platform',
    name: 'Data platform',
    title: 'A new foundation for bank analytics.',
    project: 'Khan Bank / Data platform',
    steps: [
      {
        name: 'Situation',
        title: 'Reporting needed a new foundation.',
        summary: 'The bank had legacy reporting and analytics systems. I worked on the distributed platform that replaced them.',
        nodes: [
          { label: 'Legacy reporting', detail: 'Existing systems', kind: 'previous' },
          { label: 'Legacy analytics', detail: 'Existing systems', kind: 'previous' }
        ],
        layout: 'components',
        diagramDescription: 'Legacy reporting and analytics systems were the starting point for the platform replacement.',
        note: 'The earlier reporting and analytics environment.'
      },
      {
        name: 'Challenge',
        title: 'Replace the platform, reduce the cost.',
        summary: 'I designed the bank’s first distributed, multi-layer data platform to replace legacy reporting and analytics.',
        nodes: [
          { label: 'Platform replacement', detail: 'Reporting and analytics', kind: 'highlight' },
          { label: 'Distributed design', detail: 'A multi-layer data platform', kind: 'highlight' },
          { label: 'Licensing cost', detail: 'Reduce the licensing footprint', kind: 'highlight' }
        ],
        layout: 'constraints',
        diagramDescription: 'The platform work combined a legacy replacement, distributed design, and lower licensing costs.',
        note: 'The first platform of its kind at the bank.'
      },
      {
        name: 'Approach',
        title: 'Build with Cassandra, Spark and Hadoop.',
        summary: 'I designed and implemented a distributed, multi-layer platform using Cassandra, Spark and Hadoop.',
        nodes: [
          { label: 'Cassandra', detail: 'Platform component', kind: 'highlight' },
          { label: 'Spark', detail: 'Platform component', kind: 'highlight' },
          { label: 'Hadoop', detail: 'Platform component', kind: 'highlight' }
        ],
        layout: 'components',
        diagramDescription: 'Cassandra, Spark, and Hadoop are documented components of the distributed data platform, shown without a deployment topology.',
        note: 'Three components of the bank’s new distributed data platform.'
      },
      {
        name: 'Result',
        title: 'A distributed platform at lower cost.',
        summary: 'The new platform replaced legacy reporting and analytics and reduced licensing costs by approximately 50%.',
        nodes: [
          { label: 'Distributed platform', detail: 'Replaced legacy reporting and analytics', kind: 'highlight' },
          { label: 'Licensing costs', detail: 'Approximately 50% lower', kind: 'highlight' }
        ],
        layout: 'components',
        diagramDescription: 'The replacement distributed platform reduced licensing costs by approximately 50%.',
        fact: { label: 'Licensing costs', value: 'Approximately 50% lower' }
      }
    ]
  },
  {
    id: 'ai-verification',
    name: 'AI verification',
    title: 'Make engineering tasks verifiable.',
    project: 'Stellar AI / Engineering tasks',
    steps: [
      {
        name: 'Situation',
        title: 'Start with real engineering changes.',
        summary: 'My work used pull requests from open-source Java and Python projects, including Checkstyle and Black.',
        nodes: [
          { label: 'Checkstyle', detail: 'Java project' },
          { label: 'Black', detail: 'Python project' },
          { label: 'Pull requests', detail: 'Real engineering changes' }
        ],
        layout: 'components',
        diagramDescription: 'Open-source pull requests from projects including Java-based Checkstyle and Python-based Black supplied engineering task material.',
        note: 'Real project changes formed the starting material.'
      },
      {
        name: 'Challenge',
        title: 'Define what a correct solution means.',
        summary: 'I needed to turn code changes into structured engineering tasks with evaluation criteria that could be checked objectively.',
        nodes: [
          { label: 'Structured task', detail: 'Define the engineering work', kind: 'highlight' },
          { label: 'Evaluation criteria', detail: 'Define objective pass/fail conditions', kind: 'highlight' }
        ],
        layout: 'constraints',
        diagramDescription: 'The work required structured engineering tasks and objective pass/fail evaluation criteria.',
        note: 'Task definition and verification had to work together.'
      },
      {
        name: 'Approach',
        title: 'Pair each task with automated checks.',
        summary: 'I reviewed pull requests, converted them into structured tasks, and authored automated verifiers and evaluation criteria.',
        nodes: [
          { label: 'Project pull request', detail: 'Review the code change' },
          { label: 'Structured task', detail: 'Define the engineering problem', kind: 'highlight' },
          { label: 'Automated verifier', detail: 'Check the solution', kind: 'highlight' }
        ],
        diagramDescription: 'Project pull requests are reviewed and converted into structured engineering tasks with automated verifiers.',
        note: 'Verification is part of the task design.'
      },
      {
        name: 'Result',
        title: 'A result that can be checked.',
        summary: 'The tasks have automated verifiers and objective evaluation criteria, giving each solution explicit pass/fail conditions.',
        nodes: [
          { label: 'Task solution', detail: 'The work being evaluated' },
          { label: 'Automated verifier', detail: 'Apply evaluation criteria' },
          { label: 'Pass / fail', detail: 'Objective conditions', kind: 'highlight' }
        ],
        diagramDescription: 'Automated verifiers evaluate task solutions using objective pass/fail conditions.',
        note: 'Objective pass/fail checks'
      }
    ]
  }
];
