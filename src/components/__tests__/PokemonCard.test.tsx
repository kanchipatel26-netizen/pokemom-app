import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { PokemonCard } from '../PokemonCard';

describe('PokemonCard', () => {
  const mockPokemon = {
    id: 25,
    name: 'pikachu',
  };

  it('renders pokemon name', () => {
    render(<PokemonCard id={mockPokemon.id} name={mockPokemon.name} />);
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  });

  it('renders pokemon image with correct src', () => {
    render(<PokemonCard id={mockPokemon.id} name={mockPokemon.name} />);
    const image = screen.getByRole('img', { name: /pikachu/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('25'));
  });

  it('renders pokemon id number', () => {
    render(<PokemonCard id={mockPokemon.id} name={mockPokemon.name} />);
    expect(screen.getByText(/#025/)).toBeInTheDocument();
  });

  it('capitalizes pokemon name', () => {
    render(<PokemonCard id={mockPokemon.id} name={mockPokemon.name} />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });

  it('has a link to the pokemon detail page', () => {
    render(<PokemonCard id={mockPokemon.id} name={mockPokemon.name} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/pokemon/25');
  });
});