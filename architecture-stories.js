/* Story facts: resume.pdf, pages 1–2; AI evaluation workflow supplied by the owner.
   Diagrams simplify the documented work. */
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
          { icon: 'document', label: 'Loan application', detail: 'The decision starts here' },
          { icon: 'check', label: 'Loan approval', detail: 'Previously three days', kind: 'previous' }
        ],
        diagramDescription: 'Before the new behavioral loan-scoring platform, loan approval took three days.',
        note: 'The starting point: a three-day loan approval process.'
      },
      {
        name: 'Challenge',
        title: 'Connect the data to a faster decision.',
        summary: 'I led the platform end to end, bringing Oracle data into distributed processing for behavioral loan scoring.',
        nodes: [
          { icon: 'database', label: 'Oracle data', detail: 'Build the data pipelines', kind: 'highlight' },
          { icon: 'cluster', label: 'Distributed processing', detail: 'Use Spark and Hadoop', kind: 'highlight' },
          { icon: 'service', label: 'Loan scoring', detail: 'Deliver the platform end to end', kind: 'highlight' }
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
          { icon: 'database', label: 'Oracle', detail: 'Source data' },
          { icon: 'pipeline', label: 'PySpark pipelines', detail: 'Data processing', kind: 'highlight' },
          { icon: 'cluster', label: 'Spark / Hadoop', detail: 'Distributed platform' },
          { icon: 'service', label: 'Behavioral scoring', detail: 'Loan-scoring platform' }
        ],
        diagramDescription: 'Oracle data enters PySpark pipelines and the Spark and Hadoop platform supporting behavioral loan scoring.',
        note: 'From source data to behavioral loan scoring.'
      },
      {
        name: 'Result',
        title: 'From three days to three hours.',
        summary: 'Loan approval time fell from three days to three hours. The platform was nominated among the bank’s projects of the year.',
        nodes: [
          { icon: 'speed', label: 'Before', detail: 'Three days', kind: 'previous' },
          { icon: 'speed', label: 'After', detail: 'Three hours', kind: 'highlight' }
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
          { icon: 'service', label: 'Order-history service', detail: 'Synchronous processing', kind: 'previous' }
        ],
        diagramDescription: 'The earlier order-history service processed work synchronously.',
        note: 'The starting point: synchronous order-history processing.'
      },
      {
        name: 'Challenge',
        title: 'Change how the work gets processed.',
        summary: 'I moved order-history work to asynchronous processing and improved the time it took for the API to respond.',
        nodes: [
          { icon: 'topic', label: 'Asynchronous work', detail: 'Move away from synchronous processing', kind: 'highlight' },
          { icon: 'speed', label: 'API response time', detail: 'Improve response speed', kind: 'highlight' }
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
          { icon: 'service', label: 'Order-history service', detail: 'The refactored service' },
          { icon: 'topic', label: 'Kafka topics', detail: 'Asynchronous messaging', kind: 'highlight' },
          { icon: 'service', label: 'Async processing', detail: 'Order-history work' }
        ],
        diagramDescription: 'The order-history service uses Kafka topics for asynchronous order-history processing.',
        note: 'Kafka provided the asynchronous messaging layer.'
      },
      {
        name: 'Result',
        title: 'API response time cut in half.',
        summary: 'The synchronous-to-asynchronous order-history refactor reduced API response time by 50%.',
        nodes: [
          { icon: 'service', label: 'Order-history API', detail: 'The measured service' },
          { icon: 'speed', label: 'Response time', detail: '50% lower', kind: 'highlight' }
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
          { icon: 'pipeline', label: 'Pipeline setup', detail: 'Initialization before a run', kind: 'previous' },
          { icon: 'warning', label: 'Setup errors', detail: 'About 3–4 in 10 runs', kind: 'previous' }
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
          { icon: 'check', label: 'Input validation', detail: 'Flag bad inputs before a run', kind: 'highlight' },
          { icon: 'service', label: 'Initialization', detail: 'Reduce setup mistakes', kind: 'highlight' }
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
          { icon: 'check', label: 'Pre-run validation', detail: 'Flags bad inputs', kind: 'highlight' },
          { icon: 'service', label: 'Initialization interface', detail: 'Supports pipeline setup', kind: 'highlight' },
          { icon: 'pipeline', label: 'Data pipeline', detail: 'The processing workload' }
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
          { icon: 'warning', label: 'Before', detail: 'About 3–4 in 10 runs', kind: 'previous' },
          { icon: 'check', label: 'After', detail: 'About 1 in 10 runs', kind: 'highlight' }
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
          { icon: 'document', label: 'Legacy reporting', detail: 'Existing systems', kind: 'previous' },
          { icon: 'service', label: 'Legacy analytics', detail: 'Existing systems', kind: 'previous' }
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
          { icon: 'cluster', label: 'Platform replacement', detail: 'Reporting and analytics', kind: 'highlight' },
          { icon: 'cluster', label: 'Distributed design', detail: 'A multi-layer data platform', kind: 'highlight' },
          { icon: 'cost', label: 'Licensing cost', detail: 'Reduce the licensing footprint', kind: 'highlight' }
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
          { icon: 'database', label: 'Cassandra', detail: 'Platform component', kind: 'highlight' },
          { icon: 'cluster', label: 'Spark', detail: 'Platform component', kind: 'highlight' },
          { icon: 'cluster', label: 'Hadoop', detail: 'Platform component', kind: 'highlight' }
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
          { icon: 'cluster', label: 'Distributed platform', detail: 'Replaced legacy reporting and analytics', kind: 'highlight' },
          { icon: 'cost', label: 'Licensing costs', detail: 'Approximately 50% lower', kind: 'highlight' }
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
    title: 'Put coding agents to the test.',
    project: 'Stellar AI / Coding-agent evaluation',
    steps: [
      {
        name: 'Study',
        title: 'Understand the change before the task.',
        summary: 'I first learned the open-source codebase and the pull request, including work in projects such as Checkstyle and Black.',
        nodes: [
          { icon: 'document', label: 'Codebase', detail: 'Learn the project' },
          { icon: 'document', label: 'Pull request', detail: 'Understand the intended change', kind: 'highlight' },
          { icon: 'check', label: 'Expected behavior', detail: 'Define a correct implementation' }
        ],
        diagramDescription: 'I learn the project codebase and pull request to understand what a correct implementation should do.',
        note: 'Task design starts with understanding the code and the change.'
      },
      {
        name: 'Tests',
        title: 'Make correct behavior testable.',
        summary: 'I created the tests a successful implementation needed to pass. Tests run before and after an agent’s changes to validate its implementation.',
        nodes: [
          { icon: 'check', label: 'Before tests', detail: 'Check the starting state' },
          { icon: 'service', label: 'Implementation', detail: 'The agent’s code change' },
          { icon: 'check', label: 'After tests', detail: 'Validate the implementation', kind: 'highlight' }
        ],
        diagramDescription: 'Tests are defined for successful PR implementation, then run before and after the agent changes the code.',
        note: 'The implementation has an explicit, testable target.'
      },
      {
        name: 'Brief',
        title: 'Turn the PR into an agent task.',
        summary: 'I wrote instructions for coding agents to implement the same pull request, paired with the tests that would validate their work.',
        nodes: [
          { icon: 'document', label: 'Agent instructions', detail: 'Explain the implementation task', kind: 'highlight' },
          { icon: 'document', label: 'Original PR', detail: 'The change to implement' },
          { icon: 'check', label: 'Validation tests', detail: 'Check the resulting behavior' }
        ],
        layout: 'components',
        diagramDescription: 'The task combines agent instructions, the change described by the original pull request, and validation tests.',
        note: 'Clear instructions and checks belong to the same task.'
      },
      {
        name: 'Hints',
        title: 'Guide the reasoning when an agent gets stuck.',
        summary: 'Agents unable to implement the PR without hints tried again with hints. I explained pitfalls and the solution approach without giving direct answers.',
        nodes: [
          { icon: 'service', label: 'First attempt', detail: 'Implement without hints' },
          { icon: 'warning', label: 'Unable to implement?', detail: 'Only then retry with hints' },
          { icon: 'document', label: 'Guided retry', detail: 'Pitfalls & approach, not answers', kind: 'highlight' }
        ],
        diagramDescription: 'An agent first attempts the task without hints. If it cannot implement the PR, it retries with hints explaining pitfalls and the approach rather than direct answers.',
        note: 'Hints support another attempt without supplying the implementation.'
      },
      {
        name: 'Runs',
        title: 'Evaluate the work across ten agents.',
        summary: 'Ten coding agents attempted the PR implementation. Before-and-after tests checked the work, with hinted retries for agents that could not implement it unaided.',
        nodes: [
          { icon: 'document', label: 'Prepared task', detail: 'Instructions, tests & hints' },
          { icon: 'cluster', label: '10 coding agents', detail: 'Attempt the PR implementation', kind: 'highlight' },
          { icon: 'check', label: 'Run outputs', detail: 'Before / after test results' }
        ],
        diagramDescription: 'Ten agents attempt the prepared PR implementation task. Tests run before and after implementation; agents unable to implement without hints retry with guidance.',
        note: 'Test results and agent outputs provide the material for review.'
      },
      {
        name: 'Review',
        title: 'Read every output. Explain the result.',
        summary: 'After all runs, I reviewed every output and gave feedback on what agents missed in failed attempts and what they did well.',
        nodes: [
          { icon: 'document', label: 'All run outputs', detail: 'Review every attempt' },
          { icon: 'check', label: 'Human review', detail: 'Missed details & good decisions', kind: 'highlight' },
          { icon: 'document', label: 'Feedback', detail: 'Explain failures and strengths' }
        ],
        diagramDescription: 'After all agent runs, I review every output and provide feedback covering what failed attempts missed and what agents did well.',
        fact: { label: 'Coding agents evaluated in the workflow', value: '10 agents, with every output reviewed' }
      }
    ]
  }
];
