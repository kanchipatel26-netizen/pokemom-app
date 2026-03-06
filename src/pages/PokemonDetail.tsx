import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pokemonApi, getPokemonImageUrl } from '../services/pokemonApi';
import type { Pokemon } from '../types/pokemon';

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, '0')}`;
};

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-800',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

export const PokemonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await pokemonApi.getById(id);
        setPokemon(data);
      } catch (err) {
        setError('Failed to load Pokemon details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-xl text-gray-600">Loading Pokemon details...</div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 gap-4">
        <div className="text-xl text-red-600">{error || 'Pokemon not found'}</div>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to list
        </Link>
      </div>
    );
  }

  const imageUrl = getPokemonImageUrl(pokemon.id);

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center text-blue-500 hover:underline mb-6">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to list
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-8">
          <img
            src={imageUrl}
            alt={capitalizeFirst(pokemon.name)}
            className="w-64 h-64 object-contain mx-auto"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {capitalizeFirst(pokemon.name)}
            </h1>
            <span className="text-xl text-gray-500">
              {formatPokemonId(pokemon.id)}
            </span>
          </div>

          <div className="flex gap-2 mb-6">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                  typeColors[t.type.name] || 'bg-gray-400'
                }`}
              >
                {capitalizeFirst(t.type.name)}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">Height</p>
              <p className="text-xl font-semibold">{(pokemon.height / 10).toFixed(1)} m</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">Weight</p>
              <p className="text-xl font-semibold">{(pokemon.weight / 10).toFixed(1)} kg</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Base Stats</h2>
            <div className="space-y-3">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 capitalize">
                      {stat.stat.name.replace('-', ' ')}
                    </span>
                    <span className="font-semibold">{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Abilities</h2>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((ability) => (
                <span
                  key={ability.ability.name}
                  className={`px-3 py-1 rounded-full text-sm ${
                    ability.is_hidden
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {capitalizeFirst(ability.ability.name.replace('-', ' '))}
                  {ability.is_hidden && ' (Hidden)'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};