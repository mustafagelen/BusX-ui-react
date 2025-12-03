
const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#d13b38] border-b">
            <div className="container !py-4 mx-auto ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">BusX</span>
                    </div>

                    <div className="hidden md:flex mt items-center gap-4">
                        <a href="#home" className="text-white text-[18px] hover:text-white transition-colors duration-300">
                            Anasayfa
                        </a>
                        <a href="#about" className="text-white text-[18px] hover:text-white transition-colors duration-300">
                            Hakkımızda
                        </a>

                        <a href="#categories" className="text-white text-[18px] hover:text-white transition-colors duration-300">
                            Yardım
                        </a>
                        <a href="#journeys" className="text-white text-[18px] hover:text-white transition-colors duration-300">
                            Seyehat Sorgula
                        </a>

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
