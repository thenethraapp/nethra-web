const OurPartners = () => {
    return (
      <section className="w-full mx-auto max-w-3xl px-5 sm:px-8 md:px-12 py-12 bg-white">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-lg font-semibold text-darkgray/70 tracking-wide">
            Our Partners
          </h2>
        </div>
  
        {/* Partner Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 items-center justify-items-center scale-85">
          <img
            src="/images/partners/image_riparo.png"
            alt="Riparo NG"
            className="w-28 sm:w-36 md:w-40 object-contain grayscale hover:grayscale-0 transition-all duration-300"
          />
          <img
            src="/images/partners/image_evc.png"
            alt="EVC"
            className="w-28 sm:w-36 md:w-40 object-contain grayscale hover:grayscale-0 transition-all duration-300"
          />
          <div className="flex flex-col items-center justify-center text-center">
            <img
              src="/images/partners/image_malhub.png"
              alt="Malhub"
              className="w-24 sm:w-18 object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
            <p className="font-medium text-darkgray/40 text-xs sm:text-sm mt-2">
              Malhub
            </p>
          </div>
          <img
            src="/images/partners/image_sui_ilorin.png"
            alt="Sui Ilorin"
            className="w-28 sm:w-36 md:w-40 object-contain grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>
      </section>
    );
  };
  
  export default OurPartners;
  