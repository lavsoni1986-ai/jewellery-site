"use client";

import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Dhanpuri",
      rating: 5,
      text: "Best gold jewelry in Burhar! Got my wedding set from here - authentic quality and reasonable prices. The staff is very helpful.",
      avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuNzYxNCAyMCAyMFoiIGZpbGw9IiM5Q0E5QzkiLz4KPHBhdGggZD0iTTMwIDI4QzMwIDI0LjY4NjMgMjYuNTIyOCAyMiAyMiAyMkgxOEMxMy40NzcyIDIyIDEwIDI0LjY4NjMgMTAgMjhWMzBIMzBWMjhaIiBmaWxsPSIjOUNBOUI5Ii8+Cjwvc3ZnPgo=", // Default avatar SVG
      date: "2 weeks ago"
    },
    {
      name: "Rajesh Gupta",
      location: "Burhar",
      rating: 5,
      text: "Anshu Jewellers has been our family jeweler for 3 generations in Burhar. Always trustworthy and their craftsmanship is outstanding.",
      avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuNzYxNCAyMCAyMFoiIGZpbGw9IiM5Q0E5QzkiLz4KPHBhdGggZD0iTTMwIDI4QzMwIDI0LjY4NjMgMjYuNTIyOCAyMiAyMiAyMkgxOEMxMy40NzcyIDIyIDEwIDI0LjY4NjMgMTAgMjhWMzBIMzBWMjhaIiBmaWxsPSIjOUNBOUI5Ii8+Cjwvc3ZnPgo=",
      date: "1 month ago"
    },
    {
      name: "Meera Patel",
      location: "Burhar",
      rating: 5,
      text: "Beautiful collection and excellent service. They helped me choose the perfect earrings for my daughter. Highly recommended!",
      avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuNzYxNCAyMCAyMFoiIGZpbGw9IiM5Q0E5QzkiLz4KPHBhdGggZD0iTTMwIDI4QzMwIDI0LjY4NjMgMjYuNTIyOCAyMiAyMiAyMkgxOEMxMy40NzcyIDIyIDEwIDI0LjY4NjMgMTAgMjhWMzBIMzBWMjhaIiBmaWxsPSIjOUNBOUI5Ii8+Cjwvc3ZnPgo=",
      date: "3 weeks ago"
    },
    {
      name: "Amit Singh",
      location: "Dhanpuri",
      rating: 5,
      text: "Fair pricing and transparent billing. No hidden costs like some other places. Highly recommended in the area.",
      avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuNzYxNCAyMCAyMFoiIGZpbGw9IiM5Q0E5QzkiLz4KPHBhdGggZD0iTTMwIDI4QzMwIDI0LjY4NjMgMjYuNTIyOCAyMiAyMiAyMkgxOEMxMy40NzcyIDIyIDEwIDI0LjY4NjMgMTAgMjhWMzBIMzBWMjhaIiBmaWxsPSIjOUNBOUI5Ii8+Cjwvc3ZnPgo=",
      date: "1 week ago"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-[#65000b] mb-4 tracking-wide">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Real reviews from our valued customers in Burhar, Dhanpuri and surrounding areas
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex">{renderStars(5)}</div>
              <span className="text-gray-600 font-medium">4.9/5 from 500+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#FAF9F6] p-6 rounded-xl shadow-lg border border-[#D4AF37]/10 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-12 h-12 mb-4 overflow-hidden rounded-full border-2 border-[#D4AF37]/20">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#65000b]">{testimonial.name}</h4>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {renderStars(testimonial.rating)}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  "{testimonial.text}"
                </p>

                <p className="text-xs text-gray-500">{testimonial.date}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href="https://g.co/kgs/YourGoogleBusinessLink" // Replace with actual Google Business link
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#65000b] px-6 py-3 rounded-lg font-semibold hover:bg-[#B8860B] transition-colors shadow-lg"
            >
              📖 Read More Reviews on Google
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}