import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg mb-8">
        Have a question or want to work together? Fill out the form below and
        we'll get back to you as soon as possible.
      </p>
      <ContactForm />
    </div>
  );
}
