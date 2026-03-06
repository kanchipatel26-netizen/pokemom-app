import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { PokemonList } from '../PokemonList';
import { pokemonApi } from '../../services/pokemonApi';

vi.mock('../../services/pokemonApi', () => ({
  pokemonApi: {
    getList: vi.fn(),
  },
  extractIdFromUrl: (url: string) => {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? parseInt(matches[1], 10) : 0;
  },
  getPokemonImageUrl: (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
}));

const mockPokemonList = {
  count: 1302,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
  ],
};

describe('PokemonList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    vi.mocked(pokemonApi.getList).mockImplementation(() => new Promise(() => {}));
    render(<PokemonList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays pokemon cards after loading', async () => {
    vi.mocked(pokemonApi.getList).mockResolvedValue(mockPokemonList);
    render(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });

    expect(screen.getByText('Charmander')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });

  it('displays error message on fetch failure', async () => {
    vi.mocked(pokemonApi.getList).mockRejectedValue(new Error('Network error'));
    render(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });

  it('filters pokemon by search query', async () => {
    vi.mocked(pokemonApi.getList).mockResolvedValue(mockPokemonList);
    const user = userEvent.setup();

    render(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'pika');

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.queryByText('Bulbasaur')).not.toBeInTheDocument();
  });

  it('shows no results message when filter matches nothing', async () => {
    vi.mocked(pokemonApi.getList).mockResolvedValue(mockPokemonList);
    const user = userEvent.setup();

    render(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'xyz123');

    expect(screen.getByText(/no pokemon found/i)).toBeInTheDocument();
  });
});