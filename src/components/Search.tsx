import { Search as SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/inventory?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search for your dream car..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 h-12 px-4 rounded-full bg-white/20 backdrop-blur-sm 
                     border border-white/30 text-white placeholder:text-white/70
                     focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <Button 
          type="submit"
          className="h-12 px-6 rounded-full bg-white/20 hover:bg-white/30 
                     backdrop-blur-sm border border-white/30 text-white
                     transition-colors duration-200"
        >
          <SearchIcon className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};

export default Search;
