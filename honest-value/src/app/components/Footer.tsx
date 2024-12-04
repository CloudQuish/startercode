import React from "react";

const Footer: React.FC = () => {
  const companyLinks = [
    { label: "About", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Demo", href: "#" },
  ];

  const pricingLinks = [
    { label: "Blog", href: "#" },
    { label: "Events", href: "#" },
    { label: "Tool Library", href: "#" },
  ];

  const contactLinks = [
    { label: "Terms of Use", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ];

  const socialLinks = [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "Github", href: "#" },
  ];

  return (
    <div>
      <footer
        className="w-full px-4 md:px-0 relative"
        style={{
          backgroundImage: "url(/images/heroImage.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-4 lg:mx-12 my-2 lg:my-8 absolute inset-0 bg-[#01414A] opacity-100 rounded-3xl"></div>

        <div className="relative max-w-[1440px] mx-auto rounded-xl p-4 md:p-16 z-10">
          <div className="flex flex-col 1180:flex-row justify-between items-center space-y-12 1180:space-y-0 py-16 500:px-6">
            {/* Navigation Columns */}
            <div className="flex justify-center flex-row gap-x-8 500:gap-x-12 gap-y-8 md:space-y-0 md:space-x-16 w-full md:w-auto">
              {/* Company Column */}
              <div className="space-y-4 text-center 1180:text-left">
                <h3 className="font-inter font-semibold 500:text-base md:text-[24px] text-white">
                  Company
                </h3>
                <nav className="space-y-2 flex flex-col">
                  {companyLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="font-inter font-normal text-xs 500:text-sm md:text-[18px] text-white hover:underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Pricing Column */}
              <div className="space-y-4 text-center 1180:text-left">
                <h3 className="font-inter font-semibold 500:text-base md:text-[24px] text-white">
                  Pricing
                </h3>
                <nav className="space-y-2 flex flex-col">
                  {pricingLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="font-inter font-normal text-xs 500:text-sm md:text-[18px] text-white hover:underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Contact Column */}
              <div className="space-y-4 text-center 1180:text-left">
                <h3 className="font-inter font-semibold text-base md:text-[24px] text-white">
                  Contact Us
                </h3>
                <nav className="space-y-2 flex flex-col">
                  {contactLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="font-inter font-normal text-xs 500:text-sm md:text-[18px] text-white hover:underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="w-full md:w-[436px] space-y-6 text-center md:text-left">
              <div>
                <h2 className="font-inter font-semibold text-3xl md:text-4xl xl:text-[74px] text-white mb-4 text-center">
                  HonestValue
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-inter font-semibold text-sm md:text-[16px] text-white mb-2">
                    Subscribe
                  </h4>
                  <p className="text-[#8E93A4] font-inter font-normal text-xs md:text-[16px]">
                    Join our newsletter to stay up to date on features and
                    releases.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex rounded-lg bg-white p-2 items-center max-w-md mx-auto md:mx-0">
                    <div className="p-2 bg-gray-100 rounded-lg mr-2">
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-grow text-gray-700 focus:outline-none font-inter text-xs"
                    />
                    <button className="-ml-[85px] bg-gray-200 text-gray-700 px-3 500:px-4 py-2 rounded-lg text-xs md:text-sm font-inter font-semibold">
                      Subscribe
                    </button>
                  </div>
                  <p className="text-white text-xs md:text-[12px] font-inter font-normal text-center md:text-left">
                    By subscribing you agree to our{" "}
                    <span className="underline">Privacy Policy</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Border and Social Section */}
          <div className="border-t-2 border-[#606060] mt-8 md:mt-12 pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex space-x-2 md:space-x-4 mb-4 md:mb-0">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="border text-white border-white rounded-full px-3 py-1 md:px-4 md:py-2 font-inter font-normal text-xs md:text-[16px] hover:bg-white hover:text-[#01414A] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="text-white font-inter font-normal text-xs md:text-[16px] mx-4 w-full flex justify-center border border-white rounded-full px-4 py-2 text-center items-center">
                <span>All Rights Reserved</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
