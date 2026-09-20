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
