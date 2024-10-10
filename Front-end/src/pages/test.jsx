import React, { useState } from 'react';

function Test() {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://swapi.dev/api/people/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPeople(data.results);

            
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const Person = ({ person }) => {
        return (
            <div className="border border-gray-300 rounded-lg p-4 m-2 bg-white shadow-md">
                <h2 className="text-lg font-semibold">{person.name}</h2>
                <p className="mt-2"><strong>Height:</strong> {person.height} cm</p>
                <p><strong>Mass:</strong> {person.mass} kg</p>
                <p><strong>Hair Color:</strong> {person.hair_color}</p>
                <p><strong>Skin Color:</strong> {person.skin_color}</p>
                <p><strong>Eye Color:</strong> {person.eye_color}</p>
                <p><strong>Birth Year:</strong> {person.birth_year}</p>
                <p><strong>Gender:</strong> {person.gender}</p>
            </div>
        );
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">List of People</h1>
            <button 
                onClick={handleData} 
                className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Get List'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {people.map((person) => (
                    <Person key={person.name} person={person} />
                ))}
            </div>
        </div>
    );
}


export default Test;
