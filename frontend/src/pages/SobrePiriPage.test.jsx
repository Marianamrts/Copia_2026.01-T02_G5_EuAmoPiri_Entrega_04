import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mocks de imagens (assets retornam string em testes)
vi.mock('../assets/piriimagem1.png', () => ({ default: 'piriimagem1.png' }))
vi.mock('../assets/piriimagem2.png', () => ({ default: 'piriimagem2.png' }))
vi.mock('../assets/piriimagem3.png', () => ({ default: 'piriimagem3.png' }))
vi.mock('../assets/piriimagem4.png', () => ({ default: 'piriimagem4.png' }))
vi.mock('../assets/piriimagem5.png', () => ({ default: 'piriimagem5.png' }))
vi.mock('../assets/piriimagem6.png', () => ({ default: 'piriimagem6.png' }))

import SobrePiriPage from './SobrePiriPage'

describe('SobrePiriPage — RF14', () => {
  it('renderiza o título da seção Origem', () => {
    render(<SobrePiriPage />)
    expect(
      screen.getByText(/origem da cidade de pirenópolis/i)
    ).toBeInTheDocument()
  })

  it('renderiza a seção História com aria-labelledby', () => {
    render(<SobrePiriPage />)
    expect(screen.getByRole('region', { name: /história/i })).toBeInTheDocument()
  })

  it('renderiza a seção Atualidade com aria-labelledby', () => {
    render(<SobrePiriPage />)
    expect(screen.getByRole('region', { name: /atualidade/i })).toBeInTheDocument()
  })

  it('todas as imagens têm atributo alt não vazio', () => {
    render(<SobrePiriPage />)
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThanOrEqual(4)
    images.forEach((img) => {
      expect(img).toHaveAttribute('alt')
      expect(img.getAttribute('alt')).not.toBe('')
    })
  })

  it('conteúdo menciona o ano de fundação 1727', () => {
    render(<SobrePiriPage />)
    expect(screen.getByText(/1727/)).toBeInTheDocument()
  })

  it('conteúdo menciona o nome Pirenópolis', () => {
    render(<SobrePiriPage />)
    const matches = screen.getAllByText(/pirenópolis/i)
    expect(matches.length).toBeGreaterThan(0)
  })
})
