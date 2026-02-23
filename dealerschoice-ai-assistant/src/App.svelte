<script lang="ts">
  import ChatWidget from './lib/ChatWidget.svelte';
</script>

<main>
  <div class="container">
    <header>
      <h1>Dealer's Choic<span class="highlight">E</span></h1>
      <p class="tagline">Automated Recruitment Intelligence</p>
    </header>

    <section class="hero">
      <h2>Welcome to the Future of Recruiting</h2>
      <p>
        Our AI-powered platform helps you find, rank, and engage with top talent faster than ever before.
      </p>
    </section>

    <section class="products">
      <h3>Our Products</h3>
      
      <div class="product-grid">
        <div class="product-card featured">
          <div class="badge">Recommended</div>
          <h4>🎯 The Croupier</h4>
          <p class="price">$399/month</p>
          <p class="description">
            AI-powered LinkedIn candidate search, ranking, and automated outreach. 
            Our flagship product - fully operational and ready for production.
          </p>
          <ul>
            <li>Smart candidate search</li>
            <li>AI-powered ranking</li>
            <li>Automated emails</li>
            <li>Full workflow automation</li>
          </ul>
          <a href="https://primary-production-e5d2.up.railway.app/webhook/recruitment-form" 
             class="btn btn-primary" target="_blank">
            Try The Croupier →
          </a>
        </div>

        <div class="product-card">
          <div class="badge beta">Beta</div>
          <h4>💰 The Stack</h4>
          <p class="price">$199/month</p>
          <p class="description">
            Automated candidate outreach campaigns. Currently in beta testing.
          </p>
          <ul>
            <li>Email automation</li>
            <li>Multi-candidate campaigns</li>
            <li>Template management</li>
            <li>Campaign tracking</li>
          </ul>
          <button class="btn btn-secondary" disabled>
            Coming Soon
          </button>
        </div>

        <div class="product-card">
          <div class="badge beta">Beta</div>
          <h4>🏛️ The House Edge</h4>
          <p class="price">$149/month</p>
          <p class="description">
            Competitor intelligence and market insights. Currently in beta testing.
          </p>
          <ul>
            <li>Competitor tracking</li>
            <li>Job posting analysis</li>
            <li>Salary benchmarking</li>
            <li>Market intelligence</li>
          </ul>
          <button class="btn btn-secondary" disabled>
            Coming Soon
          </button>
        </div>
      </div>
    </section>

    <section class="cta">
      <h3>Ready to Transform Your Recruiting?</h3>
      <p>Chat with our AI assistant or start with The Croupier today!</p>
    </section>
  </div>

  <ChatWidget />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
    color: white;
    min-height: 100vh;
  }

  * {
    box-sizing: border-box;
  }

  main {
    min-height: 100vh;
    padding: 40px 20px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  header {
    text-align: center;
    margin-bottom: 60px;
  }

  h1 {
    font-size: 4em;
    font-style: italic;
    margin: 0;
    background: linear-gradient(135deg, white 0%, #a5b4fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .highlight {
    color: #6366f1;
    -webkit-text-fill-color: #6366f1;
  }

  .tagline {
    font-size: 1.2em;
    color: #a5b4fc;
    margin-top: 10px;
  }

  .hero {
    text-align: center;
    margin-bottom: 80px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    border: 2px solid rgba(99, 102, 241, 0.3);
  }

  .hero h2 {
    font-size: 2.5em;
    margin-bottom: 20px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero p {
    font-size: 1.3em;
    color: #cbd5e1;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .products {
    margin-bottom: 80px;
  }

  .products h3 {
    text-align: center;
    font-size: 2.5em;
    margin-bottom: 40px;
    color: #6366f1;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }

  .product-card {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(99, 102, 241, 0.2);
    border-radius: 20px;
    padding: 30px;
    transition: all 0.3s;
    position: relative;
  }

  .product-card:hover {
    border-color: rgba(99, 102, 241, 0.5);
    transform: translateY(-5px);
    box-shadow: 0 10px 40px rgba(99, 102, 241, 0.2);
  }

  .product-card.featured {
    border-color: rgba(99, 102, 241, 0.5);
    background: rgba(99, 102, 241, 0.1);
  }

  .badge {
    position: absolute;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.85em;
    font-weight: 600;
  }

  .badge.beta {
    background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%);
  }

  .product-card h4 {
    font-size: 1.8em;
    margin-bottom: 10px;
    color: white;
  }

  .price {
    font-size: 1.5em;
    color: #6366f1;
    font-weight: 700;
    margin-bottom: 15px;
  }

  .description {
    color: #cbd5e1;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 20px 0;
  }

  ul li {
    color: #a5b4fc;
    padding: 8px 0;
    padding-left: 25px;
    position: relative;
  }

  ul li:before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #6366f1;
    font-weight: bold;
  }

  .btn {
    display: inline-block;
    width: 100%;
    padding: 14px 28px;
    border-radius: 10px;
    font-size: 1em;
    font-weight: 600;
    text-decoration: none;
    text-align: center;
    transition: all 0.3s;
    border: none;
    cursor: pointer;
    margin-top: 10px;
  }

  .btn-primary {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #cbd5e1;
    cursor: not-allowed;
  }

  .cta {
    text-align: center;
    padding: 60px 40px;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 20px;
    border: 2px solid rgba(99, 102, 241, 0.3);
  }

  .cta h3 {
    font-size: 2.5em;
    margin-bottom: 20px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cta p {
    font-size: 1.3em;
    color: #cbd5e1;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5em;
    }

    .hero h2 {
      font-size: 1.8em;
    }

    .product-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
