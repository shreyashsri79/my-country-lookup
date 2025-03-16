import { PageProps } from "next"; // Import Next.js PageProps
import Image from "next/image";

const fetchCountryData = async (country: string) => {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Country not found");
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.log(error); // Fixed unused variable issue
    return null;
  }
};

// ✅ Fix: Use `PageProps` for params
const CountryInfo = async ({ params }: PageProps<{ country: string }>) => {
  const countryData = await fetchCountryData(params.country);
  
  if (!countryData) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-gray-900">
        <h1 className="text-4xl font-bold">Country not found 😕</h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 py-12">
      {/* Background Image */}
      <div className="absolute inset-0 w-s">
        <Image
          src={countryData.flags.png}
          alt={`${countryData.name.common} Flag`}
          fill
          className="object-cover opacity-30 w-screen"
        />
      </div>

      {/* Content Section */}
      <div className="relative z-10 max-w-4xl w-full bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-lg p-8">
        {/* Country Name */}
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold">{countryData.name.common}</h1>
          {countryData.name.official !== countryData.name.common && (
            <h2 className="text-xl sm:text-2xl text-gray-300 mt-2">{countryData.name.official}</h2>
          )}
        </div>

        {/* Country Details */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Capital", value: countryData.capital?.[0] || "N/A" },
            { label: "Region", value: `${countryData.region} (${countryData.subregion || "N/A"})` },
            { label: "Population", value: countryData.population.toLocaleString() },
            { label: "Time Zone", value: countryData.timezones[0] },
            {
              label: "Currencies",
              value: countryData.currencies
                ? Object.values(countryData.currencies).map((cur: { name: string }) => cur.name).join(", ")
                : "N/A",
            },
            {
              label: "Languages",
              value: countryData.languages
                ? Object.values(countryData.languages).join(", ")
                : "N/A",
            },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 bg-gray-700/50 rounded-lg shadow-md">
              <p className="text-lg">
                <span className="font-semibold">{label}:</span> {value}
              </p>
            </div>
          ))}
        </div>

        {/* Flag Image */}
        <div className="mt-8 flex justify-center">
          <Image
            src={countryData.flags.svg}
            alt="Country Flag"
            width={250}
            height={150}
            className="rounded-lg border border-gray-700 shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default CountryInfo;
