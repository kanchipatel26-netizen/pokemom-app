import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PokemonDetail } from '../PokemonDetail';
import { pokemonApi } from '../../services/pokemonApi';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../services/pokemonApi', () => ({
  pokemonApi: {
    getById: vi.fn(),
  },
  getPokemonImageUrl: (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
}));

const mockPokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: [
    { slot: 1, type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } },
  ],
  stats: [
    { base_stat: 35, effort: 0, stat: { name: 'hp', url: '' } },
    { base_stat: 55, effort: 0, stat: { name: 'attack', url: '' } },
    { base_stat: 40, effort: 0, stat: { name: 'defense', url: '' } },
    { base_stat: 90, effort: 2, stat: { name: 'speed', url: '' } },
  ],
  abilities: [
    { ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 },
  ],
  sprites: {
    front_default: 'https://example.com/25.png',
    back_default: null,
    front_shiny: null,
    back_shiny: null,
  },
};

const renderWithRouter = (pokemonId: string) => {
  return render(
    <MemoryRouter initialEntries={[`/pokemon/${pokemonId}`]}>
      <Routes>
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('PokemonDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    vi.mocked(pokemonApi.getById).mockImplementation(() => new Promise(() => {}));
    renderWithRouter('25');
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays pokemon details after loading', async () => {
    vi.mocked(pokemonApi.getById).mockResolvedValue(mockPokemon);
    renderWithRouter('25');

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    expect(screen.getByText(/#025/)).toBeInTheDocument();
    expect(screen.getByText(/electric/i)).toBeInTheDocument();
  });

  it('displays pokemon stats', async () => {
    vi.mocked(pokemonApi.getById).mockResolvedValue(mockPokemon);
    renderWithRouter('25');

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    expect(screen.getByText(/hp/i)).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
  });

  it('displays pokemon physical attributes', async () => {
    vi.mocked(pokemonApi.getById).mockResolvedValue(mockPokemon);
    renderWithRouter('25');

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    expect(screen.getByText(/0\.4 m/)).toBeInTheDocument();
    expect(screen.getByText(/6\.0 kg/)).toBeInTheDocument();
  });

  it('displays error message on fetch failure', async () => {
    vi.mocked(pokemonApi.getById).mockRejectedValue(new Error('Not found'));
    renderWithRouter('9999');

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });

  it('has a back button to return to list', async () => {
    vi.mocked(pokemonApi.getById).mockResolvedValue(mockPokemon);
    renderWithRouter('25');

    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });

    const backLink = screen.getByRole('link', { name: /back/i });
    expect(backLink).toHaveAttribute('href', '/');
  });
});