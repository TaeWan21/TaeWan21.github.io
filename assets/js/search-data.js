// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-",
    title: "",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-about",
          title: "About",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/about/";
          },
        },{id: "nav-categories",
          title: "Categories",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "post-paper-review-agentgrad-intervention-guided-prompt-optimization-for-multi-agent-systems-arxiv-2026",
        
          title: "[Paper Review] AgentGrad: Intervention-guided Prompt Optimization for Multi Agent Systems (arXiv, 2026)",
        
        description: "실패마다 agent를 하나씩 개입해 고칠 prompt를 찾고, 개입으로 얻은 출력을 agent 수준 pseudo-label로 써서 textual gradient를 뽑은 뒤, 비슷한 gradient끼리 묶어 추상화하는 multi-agent prompt optimizer",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/agentgrad/";
          
        },
      },{id: "post-paper-review-dover-intervention-driven-auto-debugging-for-llm-multi-agent-systems-iclr-2026",
        
          title: "[Paper Review] DoVer: Intervention-Driven Auto Debugging for LLM Multi-Agent Systems (ICLR, 2026)",
        
        description: "실패한 multi-agent 실행 log에서 세운 failure attribution 가설을, 의심 step의 message를 고치고 그 지점부터 재실행해 검증하는 do-then-verify debugging framework",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/dover/";
          
        },
      },{id: "post-paper-review-textgrad-automatic-quot-differentiation-quot-via-text-arxiv-2024",
        
          title: "[Paper Review] TextGrad: Automatic &quot;Differentiation&quot; via Text (arXiv, 2024)",
        
        description: "LLM이 주는 자연어 비평을 gradient로 보고, 임의의 computation graph를 따라 역전파해 prompt, code, 분자, 치료 계획까지 같은 syntax로 최적화하는 framework TextGrad",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/textgrad/";
          
        },
      },{id: "post-paper-review-gepa-reflective-prompt-evolution-can-outperform-reinforcement-learning-iclr-2026",
        
          title: "[Paper Review] GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (ICLR, 2026)",
        
        description: "rollout의 자연어 trace를 LLM이 reflection해 prompt를 진화시키고, task별 Pareto frontier에서 후보를 sampling하는 prompt optimizer GEPA. GRPO보다 최대 35배 적은 rollout으로 더 높은 점수를 낸다",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/gepa/";
          
        },
      },{id: "post-paper-review-a-two-tier-perspective-on-inference-time-parallelism-in-multi-agent-llm-systems-icml-2026",
        
          title: "[Paper Review] A Two-Tier Perspective on Inference-Time Parallelism in Multi-Agent LLM Systems (ICML,...",
        
        description: "multi-agent system의 추론 시 병렬화를 task 수준의 Replica Parallelism과 경로 내부의 Structural Parallelism 두 층으로 나누고, 둘의 상호작용을 하나의 실행 framework(TIPEX)에서 분석한 논문",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/tipex/";
          
        },
      },{id: "post-paper-review-learning-to-share-selective-memory-for-efficient-parallel-agentic-systems-icml-2026",
        
          title: "[Paper Review] Learning to Share: Selective Memory for Efficient Parallel Agentic Systems (ICML,...",
        
        description: "병렬로 도는 agent team들이 중간 결과를 global memory bank로 공유하되, 무엇을 공유할지는 RL로 학습된 lightweight controller가 정하는 LTS",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/learning-to-share/";
          
        },
      },{id: "post-paper-review-optimizing-sequential-multi-step-tasks-with-parallel-llm-agents-icml-workshop-2025",
        
          title: "[Paper Review] Optimizing Sequential Multi-Step Tasks with Parallel LLM Agents (ICML Workshop, 2025)...",
        
        description: "같은 task를 푸는 여러 multi-agent team을 동시에 실행하고, 가장 빠른 답을 취하거나(early stopping) 답들을 합쳐(aggregation) latency와 완료율을 개선하는 M1-Parallel",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/m1-parallel/";
          
        },
      },{id: "post-paper-review-magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks-arxiv-2024",
        
          title: "[Paper Review] Magentic-One: A Generalist Multi-Agent System for Solving Complex Tasks (arXiv, 2024)...",
        
        description: "Orchestrator의 두 ledger와 nested loop로 planning, progress tracking, error recovery를 구현한 generalist multi-agent system",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/magentic-one/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "projects-development-of-a-traffic-accident-video-analysis-system",
          title: 'Development of a Traffic Accident Video Analysis System',
          description: "Develops technologies for analyzing accident footage, including vehicle speed and steering angle estimation from video analysis.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_traffic_accident/";
            },},{id: "projects-research-on-ict-technology-discovery-linked-to-digital-twin",
          title: 'Research on ICT Technology Discovery Linked to Digital Twin',
          description: "Focuses on data visualization for Energy Storage Systems and XR-based strategies including tracking technologies.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_digital_twin_ict/";
            },},{id: "projects-large-scale-ai-based-defense-product-design-and-maintenance-service-demonstration",
          title: 'Large-Scale AI-based Defense Product Design and Maintenance Service Demonstration',
          description: "Demonstrates hyper-scale AI convergence service using AI and spatial computing (XR) for military supply manufacturing productivity.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_defense_ai/";
            },},{id: "projects-development-of-spatial-computing-xr-multimodal-interaction-technology",
          title: 'Development of Spatial Computing XR Multimodal Interaction Technology',
          description: "Develops multimodal interaction technology for spatial computing devices such as Apple Vision Pro.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_xr_multimodal/";
            },},{id: "projects-financial-news-summarizer-via-llm-fine-tuning",
          title: 'Financial News Summarizer via LLM Fine-Tuning',
          description: "Fine-tuned Llama 3 8B with LoRA to extract structured fields from Korean financial news.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/p1_financial_news_llm/";
            },},{id: "projects-dialogue-summarization-via-discord-chatbot",
          title: 'Dialogue Summarization via Discord Chatbot',
          description: "Korean dialogue summarization deployed as a Discord chatbot, using KoBERT and the AI HUB Korean Dialogue Summarization Dataset.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/p2_dialogue_summarization/";
            },},{id: "projects-moviepick-plot-based-movie-recommendation-system",
          title: 'MoviePick — Plot-Based Movie Recommendation System',
          description: "A keyword-driven Korean movie recommender built on crawled Naver Series On plot data, with actor / keyword / title search modes served via FastAPI.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/p3_movie_recommender/";
            },},{id: "projects-smart-note-with-generative-ai",
          title: 'Smart Note with Generative AI',
          description: "WPF (C#) desktop note-taking app augmented with generative AI for summarization, expansion, and structuring of long-form notes.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/p4_smart_note/";
            },},{id: "projects-earthquake-shelter-map-public-api-safety-service",
          title: 'Earthquake Shelter Map — Public API Safety Service',
          description: "A safety-map web service combining Kakao Maps and the public-data earthquake/tsunami shelter API, with GPS-based location, routing, and search.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/p5_earthquake_support/";
            },},{id: "projects-camping-site-reservation-web-programming-term-project",
          title: 'Camping Site Reservation — Web Programming Term Project',
          description: "An Airbnb-style camping reservation web app with browsing, filtering, booking, and reviews — built end-to-end with React (front end) and an Express + MySQL backend.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/p6_camping_reservation/";
            },},{id: "projects-revieweyes-feature-based-beauty-product-search",
          title: 'ReviewEyes — Feature-based Beauty Product Search',
          description: "Capstone project (Team Leader) that fine-tunes KoBERT for aspect-level sentiment on Korean cosmetic reviews and serves the extracted features through Elasticsearch. Led to a KCI journal paper and a patent application.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/p7_cosmetic_search/";
            },},{id: "projects-otkkidokkiyo-옷키도키요-ai-shopping-assistant-for-the-visually-impaired",
          title: 'OtkkiDokkiYo (옷키도키요) — AI Shopping Assistant for the Visually Impaired',
          description: "A voice-driven mobile app that lets visually impaired users photograph an item of clothing and hear a detailed description back, built on a Mask-R-CNN + ResNet-50 vision pipeline.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/p8_okido/";
            },},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/introduction-to-machine-learning/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6B%69%6D%74%61%65%79%61%6E%32%31@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/TaeWan21", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
