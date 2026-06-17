import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import CadastroTestPage from './CadastroTestPage';

describe('CadastroTestPage', () => {
  it('renderiza checklist de cadastros', () => {
    render(<MemoryRouter><CadastroTestPage /></MemoryRouter>);
    expect(screen.getByText(/telas de teste — cadastros/i)).toBeInTheDocument();
    expect(screen.getByText(/RNF01/i)).toBeInTheDocument();
    expect(screen.getByText(/morador — cadastro de local/i)).toBeInTheDocument();
  });
});
