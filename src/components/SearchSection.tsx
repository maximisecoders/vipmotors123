import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Model data for each brand
const modelsData = {
  'aston martin': ['DB11', 'DBS Superleggera', 'Vantage', 'Valhalla', 'Valkyrie', 'DBX', 'DB1', 'DB2', 'DB3', 'DB4', 'DB5', 'DB6', 'DBS', 'V8 Vantage', 'Lagonda', 'Virage', 'DB7', 'Vanquish', 'DB9', 'One-77', 'Rapide', 'Vulcan'],
  'audi': ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'R8', 'TT', 'e-tron GT', 'Q4 e-tron', 'Q8 e-tron', '80', '100', 'Quattro', 'Fox', 'A1', 'A2', 'Q2', 'Sport Quattro S1'],
  'bentley': ['Continental GT', 'Flying Spur', 'Bentayga', '3 Litre', 'Speed Six', 'Continental R', 'S-Series', 'Arnage', 'Brooklands', 'Bacalar', 'Mulliner Batur'],
  'bmw': ['2 Series', '3 Series', '4 Series', '5 Series', '7 Series', '8 Series', 'X1', 'X3', 'X5', 'X6', 'X7', 'i4', 'i7', 'iX', 'Z4', 'M3', 'M4', 'M5', 'M8', 'X3 M', 'X5 M', '3/15', '328', 'Isetta', '507', 'Neue Klasse', '2002 Turbo', 'Z1', 'Z8', 'M1', 'i3', 'i8', 'M6'],
  'bugatti': ['Chiron', 'Divo', 'Bolide', 'Mistral', 'Type 35', 'Type 41', 'Type 57', 'EB110', 'Veyron', 'Centodieci'],
  'ferrari': ['Roma', 'Portofino M', '296 GTB', 'F8 Tributo', '812 Superfast', 'SF90 Stradale', 'Purosangue', 'Daytona SP3', 'LaFerrari', '125 S', '250', '365 GTB/4', 'Dino', 'Testarossa', 'F40', 'F50', 'Enzo', '308', '328', '360 Modena', 'F430', '458 Italia', '488 GTB', '550 Maranello', '599 GTB'],
  'koenigsegg': ['Jesko', 'Gemera', 'Regera', 'CC850', 'Agera RS', 'CC8S', 'CCR', 'CCX', 'Agera', 'One:1'],
  'lamborghini': ['Huracán', 'Revuelto', 'Urus', 'Sián', 'Countach LPI 800-4', '350 GT', 'Miura', 'Espada', 'Countach', 'Diablo', 'Murciélago', 'Gallardo', 'Aventador', 'Veneno', 'Centenario'],
  'maserati': ['Quattroporte', 'Ghibli', 'Levante', 'Grecale', 'MC20', 'GranTurismo Folgore', 'A6', '3500 GT', 'Bora', 'Khamsin', 'Biturbo', 'MC12'],
  'mclaren': ['720S', '750S', 'Artura', 'GT', 'Senna', 'Elva', 'Speedtail', 'F1 GTR', 'MP4-12C', '650S', '675LT', 'P1'],
  'mercedes': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'GT', 'SL Roadster', 'C63', 'G63', 'EQS', 'EQE', 'EQB', 'Maybach S-Class', 'G-Class', 'AMG One', '260 D', '300 SL', '600', 'W123', 'CLK GTR', 'SLR McLaren', 'SLS AMG'],
  'pagani': ['Huayra', 'Utopia', 'Zonda', 'Cinque', 'Tricolore', 'BC', 'Roadster', 'R'],
  'porsche': ['911', '718 Boxster', '718 Cayman', 'Taycan', 'Cayenne', 'Macan', 'Panamera', '356', '550 Spyder', '914', '928', '944', 'Boxster', 'Cayman', 'Carrera GT', '918 Spyder'],
  'rolls royce': ['Phantom', 'Ghost', 'Cullinan', 'Spectre', 'Boat Tail', 'Phantom I', 'Phantom II', 'Silver Ghost', 'Silver Cloud', 'Corniche', 'Wraith', 'Dawn']
};

// Get all unique models across all brands
const allModels = [...new Set(Object.values(modelsData).flat())].sort();

// Add interface for search values
interface SearchValues {
  keyword: string;
  make: string;
  model: string;
  body_type: string;
  year: string;
  price: string;
  mileage: string;
  sort: string;
}

const SearchSection = () => {
  const navigate = useNavigate();
  const [searchValues, setSearchValues] = useState<SearchValues>({
    keyword: "",
    make: "",
    model: "",
    body_type:"",
    year: "",
    price: "",
    mileage: "",
    sort: ""
  });

  // Get models based on selected make
  const getModels = () => {
    if (!searchValues.make) return allModels;
    return modelsData[searchValues.make as keyof typeof modelsData] || [];
  };

  const resetSearch = () => {
    setSearchValues({
      keyword: "",
      make: "",
      model: "",
      body_type:"",
      year: "",
      price: "",
      mileage: "",
      sort: ""
    });
    navigate('/inventory');
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    Object.entries(searchValues).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/inventory?${params.toString()}`);
  };

  const handleSingleOptionChange = (key: string, value: string) => {
    let processedValue = value;
    
    // Special handling for make
    if (key === 'make') {
      // Keep mercedes as 'mercedes' in the URL and state
      processedValue = value.toLowerCase();
    }

    if (key === 'model') {
      processedValue = value.toLowerCase();
    }
    
    if (key === 'body_type') {
      processedValue = value.toLowerCase();
    }

    if (key === 'make') {
      setSearchValues(prev => ({ ...prev, [key]: processedValue, model: "" }));
    } else {
      setSearchValues(prev => ({ ...prev, [key]: processedValue }));
    }
    
    const updatedValues = key === 'make' ? 
      { ...searchValues, [key]: processedValue, model: "" } : 
      { ...searchValues, [key]: processedValue };
    
    // Only add non-empty values to URL params
    const params = new URLSearchParams();
    Object.entries(updatedValues).forEach(([k, v]) => {
      if (v && v.trim() !== '') {
        params.append(k, v);
      }
    });
    
    navigate(`/inventory?${params.toString()}`);
  };

  return (
    <div className="container bg-transparent mx-auto px-4 -mt-20 relative z-20">
      <div className="glass-card rounded-xl p-8 max-w-4xl mx-auto backdrop-blur-3xl bg-white bg-opacity-10 shadow-lg">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Find Your Dream Car</h2>
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-4">
              <Input 
                type="text" 
                placeholder="Search by make, model, or keyword" 
                className="flex-1"
                value={searchValues.keyword}
                onChange={(e) => handleSingleOptionChange('keyword', e.target.value)}
              />
              <Button type="submit" className="bg-black hover:bg-black/90">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <select 
                className="rounded-xl border border-input bg-background px-4 py-3 text-sm bg-opacity-10 shadow-lg "
                value={searchValues.make}
                onChange={(e) => handleSingleOptionChange('make', e.target.value)}
              >
                <option value="">Make</option>
                <option value="aston martin">Aston Martin</option>
                <option value="audi">Audi</option>
                <option value="bentley">Bentley</option>
                <option value="bmw">BMW</option>
                <option value="bugatti">Bugatti</option>
                <option value="ferrari">Ferrari</option>
                <option value="koenigsegg">Koenigsegg</option>
                <option value="lamborghini">Lamborghini</option>
                <option value="maserati">Maserati</option>
                <option value="mclaren">McLaren</option>
                <option value="mercedes">Mercedes-Benz</option>
                <option value="pagani">Pagani</option>
                <option value="porsche">Porsche</option>
                <option value="rolls royce">Rolls-Royce</option>
              </select>
              <select 
                className="rounded-xl border border-input bg-background px-4 py-3 text-sm bg-opacity-10 shadow-lg"
                value={searchValues.model}
                onChange={(e) => handleSingleOptionChange('model', e.target.value)}
              >
                <option value="">Model</option>
                {getModels().map(model => (
                  <option key={model} value={model.toLowerCase()}>
                    {model}
                  </option>
                ))}
              </select>
              <select 
                className="rounded-xl border border-input bg-background px-4 py-3 text-sm bg-opacity-10 shadow-lg "
                value={searchValues.body_type}
                onChange={(e) => handleSingleOptionChange('body_type', e.target.value)}
              >
                <option value="">Body Type</option>
                <option value="suv">SUV</option>
                <option value="sedan">Sedan</option>
                <option value="coupe">Coupe</option>
                <option value="convertible">Convertible</option>
                <option value="hatchback">Hatchback</option>
                <option value="sports_car">Sports Car</option>
                <option value="supercar">Supercar</option>
                <option value="hypercar">Hypercar</option>
                <option value="grand_tourer">Grand Tourer</option>
              </select>
              
              {/* Rest of the selects remain the same */}
              <select 
                className="rounded-xl border border-input bg-background px-4 py-3 text-sm bg-opacity-10 shadow-lg"
                value={searchValues.year}
                onChange={(e) => handleSingleOptionChange('year', e.target.value)}
              >
                <option value="">Year</option>
                {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
              <select 
                className="rounded-xl border border-input bg-background px-4 py-3 text-sm bg-opacity-10 shadow-lg"
                value={searchValues.mileage}
                onChange={(e) => handleSingleOptionChange('mileage', e.target.value)}
              >
                <option value="">Mileage</option>
                <option value="0-1000">0-1,000 km</option>
                <option value="1000-5000">1,000-5,000 km</option>
                <option value="5000-10000">5,000-10,000 km</option>
                <option value="10000+">10,000+ km</option>
              </select>
              <select 
                className="rounded-xl border border-input bg-background px-4 py-3 text-sm bg-opacity-10 shadow-lg"
                value={searchValues.price}
                onChange={(e) => handleSingleOptionChange('price', e.target.value)}
              >
                <option value="">Price Range</option>
                <option value="50k">Under AED 180k</option>
                <option value="100k">Under AED 370k</option>
                <option value="200k">Under AED 740k</option>
                <option value="500k">Under AED 1.8M</option>
                <option value="1000k">Under AED 3.7M</option>
                <option value="2000k">Under AED 7.4M</option>
                <option value="5000k">Under AED 18.4M</option>
              </select>
              <select 
                className="rounded-xl border border-input bg-background px-4 py-3 text-sm bg-opacity-10 shadow-lg"
                value={searchValues.sort}
                onChange={(e) => handleSingleOptionChange('sort', e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <Button 
                type="button"
                variant="outline" 
                onClick={resetSearch}
                className="col-span-2 md:col-span-1 "
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;