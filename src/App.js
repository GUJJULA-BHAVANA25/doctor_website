import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function App() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    mode: searchParams.get("mode") || "",
    specialties: new Set(searchParams.getAll("specialty") || []),
    sort: searchParams.get("sort") || "",
  });

  useEffect(() => {
    fetch("https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data.doctors || []);
        setFilteredDoctors(data.doctors || []);
      })
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  useEffect(() => {
    applyFilters();
  }, [doctors, filters, searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.mode) params.set("mode", filters.mode);
    if (filters.sort) params.set("sort", filters.sort);
    if (searchQuery) params.set("search", searchQuery);
    
    filters.specialties.forEach(specialty => {
      params.append("specialty", specialty);
    });
    
    setSearchParams(params);
  }, [filters, searchQuery]);

  const applyFilters = () => {
    let result = [...doctors];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply mode filter
    if (filters.mode) {
      result = result.filter(doctor => {
        if (filters.mode === "video") return doctor.videoConsult;
        if (filters.mode === "clinic") return doctor.inClinic;
        return true;
      });
    }

    // Apply specialty filter
    if (filters.specialties.size > 0) {
      result = result.filter(doctor => 
        doctor.specialties.some(s => filters.specialties.has(s))
      );
    }

    // Apply sorting
    if (filters.sort === "fees") {
      result.sort((a, b) => a.fees - b.fees);
    } else if (filters.sort === "experience") {
      result.sort((a, b) => b.experience - a.experience);
    }

    setFilteredDoctors(result);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const matchedSuggestions = doctors
        .filter(doc => doc.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3);
      setSuggestions(matchedSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (doctorName) => {
    setSearchQuery(doctorName);
    setSuggestions([]);
  };

  const handleSpecialtyToggle = (specialty) => {
    const newSpecialties = new Set(filters.specialties);
    if (newSpecialties.has(specialty)) {
      newSpecialties.delete(specialty);
    } else {
      newSpecialties.add(specialty);
    }
    setFilters({ ...filters, specialties: newSpecialties });
  };

  const handleModeChange = (mode) => {
    setFilters({ ...filters, mode });
  };

  const handleSortChange = (sort) => {
    setFilters({ ...filters, sort });
  };

  const clearFilters = () => {
    setFilters({
      mode: "",
      specialties: new Set(),
      sort: "",
    });
    setSearchQuery("");
    setSuggestions([]);
  };

  const allSpecialties = [
    { display: "General Physician", id: "General-Physician" },
    { display: "Dentist", id: "Dentist" },
    { display: "Dermatologist", id: "Dermatologist" },
    { display: "Paediatrician", id: "Paediatrician" },
    { display: "Gynaecologist", id: "Gynaecologist" },
    { display: "ENT", id: "ENT" },
    { display: "Diabetologist", id: "Diabetologist" },
    { display: "Cardiologist", id: "Cardiologist" },
    { display: "Physiotherapist", id: "Physiotherapist" },
    { display: "Endocrinologist", id: "Endocrinologist" },
    { display: "Orthopaedic", id: "Orthopaedic" },
    { display: "Ophthalmologist", id: "Ophthalmologist" },
    { display: "Gastroenterologist", id: "Gastroenterologist" },
    { display: "Pulmonologist", id: "Pulmonologist" },
    { display: "Psychiatrist", id: "Psychiatrist" },
    { display: "Urologist", id: "Urologist" },
    { display: "Dietitian/Nutritionist", id: "Dietitian-Nutritionist" },
    { display: "Psychologist", id: "Psychologist" },
    { display: "Sexologist", id: "Sexologist" },
    { display: "Nephrologist", id: "Nephrologist" },
    { display: "Neurologist", id: "Neurologist" },
    { display: "Oncologist", id: "Oncologist" },
    { display: "Ayurveda", id: "Ayurveda" },
    { display: "Homeopath", id: "Homeopath" }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 p-6">
        <div className="max-w-6xl mx-auto relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Symptoms, Doctors, Specialists, Clinics"
              className="w-full p-3 pl-4 pr-10 rounded border border-gray-300"
              value={searchQuery}
              onChange={handleSearchChange}
              data-testid="autocomplete-input"
            />
            <div className="absolute right-3 top-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white shadow-lg rounded-b-md mt-1">
              {suggestions.map((doctor, index) => (
                <div
                  key={index}
                  className="p-3 border-b border-gray-100 flex items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelectSuggestion(doctor.name)}
                  data-testid="suggestion-item"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-md flex-shrink-0">
                    {doctor.image && <img src={doctor.image} alt="" className="w-full h-full object-cover rounded-md" />}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">{doctor.name}</div>
                    <div className="text-gray-500 text-sm">{doctor.specialties[0]}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 px-4 flex flex-col md:flex-row">
        <aside className="md:w-64 flex-shrink-0 mb-6 md:mb-0 md:mr-6">
          <div className="bg-white rounded-md shadow p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium" data-testid="filter-header-sort">Sort by</h3>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sort === "fees"}
                  onChange={() => handleSortChange("fees")}
                  data-testid="sort-fees"
                />
                <span>Price: Low-High</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sort === "experience"}
                  onChange={() => handleSortChange("experience")}
                  data-testid="sort-experience"
                />
                <span>Experience: Most Experience first</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-md shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-blue-600 text-sm"
              >
                Clear All
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-gray-700" data-testid="filter-header-speciality">Specialities</h4>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                <div className="relative mb-2">
                  <input 
                    type="text" 
                    placeholder="Search Specialities"
                    className="w-full p-2 pl-8 border border-gray-300 rounded text-sm"
                  />
                  <svg className="w-4 h-4 absolute left-2 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                
                <div className="space-y-2">
                  {allSpecialties.map(specialty => (
                    <label key={specialty.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.specialties.has(specialty.display)}
                        onChange={() => handleSpecialtyToggle(specialty.display)}
                        data-testid={`filter-specialty-${specialty.id}`}
                      />
                      <span className="text-sm">{specialty.display}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-gray-700" data-testid="filter-header-moc">Mode of consultation</h4>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="consultationMode"
                    checked={filters.mode === "video"}
                    onChange={() => handleModeChange("video")}
                    data-testid="filter-video-consult"
                  />
                  <span className="text-sm">Video Consult</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="consultationMode"
                    checked={filters.mode === "clinic"}
                    onChange={() => handleModeChange("clinic")}
                    data-testid="filter-in-clinic"
                  />
                  <span className="text-sm">In Clinic</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="consultationMode"
                    checked={filters.mode === ""}
                    onChange={() => handleModeChange("")}
                  />
                  <span className="text-sm">All</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="space-y-4">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor, index) => (
                <div key={index} className="bg-white rounded-md shadow overflow-hidden" data-testid="doctor-card">
                  <div className="p-4 flex">
                    <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                      {doctor.image ? (
                        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                          {doctor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-lg" data-testid="doctor-name">{doctor.name}</h3>
                          <div className="text-gray-600" data-testid="doctor-specialty">
                            {doctor.specialties ? doctor.specialties.join(", ") : ""}
                          </div>
                          <div className="text-gray-500 text-sm mt-1">{doctor.qualification}</div>
                          <div className="text-gray-600 mt-1" data-testid="doctor-experience">{doctor.experience} yrs exp.</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg" data-testid="doctor-fee">₹ {doctor.fees}</div>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        {doctor.clinicName}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {doctor.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 flex justify-end">
                    <button className="py-2 px-6 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors">
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-md shadow p-6 text-center">
                <p className="text-gray-500">No doctors found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}