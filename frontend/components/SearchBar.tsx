"use client";

import { Loader2, Search} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
  isLoggedIn?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isLoggedIn = true }) => {
  const searchParams = useSearchParams();
  const defaultQuery = searchParams?.get("query") || "";
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearching, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState<string>(defaultQuery);
  const [isFocused, setIsFocused] = useState(false);
  // const [showResults, setShowResults] = useState(false);
  // const [searchedQuery, setSearchedQuery] = useState<string>("");

  const search = () => {
    if (isLoggedIn) {
      startTransition(() => {
        router.push(`/search?query=${encodeURIComponent(query)}`);
        // setShowResults(true);
        // setSearchedQuery(query);
      });
    } else {
      alert("Please log in to search.");
    }
  };

  useEffect(() => {
    if (pathname === "/") {
      setQuery("");
      // setShowResults(false);
    }
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isFocused) {
          inputRef.current?.blur();
          setIsFocused(false);
        } else {
          inputRef.current?.focus();
          inputRef.current?.select();
          setIsFocused(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFocused]);

  return (
    <div className="flex flex-col justiy-between w-full">
      <div className="relative h-10 z-10 rounded-md">
        <Input
          disabled={isSearching || !isLoggedIn}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setIsFocused(false);
              search();
            }

            if (e.key === "Escape") {
              inputRef?.current?.blur();
              setIsFocused(false);
            }
          }}
          ref={inputRef}
          placeholder={
            isLoggedIn ? "Find the best..." : "Please log in to search"
          }
          className="absolute inset-0 h-full bg-white text-[#333333] placeholder-gray-500 border-none text-xs"
        />

        <Button
          disabled={isSearching || !isLoggedIn}
          size="sm"
          onClick={search}
          className="absolute right-0 inset-y-0 h-full rounded-l-none bg-[#333333] hover:bg-gray-100"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#333333]" />
          ) : (
            <Search className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
