export default function Contact() {
  return (
    <section id="contact" className="py-20  scroll-mt-24">
      <div className="mx-auto max-w-4xl space-y-6 px-4 text-center">
        <h3 className="text-3xl font-bold">Get in touch</h3>
        <p className="text-gray-600">
          Have a question or want a custom demo? Let’s talk!
        </p>
        <a
          href="mailto:hello@advision.io"
          className="inline-block rounded-lg border border-indigo-600 px-6 py-3 font-medium text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
        >
          hello@advision.io
        </a>
      </div>
    </section>
  );
}
