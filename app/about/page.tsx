export default function About() {
  return (
    <section className="py-12 bg-black text-white">
      {" "}
      {/* Cyberpunk base */}
      <h1 className="text-4xl text-cyan-400">Meet the Founder</h1>{" "}
      {/* Theme colors */}
      <div className="flex items-center gap-8">
        <img
          src="/images/stephen.jpg"
          alt="Stephen Chijioke Okoronkwo"
          className="w-48 rounded-full border-cyan-400"
        />{" "}
        {/* Upload photo to /public/images */}
        <div>
          <h2 className="text-3xl">Okoronkwo Stephen Chijioke</h2>
          <p className="italic">Systems Architect | AI Strategist | Founder</p>
          <p>
            Stephen Chijioke Okoronkwo is a Nigerian systems architect... [Paste
            full bio text here—Copilot formats]
          </p>
          <a href="mailto:wonderstevie702@gmail.com" className="text-cyan-400">
            Contact
          </a>{" "}
          {/* Copilot adds links */}
        </div>
      </div>
    </section>
  );
  return (
    <section
      className="py-12 bg-black text-white"
      aria-label="About Nigerian AI Founder"
    >
      <h1 className="text-4xl text-cyan-400 mb-4">Meet the Founder</h1>
      <div className="flex items-center gap-8">
        <img
          src="/images/stephen.jpg"
          alt="Stephen Chijioke Okoronkwo, Nigerian AI Expert"
          className="w-48 rounded-full border-cyan-400"
        />
        <div>
          <h2 className="text-3xl mb-2">Okoronkwo Stephen Chijioke</h2>
          <p className="italic mb-2">
            Systems Architect | AI Strategist | Founder
          </p>
          <p className="mb-4">
            Stephen Chijioke Okoronkwo is a pioneering Nigerian systems
            architect and AI strategist, recognized for advancing artificial
            intelligence, machine learning, and digital innovation in Nigeria
            and across Africa. As the founder of Shadowspark, Stephen leads
            transformative projects in AI, cloud computing, and data science,
            empowering businesses and startups to harness the power of
            technology. His expertise spans generative AI, natural language
            processing, and ethical AI development, making him a key influencer
            in Nigeria's tech ecosystem. Stephen is passionate about building
            scalable solutions, mentoring young Nigerian AI engineers, and
            driving the adoption of responsible AI for social impact.
          </p>
          <a
            href="mailto:wonderstevie702@gmail.com"
            className="text-cyan-400 underline"
            aria-label="Contact Nigerian AI Founder"
          >
            Contact
          </a>
        </div>
      </div>
      <meta
        name="description"
        content="About Okoronkwo Stephen Chijioke, Nigerian AI founder, systems architect, and leader in artificial intelligence, machine learning, and digital innovation."
      />
      <meta
        name="keywords"
        content="Nigerian AI, artificial intelligence Nigeria, machine learning Nigeria, AI strategist, Nigerian systems architect, generative AI, NLP, ethical AI, Shadowspark, tech Nigeria, digital innovation Africa"
      />
    </section>
  );
}
