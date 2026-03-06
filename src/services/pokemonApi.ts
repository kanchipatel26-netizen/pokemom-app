import axios from 'axios';
import type { Pokemon, PokemonListResponse } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonApi = {
  getList: async (limit: number = 20, offset: number = 0): Promise<PokemonListResponse> => {
    const response = await axios.get<PokemonListResponse>(
      `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
    );
    return response.data;
  },

  getById: async (id: number | string): Promise<Pokemon> => {
    const response = await axios.get<Pokemon>(`${BASE_URL}/pokemon/${id}`);
    return response.data;
  },
};

export const extractIdFromUrl = (url: string): number => {
  const matches = url.match(/\/pokemon\/(\d+)\//);
  return matches ? parseInt(matches[1], 10) : 0;
};

export const getPokemonImageUrl = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};