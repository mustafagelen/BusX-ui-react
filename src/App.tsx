import Navbar from './components/Navbar';
import JourneyType from './components/JourneyType';
import JourneySearch from './components/JourneySearch';
import JourneyList from './components/JourneyList';
import { BookingProvider } from './context/BookingContext';

function App() {
  return (
    <BookingProvider>
      <div className='bg-[#f3f4f6] min-h-screen'>
        <Navbar />
        <JourneyType />
        <JourneySearch />
        <JourneyList />
      </div>
    </BookingProvider>
  );
}

export default App;
