function App() {
  return (
    <section className="relative w-full h-screen bg-hero-bg">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-90"></div>

      {/* Content wrapper */}
      <div className="mx-4 md:mx-14 relative flex flex-col items-center justify-center h-full text-center text-white">
        {/* Logo */}
        <a href="#" className="absolute top-4 left-4 z-10 font-roboto font-bold text-xl">K-Verse</a>

        {/* Main content */}
        <div className="md:mt-16">
          <h1 className="font-roboto font-bold text-3xl md:text-6xl leading-snug md:leading-snug max-w-[728px]">Stay Ahead with the Latest K-Drama Releases!</h1>
          <p className="font-os mx-auto md:mx-auto md:text-lg max-w-[601px] mt-6">
            Discover a diverse selection of new (and old!) K-dramas. Rate your favorites, engage in fan discussions, explore detailed show descriptions, and many more!
          </p>
          <div className="mt-12">
            <a href="https://forms.gle/6J2GH4JfRCykRJyS8" className="font-os font-medium text-lg bg-[#2E7D32] text-white px-6 py-3 rounded-md">Join the Waitlist!</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
