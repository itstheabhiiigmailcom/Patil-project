export default function Hero() {
  return (
    <section
      id="home"
      className="flex min-h-screen items-center justify-center pt-24  scroll-mt-24"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 lg:grid-cols-2">
        {/* TEXT */}
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Advertising that <span className="text-indigo-600">connects</span>
          </h2>
          <p className="text-lg text-gray-600">
            <strong>Advertisers</strong> reach the right audience without
            blowing the budget. <strong>Users</strong> discover relevant
            products, offers, and stories—all in a privacy‑respectful way.
          </p>
          <p className="text-sm text-gray-500">
            Build campaigns, monitor performance, and place creative that truly
            matters—while users simply enjoy curated, blazing‑fast content.
          </p>
        </div>

        {/* IMAGE */}
        <div className="flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80"
            alt="Team analyzing ad performance"
            className="w-full rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
